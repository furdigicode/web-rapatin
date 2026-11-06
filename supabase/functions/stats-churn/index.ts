// Admin-only: monthly churn statistics from Rapatin MySQL.
// Active = created at least one schedule in the month. Churn = active in base month (M-1)
// but no schedule in the selected month M. Lost revenue = balance spent on schedules
// in the base month by churned users.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { runQuery } from "../_shared/mysql.ts";

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
  try { payload = JSON.parse(atob(token)); } catch { return null; }
  const now = Math.floor(Date.now() / 1000);
  if (!payload?.exp || payload.exp < now || !payload.sub || !payload.email) return null;
  const { data: adminUser } = await supabase.from("admin_users").select("id")
    .eq("id", payload.sub).eq("email", payload.email).eq("is_active", true).maybeSingle();
  if (!adminUser) return null;
  const { data: session } = await supabase.from("admin_sessions").select("id")
    .eq("admin_id", adminUser.id).eq("token_hash", token)
    .gt("expires_at", new Date().toISOString()).maybeSingle();
  return session ? adminUser : null;
}

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const ym = (y: number, m: number) => `${y}-${String(m).padStart(2, "0")}-01`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { token, month } = await req.json().catch(() => ({}));
    if (!(await verifyAdminToken(token))) return json({ ok: false, error: "Unauthorized" }, 401);
    if (typeof month !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return json({ ok: false, error: "Format bulan harus YYYY-MM" }, 400);
    }
    const [y, m] = month.split("-").map(Number);
    // Current month in WIB is still running — not allowed.
    const wib = new Date(Date.now() + 7 * 3600_000);
    if (y * 12 + m >= wib.getUTCFullYear() * 12 + wib.getUTCMonth() + 1) {
      return json({ ok: false, error: "Bulan berjalan atau mendatang belum bisa dianalisis." }, 400);
    }
    const cmpStart = ym(y, m);
    const cmpEnd = m === 12 ? ym(y + 1, 1) : ym(y, m + 1);
    const baseStart = m === 1 ? ym(y - 1, 12) : ym(y, m - 1);
    const baseEnd = cmpStart;

    const sql = `
      SELECT b.cid AS id, u.name, u.email, u.phone, u.balance,
             (c.cid IS NULL) AS churned,
             COALESCE(us.used, 0) AS base_usage,
             b.base_schedules
      FROM (
        SELECT CAST(customer_id AS UNSIGNED) AS cid, COUNT(*) AS base_schedules FROM schedules
        WHERE created_at >= ? AND created_at < ? GROUP BY CAST(customer_id AS UNSIGNED)
      ) b
      LEFT JOIN (
        SELECT DISTINCT CAST(customer_id AS UNSIGNED) AS cid FROM schedules
        WHERE created_at >= ? AND created_at < ?
      ) c ON c.cid = b.cid
      LEFT JOIN (
        SELECT customer_id AS cid, -SUM(\`usage\`) AS used FROM balance_logs
        WHERE type LIKE 'schedule_%' AND created_at >= ? AND created_at < ?
        GROUP BY customer_id
      ) us ON us.cid = b.cid
      LEFT JOIN users u ON u.id = b.cid
      ORDER BY churned DESC, base_usage DESC
      LIMIT 10000`;
    const r = await runQuery(sql, [baseStart, baseEnd, cmpStart, cmpEnd, baseStart, baseEnd]);
    const rows = r.rows.map((x: any) => ({
      id: Number(x.id), name: x.name, email: x.email, phone: x.phone,
      balance: Number(x.balance ?? 0), churned: Number(x.churned) === 1,
      base_usage: Number(x.base_usage ?? 0), base_schedules: Number(x.base_schedules ?? 0),
    }));
    const churned = rows.filter((x) => x.churned);
    const activeBase = rows.length;
    return json({
      ok: true,
      period: { base: baseStart.slice(0, 7), compare: month },
      active_base: activeBase,
      churned_count: churned.length,
      retained_count: activeBase - churned.length,
      churn_rate: activeBase ? (churned.length / activeBase) * 100 : 0,
      lost_revenue: churned.reduce((s, x) => s + x.base_usage, 0),
      churned_users: churned,
      duration_ms: r.durationMs,
    });
  } catch (e) {
    console.error("stats-churn", e);
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});
