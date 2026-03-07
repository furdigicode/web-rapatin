import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Hardcoded admin WhatsApp number
const ADMIN_PHONE = "6282133579061";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { order_id, event_type } = await req.json();

    if (!order_id || !event_type) {
      return new Response(JSON.stringify({ error: "order_id and event_type are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("KIRIMCHAT_API_KEY");
    if (!apiKey) {
      console.error("Missing KIRIMCHAT_API_KEY");
      return new Response(JSON.stringify({ error: "WhatsApp service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: order, error: orderError } = await supabase
      .from("guest_orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      console.error("Order not found:", orderError);
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Format date
    const meetingDate = new Date(order.meeting_date);
    const formattedDate = meetingDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const dateTimeStr = `${formattedDate}, ${order.meeting_time || "00:00"} WIB`;

    const orderNumber = order.order_number || "-";

    // Determine template name based on event type
    let templateName = "";
    if (event_type === "new_order") {
      templateName = "order_new";
    } else if (event_type === "payment_success") {
      // Template untuk payment_success belum dibuat, skip pengiriman
      console.log(`Skipping admin notification: template for '${event_type}' not yet available. Order: ${order_id}`);
      return new Response(JSON.stringify({ success: true, skipped: true, reason: "Template not yet available" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ error: "Invalid event_type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Sending admin notification (${event_type}) for order:`, order_id);

    const kirimResponse = await fetch("https://api-prod.kirim.chat/api/v1/public/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        phone_number: ADMIN_PHONE,
        channel: "whatsapp",
        message_type: "template",
        template: {
          name: templateName,
          language: { code: "id" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: orderNumber },
                { type: "text", text: order.name },
                { type: "text", text: formatRupiah(order.price) },
                { type: "text", text: order.meeting_topic || "-" },
                { type: "text", text: dateTimeStr },
                { type: "text", text: `${order.participant_count}` },
              ],
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [{ type: "text", text: `${order.access_slug || ""}` }],
            },
          ],
        },
      }),
    });

    const kirimResult = await kirimResponse.json();
    console.log("KirimChat response:", JSON.stringify(kirimResult));

    if (!kirimResponse.ok) {
      console.error("KirimChat error:", kirimResult);
      return new Response(JSON.stringify({ error: "Failed to send admin notification" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Admin notification sent successfully for order:", order_id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in notify-admin-order:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
