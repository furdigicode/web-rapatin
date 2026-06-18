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

  // Extract message text for rule matching
  const message_text = pick(body, [
    "message",
    "text",
    "message.text",
    "message.body",
    "message.content",
    "data.message",
    "data.text",
    "data.message.text",
    "data.message.body",
    "payload.message",
    "payload.text",
    "content",
    "body",
  ]) ?? "";

  const { data: insertedRows, error: insertError } = await supabase
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
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Failed to insert webhook event:", insertError);
    return new Response(JSON.stringify({ error: "Failed to store event" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const eventRowId = insertedRows?.id as string | undefined;

  // Rule evaluation & async dispatch (non-blocking response)
  if (eventRowId) {
    const evaluate = async () => {
      try {
        const { data: rules, error: rulesError } = await supabase
          .from("kirimchat_rules")
          .select("*")
          .eq("is_active", true)
          .in("event_type", [event_type, "*"])
          .order("priority", { ascending: false })
          .order("created_at", { ascending: true });

        if (rulesError) {
          console.error("Failed to load rules:", rulesError);
          return;
        }

        const matched = (rules ?? []).find((r: any) =>
          matchRule(r, message_text),
        );

        if (!matched) {
          await supabase
            .from("kirimchat_webhook_events")
            .update({ rule_action: "no_match" })
            .eq("id", eventRowId);
          return;
        }

        const delayMs = Math.max(0, Math.min(300, matched.delay_seconds ?? 0)) * 1000;
        if (delayMs > 0) {
          await new Promise((r) => setTimeout(r, delayMs));
        }

        if (!phone_number) {
          console.warn("Matched rule but no phone_number to send to:", matched.id);
          await supabase
            .from("kirimchat_webhook_events")
            .update({ matched_rule_id: matched.id, rule_action: "skipped_no_phone" })
            .eq("id", eventRowId);
          return;
        }

        const result = await sendTemplate(
          normalizePhone(phone_number),
          matched.template_name,
          matched.template_language || "id",
          matched.header_image_url || null,
        );


        await supabase
          .from("kirimchat_webhook_events")
          .update({
            matched_rule_id: matched.id,
            rule_action: result.ok ? "sent" : "failed",
          })
          .eq("id", eventRowId);
      } catch (e) {
        console.error("Rule evaluation error:", e);
        await supabase
          .from("kirimchat_webhook_events")
          .update({ rule_action: "error" })
          .eq("id", eventRowId);
      }
    };

    // @ts-ignore EdgeRuntime is available in Supabase Edge Functions
    if (typeof EdgeRuntime !== "undefined" && EdgeRuntime.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(evaluate());
    } else {
      evaluate();
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

function matchRule(rule: any, text: string): boolean {
  const mode = rule.match_mode as string;
  if (mode === "any") return true;
  const kw = rule.keyword as string | null;
  if (!kw) return false;
  const haystack = rule.case_sensitive ? text : text.toLowerCase();
  const needle = rule.case_sensitive ? kw : kw.toLowerCase();
  switch (mode) {
    case "contains": return haystack.includes(needle);
    case "exact": return haystack.trim() === needle.trim();
    case "starts_with": return haystack.startsWith(needle);
    case "ends_with": return haystack.endsWith(needle);
    case "regex":
      try {
        return new RegExp(kw, rule.case_sensitive ? "" : "i").test(text);
      } catch (e) {
        console.error("Invalid regex in rule", rule.id, e);
        return false;
      }
    default: return false;
  }
}

function normalizePhone(raw: string): string {
  let phone = raw.replace(/\D/g, "");
  if (phone.startsWith("0")) phone = "62" + phone.substring(1);
  else if (!phone.startsWith("62")) phone = "62" + phone;
  return phone;
}

async function sendTemplate(
  phone: string,
  templateName: string,
  language: string,
  headerImageUrl: string | null,
): Promise<{ ok: boolean; status: number; body: string }> {
  const apiKey = Deno.env.get("KIRIMCHAT_API_KEY");
  if (!apiKey) {
    console.error("KIRIMCHAT_API_KEY missing; cannot send template");
    return { ok: false, status: 0, body: "missing_api_key" };
  }
  const components: any[] = [];
  if (headerImageUrl) {
    components.push({
      type: "header",
      parameters: [{ type: "image", image: { link: headerImageUrl } }],
    });
  }
  try {
    const res = await fetch(
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
            name: templateName,
            language: { code: language },
            components,
          },
        }),
      },
    );
    const body = await res.text();
    if (!res.ok) {
      console.error("Rule send failed:", res.status, body);
    } else {
      console.log("Rule template sent:", templateName, "to", phone);
    }
    return { ok: res.ok, status: res.status, body };
  } catch (e) {
    console.error("sendTemplate error:", e);
    return { ok: false, status: 0, body: (e as Error).message };
  }
}

