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
    .from('admin_users')
    .select('id, email, is_active')
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
    const { token } = await req.json().catch(() => ({ token: null }))
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

    const { data, error } = await supabase
      .from('mysql_connection_config')
      .select('host, port, database, username, password, updated_at, updated_by')
      .eq('id', 'singleton')
      .maybeSingle()

    if (error) throw error

    // Fallback to env if row is empty (first-time deploy).
    const host = data?.host || Deno.env.get('RAPATIN_MYSQL_HOST') || ''
    const port = data?.port ?? parseInt(Deno.env.get('RAPATIN_MYSQL_PORT') ?? '3306', 10)
    const database = data?.database || Deno.env.get('RAPATIN_MYSQL_DATABASE') || ''
    const user = data?.username || Deno.env.get('RAPATIN_MYSQL_USER') || ''
    const password = data?.password || Deno.env.get('RAPATIN_MYSQL_PASSWORD') || ''

    return new Response(
      JSON.stringify({
        host, port: String(port), database, user, password,
        updated_at: data?.updated_at ?? null,
        updated_by: data?.updated_by ?? null,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('get-mysql-config error:', error)
    return new Response(JSON.stringify({ error: (error as Error).message ?? 'Internal error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
