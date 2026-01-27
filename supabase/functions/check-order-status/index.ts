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
    const orderId = url.searchParams.get('order_id');
    const externalId = url.searchParams.get('external_id');

    if (!orderId && !externalId) {
      return new Response(
        JSON.stringify({ error: 'order_id or external_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let query = supabase
      .from('guest_orders')
      .select('id, name, email, meeting_date, participant_count, price, payment_status, zoom_link, zoom_passcode, meeting_id, expired_at, paid_at, created_at');

    if (orderId) {
      query = query.eq('id', orderId);
    } else if (externalId) {
      // Extract invoice ID from external_id if needed
      query = query.ilike('xendit_invoice_id', `%${externalId}%`);
    }

    const { data: order, error } = await query.single();

    if (error || !order) {
      console.error("Order not found:", { orderId, externalId }, error);
      return new Response(
        JSON.stringify({ error: 'Order tidak ditemukan' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Order status check:", { orderId: order.id, status: order.payment_status });

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: order.id,
          name: order.name,
          email: order.email,
          meeting_date: order.meeting_date,
          participant_count: order.participant_count,
          price: order.price,
          payment_status: order.payment_status,
          zoom_link: order.zoom_link,
          zoom_passcode: order.zoom_passcode,
          meeting_id: order.meeting_id,
          expired_at: order.expired_at,
          paid_at: order.paid_at,
          created_at: order.created_at,
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
