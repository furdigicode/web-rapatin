import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function pick(obj: any, paths: string[]): string | null {
  for (const p of paths) {
    const parts = p.split(".");
    let cur: any = obj;
    let ok = true;
    for (const part of parts) {
      if (cur && typeof cur === "object" && part in cur) {
        cur = cur[part];
      } else {
        ok = false;
        break;
      }
    }
    if (ok && cur != null && typeof cur !== "object") {
      return String(cur);
    }
  }
  return null;
}

function normalizeEventType(raw: string | null): string {
  if (!raw) return "unknown";
  return raw.toLowerCase().replace(/[\s-]+/g, "_");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    console.error("Invalid JSON body:", e);
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  console.log("KirimChat webhook received:", JSON.stringify(body));

  // NOTE: Signature verification belum tersedia dari KirimChat.
  // Saat tersedia, validasi header (mis. X-KirimChat-Signature) di sini.

  const eventTypeRaw = pick(body, [
    "event",
    "type",
    "event_type",
    "data.event",
    "data.type",
  ]);
  const event_type = normalizeEventType(eventTypeRaw);

  const channel = pick(body, [
    "channel",
    "data.channel",
    "message.channel",
  ]);
  const message_id = pick(body, [
    "message_id",
    "id",
    "message.id",
    "data.message_id",
    "data.id",
    "data.message.id",
  ]);
  const phone_number = pick(body, [
    "phone_number",
    "phone",
    "from",
    "to",
    "contact.phone",
    "contact.phone_number",
    "data.phone_number",
    "data.from",
    "data.to",
    "data.contact.phone",
    "message.from",
    "message.to",
  ]);
  const template_name = pick(body, [
    "template_name",
    "template.name",
    "data.template.name",
    "message.template.name",
  ]);
  const status = pick(body, [
    "status",
    "data.status",
    "message.status",
  ]);
  const error_message = pick(body, [
    "error_message",
    "error.message",
    "error",
    "data.error.message",
    "data.error",
  ]);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { error: insertError } = await supabase
    .from("kirimchat_webhook_events")
    .insert({
      event_type,
      channel,
      message_id,
      phone_number,
      template_name,
      status,
      error_message,
      payload: body,
    });

  if (insertError) {
    console.error("Failed to insert webhook event:", insertError);
    return new Response(
      JSON.stringify({ error: "Failed to store event" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
