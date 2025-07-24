import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract notification ID from URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const notificationId = pathParts[pathParts.length - 2]; // Get ID from path like /mark-notification-read/uuid/read

    if (!notificationId) {
      return new Response(
        JSON.stringify({ error: 'Notification ID is required' }),
        {
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
        }
      );
    }

    console.log('Marking notification as read:', notificationId);

    // Update notification read status
    const { error } = await supabase
      .from('article_notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Successfully marked notification as read:', notificationId);

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );

  } catch (error) {
    console.error('Error in mark-notification-read function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to mark notification as read',
        details: error.message 
      }), 
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});