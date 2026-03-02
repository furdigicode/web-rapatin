import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    const apiKey = Deno.env.get("KIRIMCHAT_API_KEY");
    if (!apiKey) {
      console.error("Missing KIRIMCHAT_API_KEY");
      return new Response(
        JSON.stringify({ error: "WhatsApp service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch order
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

    // Cooldown check
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

    // Format date + time for template parameter {{3}}
    const meetingDate = new Date(order.meeting_date);
    const formattedDate = meetingDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const dateTimeStr = `${formattedDate} - ${order.meeting_time || "00:00"} WIB`;

    // Format phone number to 628xxx
    let phone = order.whatsapp.replace(/\D/g, "");
    if (phone.startsWith("0")) {
      phone = "62" + phone.substring(1);
    } else if (!phone.startsWith("62")) {
      phone = "62" + phone;
    }

    console.log("Sending WhatsApp via KirimChat to:", phone);

    // KirimChat API call with template "akses"
    const kirimResponse = await fetch(
      "https://api-prod.kirim.chat/api/v1/public/messages/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          phone_number: phone,
          channel: "whatsapp",
          message_type: "template",
          template: {
            name: "akses",
            language: { code: "id" },
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
          },
        }),
      }
    );

    const kirimResult = await kirimResponse.json();
    console.log("KirimChat response:", JSON.stringify(kirimResult));

    if (!kirimResponse.ok) {
      console.error("KirimChat error:", kirimResult);
      return new Response(
        JSON.stringify({
          error: kirimResult.message || kirimResult.error || "Gagal mengirim WhatsApp",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update timestamp
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
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
