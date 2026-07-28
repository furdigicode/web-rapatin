// Admin-only endpoint to read Rapatin MySQL. Blocks all non-SELECT queries.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  assertReadOnly,
  describeTable,
  listTables,
  missingEnv,
  ping,
  runQuery,
} from "../_shared/mysql.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function verifyAdminToken(token: string) {
  if (!token || typeof token !== "string") return null;
  let payload: { sub?: string; email?: string; exp?: number } | null = null;
  try {
    payload = JSON.parse(atob(token));
  } catch {
    return null;
  }
  const now = Math.floor(Date.now() / 1000);
  if (!payload?.exp || payload.exp < now || !payload.sub || !payload.email) return null;

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id, email, is_active")
    .eq("id", payload.sub)
    .eq("email", payload.email)
    .eq("is_active", true)
    .maybeSingle();
  if (!adminUser) return null;

  const { data: session } = await supabase
    .from("admin_sessions")
    .select("id, expires_at")
    .eq("admin_id", adminUser.id)
    .eq("token_hash", token)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (!session) return null;
  return { id: adminUser.id, email: adminUser.email };
}

async function logAttempt(row: {
  admin_id: string | null;
  admin_email: string | null;
  action: string;
  sql: string | null;
  params: any;
  status: "success" | "blocked" | "error";
  row_count: number | null;
  duration_ms: number | null;
  error_message: string | null;
}) {
  try {
    await supabase.from("mysql_query_log").insert(row);
  } catch (e) {
    console.error("mysql_query_log insert failed", e);
  }
}

function jsonResp(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const { token, action, sql, params, table } = body ?? {};

    const admin = await verifyAdminToken(token);
    if (!admin) return jsonResp({ ok: false, error: "Unauthorized" }, 401);

    const missing = missingEnv();
    if (missing.length) {
      return jsonResp({ ok: false, error: `Secret belum lengkap: ${missing.join(", ")}` }, 500);
    }

    const start = Date.now();

    if (action === "ping") {
      try {
        const r = await ping();
        await logAttempt({
          admin_id: admin.id, admin_email: admin.email, action: "ping",
          sql: null, params: null, status: "success", row_count: null,
          duration_ms: r.durationMs, error_message: null,
        });
        return jsonResp({ ok: true, version: r.version, durationMs: r.durationMs });
      } catch (e) {
        const msg = (e as Error).message;
        await logAttempt({
          admin_id: admin.id, admin_email: admin.email, action: "ping",
          sql: null, params: null, status: "error", row_count: null,
          duration_ms: Date.now() - start, error_message: msg,
        });
        return jsonResp({ ok: false, error: msg }, 500);
      }
    }

    if (action === "list_tables") {
      try {
        const tables = await listTables();
        await logAttempt({
          admin_id: admin.id, admin_email: admin.email, action: "list_tables",
          sql: null, params: null, status: "success", row_count: tables.length,
          duration_ms: Date.now() - start, error_message: null,
        });
        return jsonResp({ ok: true, tables });
      } catch (e) {
        const msg = (e as Error).message;
        await logAttempt({
          admin_id: admin.id, admin_email: admin.email, action: "list_tables",
          sql: null, params: null, status: "error", row_count: null,
          duration_ms: Date.now() - start, error_message: msg,
        });
        return jsonResp({ ok: false, error: msg }, 500);
      }
    }

    if (action === "describe_table") {
      try {
        if (!table || typeof table !== "string") throw new Error("Parameter `table` wajib.");
        const columns = await describeTable(table);
        await logAttempt({
          admin_id: admin.id, admin_email: admin.email, action: "describe_table",
          sql: table, params: null, status: "success", row_count: columns.length,
          duration_ms: Date.now() - start, error_message: null,
        });
        return jsonResp({ ok: true, columns });
      } catch (e) {
        const msg = (e as Error).message;
        await logAttempt({
          admin_id: admin.id, admin_email: admin.email, action: "describe_table",
          sql: table ?? null, params: null, status: "error", row_count: null,
          duration_ms: Date.now() - start, error_message: msg,
        });
        return jsonResp({ ok: false, error: msg }, 400);
      }
    }

    if (action === "query") {
      const check = assertReadOnly(sql ?? "");
      if (!check.ok) {
        await logAttempt({
          admin_id: admin.id, admin_email: admin.email, action: "query",
          sql: sql ?? null, params: params ?? null, status: "blocked", row_count: null,
          duration_ms: Date.now() - start, error_message: check.error,
        });
        return jsonResp({ ok: false, error: check.error }, 400);
      }
      try {
        const result = await runQuery(sql, Array.isArray(params) ? params : []);
        await logAttempt({
          admin_id: admin.id, admin_email: admin.email, action: "query",
          sql, params: params ?? null, status: "success", row_count: result.rowCount,
          duration_ms: result.durationMs, error_message: null,
        });
        return jsonResp({ ok: true, ...result });
      } catch (e) {
        const msg = (e as Error).message;
        await logAttempt({
          admin_id: admin.id, admin_email: admin.email, action: "query",
          sql, params: params ?? null, status: "error", row_count: null,
          duration_ms: Date.now() - start, error_message: msg,
        });
        return jsonResp({ ok: false, error: msg }, 500);
      }
    }

    return jsonResp({ ok: false, error: `Unknown action: ${action}` }, 400);
  } catch (e) {
    console.error("mysql-query fatal", e);
    return jsonResp({ ok: false, error: (e as Error).message }, 500);
  }
});
