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

    // Extract notification ID from URL path or body
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    let notificationId = pathParts[pathParts.length - 2]; // Get ID from path like /mark-notification-read/uuid/read
    
    const body = await req.json();
    const userId = body.userId || 'anonymous';
    
    // If no notification ID in path, try to get it from body
    if (!notificationId || notificationId === 'mark-notification-read') {
      notificationId = body.notificationId;
    }

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

    console.log('Marking notification as read:', { notificationId, userId });

    // Insert or update user notification read status
    const { error } = await supabase
      .from('user_notification_read_status')
      .upsert({
        user_id: userId,
        notification_id: notificationId,
        read_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,notification_id'
      });

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