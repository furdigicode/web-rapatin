import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { processPaidOrder } from "../_shared/post-payment.ts";

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

    // Detect if this is Sessions API v3 (has 'event' and 'data' fields) or Invoice API v2
    const isSessionsApi = payload.event && payload.data;
    
    let sessionId: string;
    let status: string;
    let paidAt: string | null = null;

    if (isSessionsApi) {
      // Sessions API v3 format
      const { event, data } = payload;
      console.log("Detected Sessions API v3 format, event:", event);
      
    // Handle payment.capture event for payment method info
    if (event === 'payment.capture') {
      console.log("Processing payment.capture event for payment method");
      
      const referenceId = data.reference_id;
      if (!referenceId) {
        console.log("No reference_id in payment.capture, skipping");
        return new Response(
          JSON.stringify({ success: true, message: 'Skipped - no reference_id' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Build payment method string
      let paymentMethod = data.channel_code || 'Unknown';
      if (data.payment_details?.issuer_name) {
        paymentMethod = `${data.channel_code} (${data.payment_details.issuer_name})`;
      }
      
      console.log("Updating payment method:", { referenceId, paymentMethod });
      
      // Initialize Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Find and update order by xendit_reference_id
      const { error: updateError, data: updateResult } = await supabase
        .from('guest_orders')
        .update({ payment_method: paymentMethod })
        .eq('xendit_reference_id', referenceId)
        .select('id');
      
      if (updateError) {
        console.error("Failed to update payment method:", updateError);
      } else if (updateResult && updateResult.length > 0) {
        console.log("Payment method updated for order:", updateResult[0].id);
      } else {
        console.log("No order found for reference_id:", referenceId);
      }
      
      return new Response(
        JSON.stringify({ success: true, message: 'Payment method processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Handle payment_request.expiry event (Session expiry via reference_id)
    if (event === 'payment_request.expiry') {
      console.log("Processing payment_request.expiry event");
      
      const referenceId = data.reference_id;
      if (!referenceId) {
        console.error("No reference_id in payment_request.expiry");
        return new Response(
          JSON.stringify({ error: 'Missing reference_id' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Initialize Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Find order by xendit_reference_id
      const { data: order, error: findError } = await supabase
        .from('guest_orders')
        .select('id, payment_status')
        .eq('xendit_reference_id', referenceId)
        .maybeSingle();
      
      if (findError) {
        console.error("Error finding order:", findError);
        return new Response(
          JSON.stringify({ error: 'Database error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (!order) {
        console.log("Order not found for reference_id:", referenceId);
        return new Response(
          JSON.stringify({ success: true, message: 'Order not found - might be test' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Don't update if already paid (idempotency)
      if (order.payment_status === 'paid') {
        console.log("Order already paid, skipping expiry update:", order.id);
        return new Response(
          JSON.stringify({ success: true, message: 'Already paid' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Update to expired
      const { error: updateError } = await supabase
        .from('guest_orders')
        .update({ 
          payment_status: 'expired',
          expired_at: data.updated || new Date().toISOString()
        })
        .eq('id', order.id);
      
      if (updateError) {
        console.error("Failed to update order to expired:", updateError);
        return new Response(
          JSON.stringify({ error: 'Update failed' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log("Order marked as expired:", order.id);
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
      
      sessionId = data.payment_session_id;
      status = data.status;
      paidAt = data.updated;
      
      // Log event type for debugging
      if (event === 'payment_session.completed') {
        console.log("Processing payment_session.completed event");
      } else if (event === 'payment_session.expired') {
        console.log("Processing payment_session.expired event");
        status = 'EXPIRED';
      } else if (event === 'payment_session.failed') {
        console.log("Processing payment_session.failed event");
        status = 'FAILED';
      } else {
        console.log("Unknown session event:", event);
      }
    } else {
      // Legacy Invoice API v2 format (backward compatibility)
      console.log("Detected Invoice API v2 format (legacy)");
      sessionId = payload.id;
      status = payload.status;
      paidAt = payload.paid_at;
    }

    if (!sessionId) {
      console.error("Missing session/invoice id in webhook payload");
      return new Response(
        JSON.stringify({ error: 'Invalid payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Extracted webhook data:", { sessionId, status, paidAt });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find the order by xendit_invoice_id (stores payment_session_id for v3)
    const { data: order, error: findError } = await supabase
      .from('guest_orders')
      .select('*')
      .eq('xendit_invoice_id', sessionId)
      .single();

    if (findError || !order) {
      console.error("Order not found for session/invoice:", sessionId, findError);
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
    // Sessions API v3: COMPLETED, EXPIRED, FAILED
    // Invoice API v2: PAID, SETTLED, EXPIRED, FAILED
    let paymentStatus = 'pending';
    if (status === 'COMPLETED' || status === 'PAID' || status === 'SETTLED') {
      paymentStatus = 'paid';
    } else if (status === 'EXPIRED') {
      paymentStatus = 'expired';
    } else if (status === 'FAILED') {
      paymentStatus = 'failed';
    }

    console.log("Updating order status:", { orderId: order.id, status: paymentStatus });

    if (paymentStatus === 'paid') {
      // Shared post-payment pipeline (Rapatin schedule, email, Kledo, admin WA)
      const result = await processPaidOrder(supabase, order, {
        source: 'xendit-webhook',
        paidAt: paidAt,
      });

      if (!result.ok) {
        return new Response(
          JSON.stringify({ error: result.error || 'Failed to update order' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      const { error: updateError } = await supabase
        .from('guest_orders')
        .update({ payment_status: paymentStatus })
        .eq('id', order.id);

      if (updateError) {
        console.error("Failed to update order:", updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update order' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log("Order updated successfully:", order.id, { payment_status: paymentStatus });
    }



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
