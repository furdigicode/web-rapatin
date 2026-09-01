import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { callbackSignature, getDuitkuCredentials } from "../_shared/duitku.ts";
import { processPaidOrder } from "../_shared/post-payment.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const creds = getDuitkuCredentials();
    if (!creds) {
      console.error('Duitku credentials not configured');
      return json({ error: 'Payment gateway not configured' }, 500);
    }

    // Duitku posts application/x-www-form-urlencoded by default
    let body: Record<string, string> = {};
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const form = await req.formData();
      body = Object.fromEntries(form.entries()) as Record<string, string>;
    }

    console.log('Duitku callback received:', JSON.stringify(body));

    const merchantOrderId = body.merchantOrderId;
    const amount = body.amount;
    const resultCode = body.resultCode;
    const reference = body.reference;
    const paymentCode = body.paymentCode || body.paymentMethod || null;
    const signature = body.signature;

    if (!merchantOrderId || !amount || !signature) {
      console.error('Missing required callback fields');
      return json({ error: 'Invalid payload' }, 400);
    }

    const expected = await callbackSignature(creds.merchantCode, amount, merchantOrderId, creds.apiKey);
    if (signature !== expected) {
      console.error('Invalid Duitku signature for order:', merchantOrderId);
      return json({ error: 'Invalid signature' }, 403);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: order, error: findError } = await supabase
      .from('guest_orders')
      .select('*')
      .eq('duitku_merchant_order_id', merchantOrderId)
      .maybeSingle();

    if (findError) {
      console.error('Error finding order:', findError);
      return json({ error: 'Database error' }, 500);
    }

    if (!order) {
      console.error('Order not found for Duitku merchantOrderId:', merchantOrderId);
      return json({ error: 'Order not found' }, 404);
    }

    // Idempotency
    if (order.payment_status === 'paid') {
      console.log('Order already processed:', order.id);
      return json({ success: true, message: 'Already processed' });
    }

    // Duitku: resultCode "00" = success, "01" = failed/pending-failed
    const isPaid = resultCode === '00';

    // Fee reported by Duitku (field name varies / may be absent)
    const rawFee = body.fee ?? body.totalFee ?? body.amountFee ?? null;
    const duitkuFee = rawFee !== null && rawFee !== '' ? Math.round(Number(rawFee)) : null;

    const gatewayUpdate: Record<string, unknown> = {
      duitku_reference: reference || order.duitku_reference || null,
      duitku_payment_code: paymentCode,
      payment_method: paymentCode || order.payment_method || 'Duitku',
    };
    if (duitkuFee !== null && !Number.isNaN(duitkuFee)) {
      gatewayUpdate.duitku_fee = duitkuFee;
    }

    if (!isPaid) {
      console.log('Duitku payment not successful:', { merchantOrderId, resultCode });
      const { error: updateError } = await supabase
        .from('guest_orders')
        .update({ ...gatewayUpdate, payment_status: 'failed' })
        .eq('id', order.id);
      if (updateError) {
        console.error('Failed to update failed order:', updateError);
        return json({ error: 'Update failed' }, 500);
      }
      return json({ success: true, message: 'Payment failed recorded' });
    }

    const result = await processPaidOrder(supabase, order, {
      source: 'duitku-callback',
      paidAt: new Date().toISOString(),
      extraUpdate: gatewayUpdate,
    });

    if (!result.ok) {
      return json({ error: result.error || 'Failed to process order' }, 500);
    }

    return json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return json({ error: 'Internal server error' }, 500);
  }
});
