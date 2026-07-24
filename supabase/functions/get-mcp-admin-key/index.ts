import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const mcpKey = Deno.env.get('MCP_ADMIN_API_KEY') || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { token } = await req.json().catch(() => ({ token: null }))

    if (!token || typeof token !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing admin token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Decode base64 payload (same format as admin-auth)
    let payload: { sub?: string; email?: string; exp?: number } | null = null
    try {
      payload = JSON.parse(atob(token))
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const now = Math.floor(Date.now() / 1000)
    if (!payload?.exp || payload.exp < now || !payload.sub || !payload.email) {
      return new Response(
        JSON.stringify({ error: 'Token expired' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify admin_users active
    const { data: adminUser, error: adminErr } = await supabase
      .from('admin_users')
      .select('id, email, is_active')
      .eq('id', payload.sub)
      .eq('email', payload.email)
      .eq('is_active', true)
      .maybeSingle()

    if (adminErr || !adminUser) {
      return new Response(
        JSON.stringify({ error: 'Not authorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify session exists and is not expired
    const { data: session } = await supabase
      .from('admin_sessions')
      .select('id, expires_at')
      .eq('admin_id', adminUser.id)
      .eq('token_hash', token)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Session not found or expired' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!mcpKey) {
      return new Response(
        JSON.stringify({ error: 'MCP_ADMIN_API_KEY belum diset di Supabase Secrets' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ key: mcpKey }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('get-mcp-admin-key error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
