import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

function normalizePhone(raw: string) {
  let p = raw.replace(/\D/g, '')
  if (p.startsWith('0')) p = '62' + p.slice(1)
  else if (!p.startsWith('62')) p = '62' + p
  return p
}

const nameOk = (s: unknown): s is string => typeof s === 'string' && /^[a-zA-Z0-9_\-]{1,100}$/.test(s.trim())

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  try {
    const body = await req.json().catch(() => ({}))
    const admin = typeof body?.token === 'string' ? await verifyAdmin(body.token) : null
    if (!admin) return json({ error: 'Not authorized' }, 403)

    if (body.action === 'get') {
      const { data: settings } = await supabase.from('followup_settings').select('*').eq('id', 'default').maybeSingle()
      const { data: logs } = await supabase.from('followup_logs').select('*').order('created_at', { ascending: false }).limit(300)
      return json({ settings, logs: logs ?? [] })
    }

    if (body.action === 'save') {
      if (!nameOk(body.template_name)) return json({ error: 'Nama template tidak valid (huruf, angka, _ atau -)' }, 400)
      const lang = typeof body.template_language === 'string' && body.template_language.trim() ? body.template_language.trim().slice(0, 10) : 'id'
      const { error } = await supabase.from('followup_settings').upsert({
        id: 'default', template_name: body.template_name.trim(), template_language: lang, updated_by: admin.email,
      })
      if (error) throw error
      return json({ ok: true })
    }

    if (body.action === 'test') {
      if (!nameOk(body.template_name)) return json({ error: 'Nama template tidak valid' }, 400)
      if (typeof body.phone !== 'string' || body.phone.replace(/\D/g, '').length < 8) return json({ error: 'Nomor tidak valid' }, 400)
      const apiKey = Deno.env.get('KIRIMCHAT_API_KEY')
      if (!apiKey) return json({ error: 'KIRIMCHAT_API_KEY belum diatur' }, 500)
      const phone = normalizePhone(body.phone)
      const template = body.template_name.trim()
      const lang = typeof body.template_language === 'string' && body.template_language.trim() ? body.template_language.trim() : 'id'
      const params = Array.isArray(body.variables)
        ? body.variables.filter((v: unknown) => typeof v === 'string' && v.length).slice(0, 10)
        : []
      const tpl: Record<string, unknown> = { name: template, language: { code: lang } }
      if (params.length) tpl.components = [{ type: 'body', parameters: params.map((t: string) => ({ type: 'text', text: t })) }]
      const res = await fetch('https://api-prod.kirim.chat/api/v1/public/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ phone_number: phone, channel: 'whatsapp', message_type: 'template', template: tpl }),
      })
      const result = await res.json().catch(() => ({}))
      const rawErr = result?.error
      const errMsg = res.ok ? null : (
        (typeof rawErr === 'object' && rawErr?.message) || result?.message ||
        (typeof rawErr === 'string' ? rawErr : null) || `HTTP ${res.status}`)
      await supabase.from('followup_logs').insert({
        name: 'Uji coba', phone, template_name: template, status: res.ok ? 'success' : 'failed',
        is_test: true, response: result, error_message: errMsg ? String(errMsg) : null,
      })
      return json({ ok: res.ok, error: errMsg, response: result })
    }

    return json({ error: 'Unknown action' }, 400)
  } catch (e) {
    console.error('followup-admin error:', e)
    return json({ error: (e as Error).message }, 500)
  }
})
