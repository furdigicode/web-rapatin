import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-callback-token',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify webhook token
    const webhookToken = req.headers.get('x-callback-token');
    const expectedToken = Deno.env.get('XENDIT_WEBHOOK_TOKEN');

    if (!expectedToken) {
      console.error("XENDIT_WEBHOOK_TOKEN not configured");
      return new Response(
        JSON.stringify({ error: 'Webhook not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (webhookToken !== expectedToken) {
      console.error("Invalid webhook token");
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = await req.json();
    console.log("Received Xendit webhook:", JSON.stringify(payload));

    const { id, external_id, status, paid_at } = payload;

    if (!id) {
      console.error("Missing invoice id in webhook payload");
      return new Response(
        JSON.stringify({ error: 'Invalid payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find the order by xendit_invoice_id
    const { data: order, error: findError } = await supabase
      .from('guest_orders')
      .select('*')
      .eq('xendit_invoice_id', id)
      .single();

    if (findError || !order) {
      console.error("Order not found for invoice:", id, findError);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for idempotency - don't process already paid orders
    if (order.payment_status === 'paid') {
      console.log("Order already processed:", order.id);
      return new Response(
        JSON.stringify({ success: true, message: 'Already processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map Xendit status to our status
    let paymentStatus = 'pending';
    if (status === 'PAID' || status === 'SETTLED') {
      paymentStatus = 'paid';
    } else if (status === 'EXPIRED') {
      paymentStatus = 'expired';
    } else if (status === 'FAILED') {
      paymentStatus = 'failed';
    }

    console.log("Updating order status:", { orderId: order.id, status: paymentStatus });

    // Update order status
    const updateData: Record<string, unknown> = {
      payment_status: paymentStatus,
    };

    if (paymentStatus === 'paid' && paid_at) {
      updateData.paid_at = paid_at;
    }

    // If payment is successful, call Rapatin API to create meeting
    if (paymentStatus === 'paid') {
      console.log("Payment successful, preparing to call Rapatin API...");
      
      // TODO: Integrate with Rapatin API
      // The Rapatin API integration will be added later
      // For now, we'll just mark as paid and store placeholder data
      
      // Placeholder for Rapatin API integration
      // const rapatinApiUrl = Deno.env.get('RAPATIN_API_URL');
      // const rapatinApiKey = Deno.env.get('RAPATIN_API_KEY');
      // 
      // const rapatinResponse = await fetch(`${rapatinApiUrl}/create-meeting`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${rapatinApiKey}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     name: order.name,
      //     email: order.email,
      //     whatsapp: order.whatsapp,
      //     meeting_date: order.meeting_date,
      //     participant_count: order.participant_count,
      //   }),
      // });
      // 
      // if (rapatinResponse.ok) {
      //   const rapatinData = await rapatinResponse.json();
      //   updateData.rapatin_order_id = rapatinData.order_id;
      //   updateData.zoom_link = rapatinData.zoom_link;
      //   updateData.zoom_passcode = rapatinData.passcode;
      //   updateData.meeting_id = rapatinData.meeting_id;
      // }

      console.log("Rapatin API integration pending - order marked as paid");
    }

    const { error: updateError } = await supabase
      .from('guest_orders')
      .update(updateData)
      .eq('id', order.id);

    if (updateError) {
      console.error("Failed to update order:", updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Order updated successfully:", order.id);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
