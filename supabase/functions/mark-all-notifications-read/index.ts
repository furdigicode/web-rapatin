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

    const body = await req.json();
    const { userId, categories } = body;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        {
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
        }
      );
    }

    console.log('Marking all notifications as read for user:', { userId, categories });

    // Get all notifications (with optional category filter)
    let query = supabase
      .from('article_notifications')
      .select('id');
    
    if (categories && categories.length > 0) {
      query = query.in('category', categories);
    }

    const { data: notifications, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching notifications:', fetchError);
      throw fetchError;
    }

    if (!notifications || notifications.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No notifications to mark as read' }),
        {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
        }
      );
    }

    // Create read status records for all notifications
    const readStatusRecords = notifications.map(notification => ({
      user_id: userId,
      notification_id: notification.id,
      read_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('user_notification_read_status')
      .upsert(readStatusRecords, {
        onConflict: 'user_id,notification_id'
      });

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Successfully marked all notifications as read for user:', userId);

    return new Response(
      JSON.stringify({ success: true, count: notifications.length }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );

  } catch (error) {
    console.error('Error in mark-all-notifications-read function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to mark all notifications as read',
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