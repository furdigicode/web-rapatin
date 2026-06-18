import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-webhook-signature, x-kirimchat-signature, x-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SIGNATURE_HEADERS = [
  "x-webhook-signature",
  "x-kirimchat-signature",
  "x-kirim-chat-signature",
  "x-signature",
  "x-hub-signature-256",
];

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

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function computeHmacHex(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(body),
  );
  return toHex(sig);
}

function extractProvidedSig(req: Request): { header: string; value: string } | null {
  for (const h of SIGNATURE_HEADERS) {
    const v = req.headers.get(h);
    if (v) {
      const cleaned = v.trim().replace(/^sha256=/i, "").toLowerCase();
      return { header: h, value: cleaned };
    }
  }
  return null;
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

  const rawBody = await req.text();

  // Signature verification
  const secret = Deno.env.get("KIRIMCHAT_WEBHOOK_SECRET");
  if (secret) {
    const provided = extractProvidedSig(req);
    if (!provided) {
      console.error("Missing signature header. Headers seen:", [...req.headers.keys()].join(", "));
      return new Response(JSON.stringify({ error: "Missing signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const expected = await computeHmacHex(secret, rawBody);
    if (!constantTimeEqual(provided.value, expected)) {
      console.error(
        `Invalid signature (header: ${provided.header}). expected_prefix=${expected.slice(0, 8)} got_prefix=${provided.value.slice(0, 8)}`,
      );
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } else {
    console.warn("KIRIMCHAT_WEBHOOK_SECRET not configured — accepting without verification.");
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch (e) {
    console.error("Invalid JSON body:", e);
    // Tetap simpan jejak agar admin bisa melihat di dasbor
    await supabase.from("kirimchat_webhook_events").insert({
      event_type: "unknown",
      status: "invalid_json",
      error_message: (e as Error).message,
      payload: { _raw: rawBody?.slice(0, 10000) ?? "" },
    });
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  console.log("KirimChat webhook received:", JSON.stringify(body));

  const eventTypeRaw = pick(body, [
    "event",
    "type",
    "event_type",
    "data.event",
    "data.type",
  ]);
  const event_type = normalizeEventType(eventTypeRaw);

  const channel = pick(body, ["channel", "data.channel", "message.channel"]);
  const message_id = pick(body, [
    "message_id",
    "id",
    "message.id",
    "data.message_id",
    "data.id",
    "data.message.id",
  ]);
  const phone_number = pick(body, [
    "customer_phone",
    "customer.phone",
    "customer.phone_number",
    "data.customer_phone",
    "data.customer.phone",
    "payload.customer_phone",
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
  // Status mencerminkan hasil penerimaan webhook di backend kita, bukan status pesan KirimChat
  const status = "received";
  const error_message = pick(body, [
    "error_message",
    "error.message",
    "error",
    "data.error.message",
    "data.error",
  ]);

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
    return new Response(JSON.stringify({ error: "Failed to store event" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
