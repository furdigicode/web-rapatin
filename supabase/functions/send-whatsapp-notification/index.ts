import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Cooldown period in milliseconds (1 hour)
const COOLDOWN_MS = 60 * 60 * 1000;

interface BalesOtomatisResponse {
  status?: boolean;
  message?: string;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight
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

    // Get API credentials from secrets
    const apiKey = Deno.env.get("BALESOTOMATIS_API_KEY");
    const numberId = Deno.env.get("BALESOTOMATIS_NUMBER_ID");

    if (!apiKey || !numberId) {
      console.error("Missing BalesOtomatis credentials");
      return new Response(
        JSON.stringify({ error: "WhatsApp service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch order details
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

    // Check if order is paid and has zoom details
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

    // Check cooldown (rate limiting)
    if (order.whatsapp_sent_at) {
      const lastSentTime = new Date(order.whatsapp_sent_at).getTime();
      const now = Date.now();
      const timeSinceLastSent = now - lastSentTime;

      if (timeSinceLastSent < COOLDOWN_MS) {
        const remainingMs = COOLDOWN_MS - timeSinceLastSent;
        const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
        return new Response(
          JSON.stringify({ 
            error: `Tunggu ${remainingMinutes} menit lagi untuk mengirim ulang`,
            cooldown_remaining_ms: remainingMs
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Format meeting date
    const meetingDate = new Date(order.meeting_date);
    const formattedDate = meetingDate.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Build WhatsApp message
    const message = `Halo ${order.name},

Berikut detail Zoom Meeting Anda:

📋 *Order:* ${order.order_number || order.id}
📅 *Tanggal:* ${formattedDate}
⏰ *Waktu:* ${order.meeting_time || "Sesuai jadwal"} WIB

🔐 *Kredensial Zoom:*
Meeting ID: ${order.meeting_id}
Passcode: ${order.zoom_passcode || "-"}
Host Key: 070707

🔗 Link Meeting:
${order.zoom_link}

Panduan menjadi Host: https://youtu.be/8QX78u43_JE

Terima kasih telah menggunakan Rapatin! 🙏`;

    // Format phone number (ensure it starts with country code)
    let phoneNo = order.whatsapp.replace(/\D/g, ""); // Remove non-digits
    // Remove leading zero if present
    if (phoneNo.startsWith("0")) {
      phoneNo = phoneNo.substring(1);
    }
    // Remove country code if already present (62)
    if (phoneNo.startsWith("62")) {
      phoneNo = phoneNo.substring(2);
    }

    console.log("Sending WhatsApp to:", phoneNo);
    console.log("Message:", message);

    // Call BalesOtomatis API
    const balesResponse = await fetch(
      "https://api.balesotomatis.id/public/v1/send_personal_message",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: apiKey,
          number_id: numberId,
          enable_typing: "1",
          method_send: "async",
          phone_no: phoneNo,
          country_code: "62",
          message: message,
        }),
      }
    );

    const balesResult: BalesOtomatisResponse = await balesResponse.json();
    console.log("BalesOtomatis response:", balesResult);

    if (!balesResponse.ok || balesResult.error) {
      console.error("BalesOtomatis error:", balesResult);
      return new Response(
        JSON.stringify({ 
          error: balesResult.message || balesResult.error || "Gagal mengirim WhatsApp" 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update whatsapp_sent_at timestamp
    const { error: updateError } = await supabase
      .from("guest_orders")
      .update({ whatsapp_sent_at: new Date().toISOString() })
      .eq("id", order_id);

    if (updateError) {
      console.error("Failed to update whatsapp_sent_at:", updateError);
      // Don't fail the request, the message was already sent
    }

    console.log("WhatsApp sent successfully to order:", order_id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Pesan WhatsApp berhasil dikirim",
        whatsapp_sent_at: new Date().toISOString()
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
