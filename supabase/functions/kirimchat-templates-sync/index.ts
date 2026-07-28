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
  const apiKey = Deno.env.get("KIRIMCHAT_API_KEY");

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "KIRIMCHAT_API_KEY missing" }), {
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
    const res = await fetch(
      "https://api-prod.kirim.chat/api/v1/public/templates?limit=200",
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    const text = await res.text();
    if (!res.ok) {
      console.error("KirimChat templates fetch failed", res.status, text);
      return new Response(
        JSON.stringify({ error: "Upstream error", status: res.status, body: text }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const json = JSON.parse(text);
    const items = Array.isArray(json?.data) ? json.data : [];

    let synced = 0;
    for (const t of items) {
      const body_content = t.content ?? null;
      const variable_count = countVariables(body_content);
      const row = {
        external_id: t.id ?? "",
        template_name: t.template_name,
        language: t.language ?? "id",
        status: t.status ?? null,
        category: t.category ?? null,
        header_type: t.header_type ?? null,
        header_content: t.header_content ?? null,
        body_content,
        footer_content: t.footer_content ?? null,
        buttons: t.buttons ?? [],
        variables: t.variables ?? [],
        has_variables: !!t.has_variables || variable_count > 0,
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
