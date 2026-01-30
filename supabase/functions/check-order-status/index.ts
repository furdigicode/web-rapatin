import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');
    const orderId = url.searchParams.get('order_id');
    const externalId = url.searchParams.get('external_id');

    if (!slug && !orderId && !externalId) {
      return new Response(
        JSON.stringify({ error: 'slug, order_id, or external_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let query = supabase
      .from('guest_orders')
      .select('id, order_number, name, email, whatsapp, meeting_date, meeting_time, meeting_topic, custom_passcode, participant_count, price, payment_status, payment_method, zoom_link, zoom_passcode, meeting_id, xendit_invoice_url, expired_at, paid_at, created_at, access_slug, is_recurring, recurrence_type, repeat_interval, weekly_days, monthly_day, monthly_week, end_type, recurrence_end_date, recurrence_count, total_days');

    // Priority: slug > orderId > externalId
    if (slug) {
      query = query.eq('access_slug', slug);
    } else if (orderId) {
      query = query.eq('id', orderId);
    } else if (externalId) {
      // Extract invoice ID from external_id if needed
      query = query.ilike('xendit_invoice_id', `%${externalId}%`);
    }

    const { data: order, error } = await query.maybeSingle();

    if (error || !order) {
      console.error("Order not found:", { slug, orderId, externalId }, error);
      return new Response(
        JSON.stringify({ error: 'Order tidak ditemukan' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Order status check:", { slug: order.access_slug, orderId: order.id, status: order.payment_status });

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: order.id,
          order_number: order.order_number,
          name: order.name,
          email: order.email,
          whatsapp: order.whatsapp,
          meeting_date: order.meeting_date,
          meeting_time: order.meeting_time,
          meeting_topic: order.meeting_topic,
          custom_passcode: order.custom_passcode,
          participant_count: order.participant_count,
          price: order.price,
          payment_status: order.payment_status,
          payment_method: order.payment_method,
          zoom_link: order.zoom_link,
          zoom_passcode: order.zoom_passcode,
          meeting_id: order.meeting_id,
          xendit_invoice_url: order.xendit_invoice_url,
          expired_at: order.expired_at,
          paid_at: order.paid_at,
          created_at: order.created_at,
          // Recurring meeting fields
          is_recurring: order.is_recurring,
          recurrence_type: order.recurrence_type,
          repeat_interval: order.repeat_interval,
          weekly_days: order.weekly_days,
          monthly_day: order.monthly_day,
          monthly_week: order.monthly_week,
          end_type: order.end_type,
          recurrence_end_date: order.recurrence_end_date,
          recurrence_count: order.recurrence_count,
          total_days: order.total_days,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: 'Terjadi kesalahan server' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
