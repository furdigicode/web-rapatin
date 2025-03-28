
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Get existing admin user
    const { data: adminUser, error: queryError } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', 'admin@rapatin.id')
      .single()

    if (queryError) {
      throw new Error(`Error fetching admin user: ${queryError.message}`)
    }

    // Check if admin user exists in auth
    const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail('admin@rapatin.id')

    if (existingUser?.user) {
      return new Response(
        JSON.stringify({ 
          message: 'Admin user already exists in auth',
          user: existingUser.user
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create admin user in auth
    const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@rapatin.id',
      password: 'admin123',
      email_confirm: true
    })

    if (createError) {
      throw new Error(`Error creating admin user: ${createError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        message: 'Admin user created successfully', 
        user: createdUser.user 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
