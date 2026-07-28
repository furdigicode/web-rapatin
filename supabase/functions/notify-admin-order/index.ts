import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Hardcoded admin WhatsApp number
const ADMIN_PHONE = "6282133579061";
const MAX_ATTEMPTS = 3;
const BACKOFF_MS = [500, 1500, 3000];

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

async function sendOnce(apiKey: string, requestBody: unknown): Promise<{
  ok: boolean;
  status: number;
  response: unknown;
  errorMessage: string | null;
  durationMs: number;
}> {
  const startedAt = Date.now();
  try {
    const res = await fetch("https://api-prod.kirim.chat/api/v1/public/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });
    const text = await res.text();
    let parsed: unknown;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = { raw: text };
    }
    const durationMs = Date.now() - startedAt;
    return {
      ok: res.ok,
      status: res.status,
      response: parsed,
      errorMessage: res.ok
        ? null
        : ((parsed as any)?.message || (parsed as any)?.error || text?.slice(0, 500) || `HTTP ${res.status}`),
      durationMs,
    };
  } catch (e) {
    return {
      ok: false,
      status: 0,
      response: null,
      errorMessage: (e as Error).message,
      durationMs: Date.now() - startedAt,
    };
  }
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (!apiKey) {
      console.error("Missing KIRIMCHAT_API_KEY");
      await supabase.from("admin_notification_log").insert({
        order_id,
        event_type,
        template_name: null,
        phone_number: ADMIN_PHONE,
        attempt: 1,
        status: "failed",
        status_code: 0,
        request: null,
        response: null,
        error_message: "KIRIMCHAT_API_KEY missing",
        duration_ms: 0,
      });
      return new Response(JSON.stringify({ ok: false, logged: true, error: "WhatsApp service not configured" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
      templateName = "order_paid";
    } else {
      return new Response(JSON.stringify({ error: "Invalid event_type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const requestBody = {
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
    };

    console.log(`Sending admin notification (${event_type}) for order:`, order_id);

    let finalResult: Awaited<ReturnType<typeof sendOnce>> | null = null;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const result = await sendOnce(apiKey, requestBody);
      finalResult = result;

      await supabase.from("admin_notification_log").insert({
        order_id,
        event_type,
        template_name: templateName,
        phone_number: ADMIN_PHONE,
        attempt,
        status: result.ok ? "success" : "failed",
        status_code: result.status,
        request: requestBody,
        response: result.response as any,
        error_message: result.errorMessage,
        duration_ms: result.durationMs,
      });

      if (result.ok) {
        console.log("Admin notification sent successfully on attempt", attempt);
        break;
      }

      // Do not retry 4xx (except 408/429)
      const shouldRetry =
        result.status === 0 || result.status >= 500 || result.status === 408 || result.status === 429;
      if (!shouldRetry || attempt === MAX_ATTEMPTS) {
        console.error(
          `Admin notification failed (attempt ${attempt}, status ${result.status}):`,
          result.errorMessage,
        );
        break;
      }

      const wait = BACKOFF_MS[attempt - 1] ?? 3000;
      console.warn(`Attempt ${attempt} failed (status ${result.status}); retrying in ${wait}ms`);
      await new Promise((r) => setTimeout(r, wait));
    }

    return new Response(
      JSON.stringify({
        ok: !!finalResult?.ok,
        logged: true,
        status: finalResult?.status ?? 0,
        error: finalResult?.errorMessage ?? null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in notify-admin-order:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
