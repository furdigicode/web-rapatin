import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { forwardToMember } from '../_shared/duitku-forward.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

async function verifyAdmin(token: string) {
  let payload: { sub?: string; email?: string; exp?: number } | null = null
  try { payload = JSON.parse(atob(token)) } catch { return null }
  if (!payload?.exp || payload.exp < Math.floor(Date.now() / 1000) || !payload.sub || !payload.email) return null
  const { data: adminUser } = await supabase.from('admin_users').select('id, email')
    .eq('id', payload.sub).eq('email', payload.email).eq('is_active', true).maybeSingle()
  if (!adminUser) return null
  const { data: session } = await supabase.from('admin_sessions').select('id')
    .eq('admin_id', adminUser.id).eq('token_hash', token).gt('expires_at', new Date().toISOString()).maybeSingle()
  return session ? adminUser : null
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  try {
    const body = await req.json().catch(() => ({}))
    const { token, action } = body ?? {}
    if (typeof token !== 'string' || !(await verifyAdmin(token))) return json({ error: 'Not authorized' }, 403)

    if (action === 'list') {
      let q = supabase.from('duitku_callback_log').select('*').order('created_at', { ascending: false }).limit(200)
      if (['quick_order', 'member', 'unknown'].includes(body.destination)) q = q.eq('destination', body.destination)
      if (['success', 'failed', 'invalid'].includes(body.status)) q = q.eq('status', body.status)
      if (typeof body.search === 'string' && body.search.trim()) {
        q = q.ilike('merchant_order_id', `%${body.search.trim().slice(0, 100)}%`)
      }
      const { data, error } = await q
      if (error) throw error
      return json({ rows: data })
    }

    if (action === 'resend') {
      if (typeof body.id !== 'string') return json({ error: 'id required' }, 400)
      const { data: row, error } = await supabase.from('duitku_callback_log').select('*').eq('id', body.id).maybeSingle()
      if (error || !row) return json({ error: 'Log not found' }, 404)
      if (row.destination !== 'member') return json({ error: 'Hanya callback Member yang bisa dikirim ulang' }, 400)
      const fwd = await forwardToMember(row.payload as Record<string, string>)
      const update = {
        status: fwd.ok ? 'success' : 'failed',
        target_url: fwd.targetUrl,
        response_status: fwd.status,
        response_body: fwd.body,
        duration_ms: fwd.durationMs,
        error_message: fwd.error ?? null,
        resend_count: (row.resend_count ?? 0) + 1,
      }
      await supabase.from('duitku_callback_log').update(update).eq('id', row.id)
      return json({ ok: fwd.ok, ...update })
    }

    return json({ error: 'Unknown action' }, 400)
  } catch (e) {
    console.error('duitku-callback-admin error:', e)
    return json({ error: (e as Error).message }, 500)
  }
})
