import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'
import { create, verify } from 'https://deno.land/x/djwt@v2.8/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const jwtSecret = new TextEncoder().encode(Deno.env.get('JWT_SECRET') || 'your-secret-key')

const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, email, password, token } = await req.json()

    switch (action) {
      case 'login':
        return await handleLogin(email, password)
      case 'verify':
        return await handleVerify(token)
      case 'logout':
        return await handleLogout(token)
      case 'setup':
        return await handleSetup(email, password)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Admin auth error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleLogin(email: string, password: string) {
  try {
    // Get admin user
    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    if (adminError || !admin) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash)
    if (!isValidPassword) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create JWT token
    const payload = {
      sub: admin.id,
      email: admin.email,
      exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60), // 2 hours
      iat: Math.floor(Date.now() / 1000),
    }

    const token = await create({ alg: 'HS256', typ: 'JWT' }, payload, jwtSecret)

    // Create session record
    const tokenHash = await bcrypt.hash(token, 10)
    const { error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        admin_id: admin.id,
        token_hash: tokenHash,
        expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      })

    if (sessionError) {
      console.error('Session creation error:', sessionError)
    }

    // Update last login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        token,
        admin: { id: admin.id, email: admin.email }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Login error:', error)
    return new Response(
      JSON.stringify({ error: 'Login failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleVerify(token: string) {
  try {
    const payload = await verify(token, jwtSecret)
    
    // Check if session exists and is valid
    const { data: session } = await supabase
      .from('admin_sessions')
      .select('*, admin_users(*)')
      .gt('expires_at', new Date().toISOString())
      .single()

    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Invalid session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update last used
    await supabase
      .from('admin_sessions')
      .update({ last_used: new Date().toISOString() })
      .eq('id', session.id)

    return new Response(
      JSON.stringify({ 
        valid: true,
        admin: { id: session.admin_users.id, email: session.admin_users.email }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid token' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleLogout(token: string) {
  try {
    // Delete session
    const payload = await verify(token, jwtSecret)
    await supabase
      .from('admin_sessions')
      .delete()
      .eq('admin_id', payload.sub)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: true }), // Always return success for logout
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleSetup(email: string, password: string) {
  try {
    console.log('Starting admin setup for email:', email)
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)
    console.log('Password hashed successfully')
    
    // Check if admin user exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('id, email, password_hash')
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing admin:', checkError)
      return new Response(
        JSON.stringify({ error: 'Setup check failed', details: checkError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let result
    if (existingAdmin) {
      // Update existing admin
      console.log('Updating existing admin user')
      result = await supabase
        .from('admin_users')
        .update({ password_hash: passwordHash })
        .eq('email', email)
    } else {
      // Create new admin
      console.log('Creating new admin user')
      result = await supabase
        .from('admin_users')
        .insert({ 
          email: email, 
          password_hash: passwordHash,
          is_active: true 
        })
    }

    if (result.error) {
      console.error('Database operation failed:', result.error)
      return new Response(
        JSON.stringify({ error: 'Setup failed', details: result.error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Admin setup completed successfully')
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Setup error:', error)
    return new Response(
      JSON.stringify({ error: 'Setup failed', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}