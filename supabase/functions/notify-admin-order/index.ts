import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { kirimdevSendTemplate } from "../_shared/kirimdev.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Hardcoded admin WhatsApp number
const ADMIN_PHONE = "6282133579061";

function formatAmount(amount: number): string {
  // Template already contains "Rp " prefix. Return only the number with Indonesian thousand separators.
  return (amount ?? 0).toLocaleString("id-ID", { maximumFractionDigits: 0 }).replace(/\u00A0/g, " ");
}

function sanitizeParam(v: unknown): string {
  const s = String(v ?? "");
  // Meta rejects newlines/tabs and >4 consecutive spaces in template params.
  return s.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
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

    if (!Deno.env.get("KIRIMDEV_API_KEY") || !Deno.env.get("KIRIMDEV_PHONE_NUMBER_ID")) {
      console.error("Missing Kirimdev credentials");
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

    const meetingDate = new Date(order.meeting_date);
    const formattedDate = meetingDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const dateTimeStr = `${formattedDate}, ${order.meeting_time || "00:00"} WIB`;

    const orderNumber = order.order_number || "-";

    let templateName = "";
    if (event_type === "new_order") {
      templateName = "order_new";
    } else if (event_type === "payment_success") {
      templateName = "order_paid";
    } else {
      return new Response(JSON.stringify({ error: "Invalid event_type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Sending admin notification (${event_type}) for order:`, order_id);

    const bodyParams = [
      { label: "{{1}} order_number", value: sanitizeParam(orderNumber) },
      { label: "{{2}} name", value: sanitizeParam(order.name) },
      { label: "{{3}} amount", value: formatAmount(order.price) },
      { label: "{{4}} topic", value: sanitizeParam(order.meeting_topic || "-") },
      { label: "{{5}} datetime", value: sanitizeParam(dateTimeStr) },
      { label: "{{6}} participants", value: sanitizeParam(order.participant_count) },
    ];
    const buttonParam = sanitizeParam(order.access_slug || "");

    for (const p of bodyParams) {
      console.log(`param ${p.label}: "${p.value}" (len=${p.value.length}, codes=[${[...p.value].slice(0, 40).map((c) => c.charCodeAt(0)).join(",")}])`);
    }
    console.log(`param button {{1}} slug: "${buttonParam}" (len=${buttonParam.length})`);

    const components = [
      {
        type: "body",
        parameters: bodyParams.map((p) => ({ type: "text", text: p.value })),
      },
      {
        type: "button",
        sub_type: "url",
        index: "0",
        parameters: [{ type: "text", text: buttonParam }],
      },
    ];

    console.log("Kirimdev request payload:", JSON.stringify({ template: templateName, language: "id", components }));

    const kirimResponse = await kirimdevSendTemplate({
      to: ADMIN_PHONE,
      name: templateName,
      languageCode: "id",
      components,
    });

    const kirimRaw = await kirimResponse.text();
    let kirimResult: any = null;
    try { kirimResult = JSON.parse(kirimRaw); } catch { /* keep raw */ }
    console.log(`Kirimdev HTTP ${kirimResponse.status} response:`, kirimRaw);

    if (!kirimResponse.ok) {
      console.error("Kirimdev error:", kirimRaw);
      return new Response(
        JSON.stringify({
          error: "Failed to send admin notification",
          kirimdev_status: kirimResponse.status,
          kirimdev_response: kirimResult ?? kirimRaw,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("Admin notification sent successfully for order:", order_id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in notify-admin-order:", error);
    return new Response(JSON.stringify({ error: (error as Error).message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
