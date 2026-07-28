import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verifyAdmin(token: string) {
  let payload: { sub?: string; email?: string; exp?: number } | null = null
  try { payload = JSON.parse(atob(token)) } catch { return null }
  const now = Math.floor(Date.now() / 1000)
  if (!payload?.exp || payload.exp < now || !payload.sub || !payload.email) return null
  const { data: adminUser } = await supabase
    .from('admin_users').select('id, email, is_active')
    .eq('id', payload.sub).eq('email', payload.email).eq('is_active', true)
    .maybeSingle()
  if (!adminUser) return null
  const { data: session } = await supabase
    .from('admin_sessions').select('id')
    .eq('admin_id', adminUser.id).eq('token_hash', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()
  if (!session) return null
  return adminUser
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  try {
    const body = await req.json().catch(() => ({}))
    const { token, host, port, database, user, password } = body ?? {}

    if (!token || typeof token !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing admin token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const admin = await verifyAdmin(token)
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Not authorized' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Validate
    if (typeof host !== 'string' || !host.trim()) throw new Error('Host wajib diisi')
    if (typeof database !== 'string' || !database.trim()) throw new Error('Database wajib diisi')
    if (typeof user !== 'string' || !user.trim()) throw new Error('Username wajib diisi')
    if (typeof password !== 'string') throw new Error('Password tidak valid')
    const portNum = parseInt(String(port ?? '3306'), 10)
    if (!Number.isFinite(portNum) || portNum < 1 || portNum > 65535) throw new Error('Port tidak valid')

    const { data, error } = await supabase
      .from('mysql_connection_config')
      .upsert({
        id: 'singleton',
        host: host.trim(),
        port: portNum,
        database: database.trim(),
        username: user.trim(),
        password,
        updated_by: admin.email,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })
      .select('updated_at, updated_by')
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ ok: true, updated_at: data.updated_at, updated_by: data.updated_by }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('update-mysql-config error:', error)
    return new Response(JSON.stringify({ error: (error as Error).message ?? 'Internal error' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
