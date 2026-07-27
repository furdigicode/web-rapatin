import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getRecurringDates, formatIndoDate } from "../_shared/recurring.ts";
import { kirimdevSendTemplate } from "../_shared/kirimdev.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Cooldown period in milliseconds (1 hour)
const COOLDOWN_MS = 60 * 60 * 1000;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return new Response(
        JSON.stringify({ error: "order_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!Deno.env.get("KIRIMDEV_API_KEY") || !Deno.env.get("KIRIMDEV_PHONE_NUMBER_ID")) {
      console.error("Missing Kirimdev credentials");
      return new Response(
        JSON.stringify({ error: "WhatsApp service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
      return new Response(
        JSON.stringify({ error: "Order tidak ditemukan" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (order.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ error: "Order belum dibayar" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!order.zoom_link || !order.meeting_id) {
      return new Response(
        JSON.stringify({ error: "Detail Zoom belum tersedia" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (order.whatsapp_sent_at) {
      const lastSentTime = new Date(order.whatsapp_sent_at).getTime();
      const timeSinceLastSent = Date.now() - lastSentTime;
      if (timeSinceLastSent < COOLDOWN_MS) {
        const remainingMs = COOLDOWN_MS - timeSinceLastSent;
        const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
        return new Response(
          JSON.stringify({
            error: `Tunggu ${remainingMinutes} menit lagi untuk mengirim ulang`,
            cooldown_remaining_ms: remainingMs,
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const sessionDates = getRecurringDates(order);
    const timeStr = order.meeting_time || "00:00";
    const dateTimeStr = sessionDates.length > 1
      ? sessionDates.map((d) => `${formatIndoDate(d)} - ${timeStr} WIB`).join("; ")
      : `${formatIndoDate(sessionDates[0])} - ${timeStr} WIB`;

    console.log("Sending WhatsApp via Kirimdev to order:", order_id);

    const kirimResponse = await kirimdevSendTemplate({
      to: order.whatsapp,
      name: "akses",
      languageCode: "id",
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: order.name },
            { type: "text", text: order.meeting_topic || "Zoom Meeting" },
            { type: "text", text: dateTimeStr },
            { type: "text", text: order.zoom_link },
            { type: "text", text: order.meeting_id },
            { type: "text", text: order.zoom_passcode || "-" },
          ],
        },
      ],
    });

    const kirimResult = await kirimResponse.json();
    console.log("Kirimdev response:", JSON.stringify(kirimResult));

    if (!kirimResponse.ok) {
      console.error("Kirimdev error:", kirimResult);
      return new Response(
        JSON.stringify({
          error: kirimResult?.error?.message || kirimResult?.message || kirimResult?.error || "Gagal mengirim WhatsApp",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: updateError } = await supabase
      .from("guest_orders")
      .update({ whatsapp_sent_at: new Date().toISOString() })
      .eq("id", order_id);

    if (updateError) {
      console.error("Failed to update whatsapp_sent_at:", updateError);
    }

    console.log("WhatsApp sent successfully to order:", order_id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Pesan WhatsApp berhasil dikirim",
        whatsapp_sent_at: new Date().toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-whatsapp-notification:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
