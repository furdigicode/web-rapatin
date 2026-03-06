import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Hardcoded admin WhatsApp number
const ADMIN_PHONE = "6285156473083";

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
      return new Response(
        JSON.stringify({ error: "order_id and event_type are required" }),
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

    const { data: order, error: orderError } = await supabase
      .from("guest_orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      console.error("Order not found:", orderError);
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format date
    const meetingDate = new Date(order.meeting_date);
    const formattedDate = meetingDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const dateTimeStr = `${formattedDate}, ${order.meeting_time || "00:00"} WIB`;

    // Build message based on event type
    let message = "";
    const orderNumber = order.order_number || "-";

    if (event_type === "new_order") {
      message = `🔔 ORDER BARU #${orderNumber}

Nama: ${order.name}
Email: ${order.email}
WA: ${order.whatsapp}
Topik: ${order.meeting_topic || "-"}
Tanggal: ${dateTimeStr}
Peserta: ${order.participant_count} orang
Harga: ${formatRupiah(order.price)}${order.is_recurring && order.total_days > 1 ? `\nSesi: ${order.total_days}x (Recurring)` : ""}

Status: Menunggu Pembayaran`;
    } else if (event_type === "payment_success") {
      message = `✅ PEMBAYARAN BERHASIL #${orderNumber}

Nama: ${order.name}
Topik: ${order.meeting_topic || "-"}
Tanggal: ${dateTimeStr}
Total: ${formatRupiah(order.price)}
Metode: ${order.payment_method || "-"}${order.is_recurring && order.total_days > 1 ? `\nSesi: ${order.total_days}x (Recurring)` : ""}

Link Admin: https://rapatin.lovable.app/admin/orders`;
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid event_type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending admin notification (${event_type}) for order:`, order_id);

    const kirimResponse = await fetch(
      "https://api-prod.kirim.chat/api/v1/public/messages/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          phone_number: ADMIN_PHONE,
          channel: "whatsapp",
          message_type: "text",
          message: { body: message },
        }),
      }
    );

    const kirimResult = await kirimResponse.json();
    console.log("KirimChat response:", JSON.stringify(kirimResult));

    if (!kirimResponse.ok) {
      console.error("KirimChat error:", kirimResult);
      return new Response(
        JSON.stringify({ error: "Failed to send admin notification" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Admin notification sent successfully for order:", order_id);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in notify-admin-order:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
