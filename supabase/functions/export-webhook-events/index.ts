import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EXPORT_TOKEN = "tmp-export-6f13a9c2b4e84f0a";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  if (url.searchParams.get("token") !== EXPORT_TOKEN) {
    return new Response("forbidden", { status: 403 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const from = url.searchParams.get("from") || "2026-08-05";
  const all: unknown[] = [];
  const pageSize = 500;
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase
      .from("kirimchat_webhook_events")
      .select("*")
      .gte("received_at", from)
      .order("received_at", { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    all.push(...(data || []));
    if (!data || data.length < pageSize) break;
  }

  return new Response(JSON.stringify(all), {
    headers: { "Content-Type": "application/json" },
  });
});
