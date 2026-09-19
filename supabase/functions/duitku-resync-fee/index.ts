import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkDuitkuTransaction } from "../_shared/duitku.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Find all paid Duitku orders with NULL duitku_fee
    const { data: orders, error: fetchError } = await supabase
      .from('guest_orders')
      .select('id, order_number, duitku_merchant_order_id, duitku_fee, payment_method, price, kledo_invoice_id')
      .eq('payment_gateway', 'duitku')
      .eq('payment_status', 'paid')
      .is('duitku_fee', null)
      .order('created_at', { ascending: false });

    if (fetchError) {
      return new Response(
        JSON.stringify({ error: fetchError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    console.log(`Found ${orders.length} Duitku orders with missing fee`);

    const results: Array<{ order_number: string; merchantOrderId: string; fee: number | null; updated: boolean }> = [];

    for (const order of orders) {
      const merchantOrderId = order.duitku_merchant_order_id || order.order_number;
      console.log(`Checking fee for ${order.order_number} (${merchantOrderId})`);

      const checkResult = await checkDuitkuTransaction(merchantOrderId);

      let updated = false;
      if (checkResult.fee !== null) {
        const { error: updateError } = await supabase
          .from('guest_orders')
          .update({ duitku_fee: checkResult.fee })
          .eq('id', order.id);

        if (updateError) {
          console.error(`Failed to update fee for ${order.order_number}:`, updateError);
        } else {
          updated = true;
          console.log(`Updated ${order.order_number} fee = ${checkResult.fee}`);
        }
      } else {
        console.warn(`No fee returned for ${order.order_number}`);
      }

      results.push({
        order_number: order.order_number,
        merchantOrderId,
        fee: checkResult.fee,
        updated,
      });
    }

    return new Response(
      JSON.stringify({ success: true, processed: results.length, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
