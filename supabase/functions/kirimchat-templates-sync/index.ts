import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { templateVariables } from "../_shared/template-variables.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !serviceKey || !anonKey) {
    return new Response(JSON.stringify({ error: "Supabase configuration missing" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
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
    const items: any[] = [];
    const seen = new Set<string>();
    let cursor: string | null = null;
    for (let page = 1; page <= 50; page++) {
      const qs = new URLSearchParams({ limit: "100", page: String(page) });
      if (cursor) qs.set("cursor", cursor);
      const res = await fetch(
        `https://api-prod.kirim.chat/api/v1/public/templates?${qs}`,
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
      if (page === 1) console.log("templates page meta:", JSON.stringify({ ...json, data: undefined }));
      const batch: any[] = Array.isArray(json?.data) ? json.data : [];
      let added = 0;
      for (const t of batch) {
        const key = t.id ?? `${t.template_name}:${t.language}`;
        if (seen.has(key)) continue;
        seen.add(key); items.push(t); added++;
      }
      const meta = json?.pagination ?? json?.meta ?? {};
      cursor = meta.next_cursor ?? meta.nextCursor ?? json?.next_cursor ?? null;
      const totalPages = meta.total_pages ?? meta.totalPages ?? meta.last_page;
      const hasMore = meta.has_more ?? meta.hasMore ?? meta.hasNext ?? meta.has_next;
      if (!batch.length || added === 0) break;
      if (hasMore === false) break;
      if (totalPages && page >= totalPages) break;
      if (hasMore === undefined && !totalPages && !cursor && batch.length < 10) break;
    }

    let synced = 0;
    for (const t of items) {
      const body_content = t.content ?? null;
      const variableKeys = templateVariables({ header_type: t.header_type, header_content: t.header_content, body_content });
      const variable_count = variableKeys.header.length + variableKeys.body.length;
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
