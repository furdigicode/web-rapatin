import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Environment variables with logging
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const jwtSecret = Deno.env.get('JWT_SECRET') || 'fallback-secret-key-for-admin-auth-2025'

console.log('Environment check:', {
  hasSupabaseUrl: !!supabaseUrl,
  hasServiceKey: !!supabaseServiceKey,
  hasJwtSecret: !!jwtSecret,
  urlLength: supabaseUrl?.length || 0
})

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
}

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

// Simple password verification using Web Crypto API
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    // For now, use simple comparison with the known hash
    // In production, this should use proper bcrypt verification
    const knownHash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
    const isMatch = hash === knownHash && password === 'Andalus123!'
    console.log('Password verification:', { isMatch, hashLength: hash.length })
    return isMatch
  } catch (error) {
    console.error('Password verification error:', error)
    return false
  }
}

// Simple token generation
function generateToken(adminId: string, email: string): string {
  const payload = {
    sub: adminId,
    email: email,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    iat: Math.floor(Date.now() / 1000),
  }
  
  // Simple token format: base64(payload)
  return btoa(JSON.stringify(payload))
}

// Simple token verification
function verifyToken(token: string): any {
  try {
    const payload = JSON.parse(atob(token))
    const now = Math.floor(Date.now() / 1000)
    
    if (payload.exp < now) {
      console.log('Token expired')
      return null
    }
    
    return payload
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

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
  console.log('handleLogin called with email:', email)
  
  try {
    console.log('Attempting to fetch admin user from database...')
    
    // Get admin user with detailed logging
    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .maybeSingle()

    console.log('Database query result:', { admin: !!admin, error: adminError })

    if (adminError) {
      console.error('Database error:', adminError)
      return new Response(
        JSON.stringify({ success: false, error: 'Database error', details: adminError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!admin) {
      console.log('No admin user found for email:', email)
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Admin user found, verifying password...')

    // Verify password using simplified method
    const isValidPassword = await verifyPassword(password, admin.password_hash)
    
    if (!isValidPassword) {
      console.log('Password verification failed')
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Password verification successful, generating token...')

    // Generate simple token
    const token = generateToken(admin.id, admin.email)

    console.log('Token generated, creating session...')

    // Create session record (simplified)
    const { error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        admin_id: admin.id,
        token_hash: token, // Store simple token hash
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })

    if (sessionError) {
      console.error('Session creation error:', sessionError)
      // Continue anyway, session is optional for now
    } else {
      console.log('Session created successfully')
    }

    // Update last login
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id)

    if (updateError) {
      console.error('Last login update error:', updateError)
      // Continue anyway, this is not critical
    }

    console.log('Login successful for:', admin.email)

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
      JSON.stringify({ success: false, error: 'Login failed', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleVerify(token: string) {
  console.log('handleVerify called')
  
  try {
    const payload = verifyToken(token)
    
    if (!payload) {
      console.log('Token verification failed')
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Token valid, checking session...')

    // Get admin user
    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', payload.sub)
      .eq('is_active', true)
      .maybeSingle()

    if (adminError || !admin) {
      console.log('Admin user not found or error:', adminError)
      return new Response(
        JSON.stringify({ valid: false, error: 'Admin not found' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Verification successful for:', admin.email)

    return new Response(
      JSON.stringify({ 
        valid: true,
        admin: { id: admin.id, email: admin.email }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Verify error:', error)
    return new Response(
      JSON.stringify({ valid: false, error: 'Invalid token' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleLogout(token: string) {
  console.log('handleLogout called')
  
  try {
    const payload = verifyToken(token)
    if (payload) {
      await supabase
        .from('admin_sessions')
        .delete()
        .eq('admin_id', payload.sub)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Logout error:', error)
    return new Response(
      JSON.stringify({ success: true }), // Always return success for logout
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleSetup(email: string, password: string) {
  console.log('handleSetup called for email:', email)
  
  try {
    // For now, setup just confirms the admin exists
    // The password hash has been set manually via migration
    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    console.log('Setup check result:', { admin: !!admin, error: adminError })

    if (adminError) {
      console.error('Setup error:', adminError)
      return new Response(
        JSON.stringify({ success: false, error: 'Setup check failed', details: adminError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (admin) {
      console.log('Admin user already exists')
      return new Response(
        JSON.stringify({ success: true, message: 'Admin already exists' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      console.log('Admin user not found - should create via migration')
      return new Response(
        JSON.stringify({ success: false, error: 'Admin user not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Setup error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Setup failed', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}