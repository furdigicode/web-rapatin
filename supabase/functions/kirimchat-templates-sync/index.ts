import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function countVariables(body: string | null | undefined): number {
  if (!body) return 0;
  const matches = [...body.matchAll(/\{\{\s*(\d+)\s*\}\}/g)];
  if (matches.length === 0) return 0;
  return Math.max(...matches.map((m) => parseInt(m[1], 10)));
}

// Extract text from a Meta template component (HEADER text, BODY, FOOTER)
function componentText(components: any[], type: string): string | null {
  const c = components?.find((x) => (x?.type ?? "").toUpperCase() === type.toUpperCase());
  if (!c) return null;
  return c.text ?? null;
}

function componentByType(components: any[], type: string): any | null {
  return components?.find((x) => (x?.type ?? "").toUpperCase() === type.toUpperCase()) ?? null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const apiKey = Deno.env.get("KIRIMDEV_API_KEY");
  const phoneNumberId = Deno.env.get("KIRIMDEV_PHONE_NUMBER_ID");

  if (!apiKey || !phoneNumberId) {
    return new Response(JSON.stringify({ error: "KIRIMDEV_API_KEY / KIRIMDEV_PHONE_NUMBER_ID missing" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Admin auth check
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData } = await userClient.auth.getUser();
  const email = userData?.user?.email;
  if (!email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const { data: admin } = await supabase
    .from("admin_users")
    .select("id, is_active")
    .eq("email", email)
    .eq("is_active", true)
    .maybeSingle();
  if (!admin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Kirimdev is Meta-compatible: use message_templates endpoint on the WABA/phone number.
    const url = `https://api.kirimdev.com/v1/${phoneNumberId}/message_templates?limit=200`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const text = await res.text();
    if (!res.ok) {
      console.error("Kirimdev templates fetch failed", res.status, text);
      return new Response(
        JSON.stringify({ error: "Upstream error", status: res.status, body: text }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const json = JSON.parse(text);
    const items: any[] = Array.isArray(json?.data) ? json.data : [];

    let synced = 0;
    for (const t of items) {
      // Meta template shape: { id, name, language, category, status, components: [{type: HEADER|BODY|FOOTER|BUTTONS, ...}] }
      const components: any[] = Array.isArray(t.components) ? t.components : [];
      const header = componentByType(components, "HEADER");
      const body_content = componentText(components, "BODY");
      const footer_content = componentText(components, "FOOTER");
      const buttonsComp = componentByType(components, "BUTTONS");
      const buttons = buttonsComp?.buttons ?? [];
      const variable_count = countVariables(body_content);

      const row = {
        external_id: t.id ?? "",
        template_name: t.name,
        language: t.language ?? "id",
        status: t.status ?? null,
        category: t.category ?? null,
        header_type: header?.format ?? null,
        header_content: header?.text ?? header?.example?.header_handle?.[0] ?? null,
        body_content,
        footer_content,
        buttons,
        variables: [],
        has_variables: variable_count > 0,
        variable_count,
        raw: t,
        synced_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from("kirimchat_templates")
        .upsert(row, { onConflict: "template_name,language" });
      if (error) {
        console.error("Upsert failed for", row.template_name, error);
      } else {
        synced++;
      }
    }

    return new Response(JSON.stringify({ ok: true, synced, total: items.length }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Sync error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
