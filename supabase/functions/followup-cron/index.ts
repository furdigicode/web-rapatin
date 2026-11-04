// Hourly follow-up: WhatsApp new Rapatin members who registered recently
// and still have no orders at the time of the run. Each member is contacted once.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { runQuery } from '../_shared/mysql.ts'
import { buildTextComponents, templateVariables } from '../_shared/template-variables.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
const supabase = createClient(supabaseUrl, serviceKey)
const LOOKBACK_HOURS = 3 // covers a missed run; dedup prevents double sends
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

function normalizePhone(raw: string) {
  let p = String(raw ?? '').replace(/\D/g, '')
  if (p.startsWith('0')) p = '62' + p.slice(1)
  else if (!p.startsWith('62')) p = '62' + p
  return p
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  const key = req.headers.get('apikey') ?? req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!anonKey || key !== anonKey) return json({ error: 'Not authorized' }, 403)
  try {
    const apiKey = Deno.env.get('KIRIMCHAT_API_KEY')
    if (!apiKey) return json({ error: 'KIRIMCHAT_API_KEY belum diatur' }, 500)
    const { data: settings } = await supabase.from('followup_settings').select('*').eq('id', 'default').maybeSingle()
    const template = settings?.template_name?.trim()
    if (!template) return json({ skipped: 'Template belum diatur' })
    const lang = settings?.template_language || 'id'
    const { data: tplInfo } = await supabase.from('kirimchat_templates')
      .select('header_type, header_content, body_content').eq('template_name', template).eq('language', lang).maybeSingle()
    if (!tplInfo) return json({ error: 'Template belum tersinkron' }, 400)
    const keys = templateVariables(tplInfo)

    const { rows } = await runQuery(
      `SELECT u.id, u.name, u.email, u.phone, u.created_at FROM users u
       WHERE u.created_at > NOW() - INTERVAL ${LOOKBACK_HOURS} HOUR AND u.created_at <= NOW()
         AND u.phone IS NOT NULL AND u.phone <> ''
         AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = u.id)
       ORDER BY u.created_at ASC LIMIT 200`)
    if (!rows.length) return json({ candidates: 0, sent: 0 })

    const ids = rows.map((r) => String(r.id))
    const { data: done } = await supabase.from('followup_logs').select('mysql_user_id')
      .eq('is_test', false).eq('status', 'success').in('mysql_user_id', ids)
    const skip = new Set((done ?? []).map((d) => d.mysql_user_id))

    let sent = 0, failed = 0
    for (const u of rows) {
      if (skip.has(String(u.id))) continue
      const phone = normalizePhone(u.phone)
      const firstName = String(u.name ?? '').trim().split(/\s+/)[0] || 'Kak'
      let result: any = {}, ok = false, errMsg: string | null = null
      try {
        const components = buildTextComponents(tplInfo,
          keys.header.map(() => firstName), keys.body.map(() => firstName),
          { mirrorHeaderOnlyToBody: template === 'activation_user' })
        const tpl: Record<string, unknown> = { name: template, language: { code: lang } }
        if (components.length) tpl.components = components
        const res = await fetch('https://api-prod.kirim.chat/api/v1/public/messages/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}`, 'User-Agent': 'Rapatin-FollowUp/1.0' },
          body: JSON.stringify({ phone_number: phone, channel: 'whatsapp', message_type: 'template', template: tpl }),
        })
        result = await res.json().catch(() => ({}))
        ok = res.ok
        if (!ok) {
          const e = result?.error
          errMsg = (typeof e === 'object' && e?.message) || result?.message || (typeof e === 'string' ? e : null) || `HTTP ${res.status}`
        }
      } catch (e) { errMsg = (e as Error).message }
      ok ? sent++ : failed++
      await supabase.from('followup_logs').insert({
        mysql_user_id: String(u.id), name: u.name, email: u.email, phone, template_name: template,
        status: ok ? 'success' : 'failed', is_test: false, response: result, error_message: errMsg,
      })
    }
    return json({ candidates: rows.length, skipped: skip.size, sent, failed })
  } catch (e) {
    console.error('followup-cron error:', e)
    return json({ error: (e as Error).message }, 500)
  }
})
