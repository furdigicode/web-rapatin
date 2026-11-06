// Admin-only: monthly churn statistics from Rapatin MySQL.
// Active = has a schedule balance deduction (balance_logs reduce, type schedule /
// schedule_from_liability) in the month, raw created_at boundaries. Churn = active in
// M-1 but not in M. Revenue = ABS(usage). Matches the analyst's reference SQL.
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

    const h3 = (() => { let yy = y, mm = m - 3; while (mm <= 0) { mm += 12; yy -= 1; } return ym(yy, mm); })();
    const S = "event = 'reduce' AND type IN ('schedule_from_liability','schedule') AND customer_id IS NOT NULL";
    const sql = `
      SELECT p.cid AS id, u.name, u.email, u.phone, u.balance,
             p.jadwal_prev, p.rev_prev, p.last_at, c.rev_curr, h.first_at, h.months3
      FROM (SELECT customer_id AS cid, COUNT(*) AS jadwal_prev, SUM(ABS(\`usage\`)) AS rev_prev, MAX(created_at) AS last_at
            FROM balance_logs WHERE ${S} AND created_at >= ? AND created_at < ? GROUP BY customer_id) p
      LEFT JOIN (SELECT customer_id AS cid, SUM(ABS(\`usage\`)) AS rev_curr
            FROM balance_logs WHERE ${S} AND created_at >= ? AND created_at < ? GROUP BY customer_id) c ON c.cid = p.cid
      LEFT JOIN (SELECT customer_id AS cid, MIN(created_at) AS first_at,
                   COUNT(DISTINCT CASE WHEN created_at >= ? THEN DATE_FORMAT(created_at, '%Y-%m') END) AS months3
            FROM balance_logs WHERE ${S} AND created_at < ? GROUP BY customer_id) h ON h.cid = p.cid
      LEFT JOIN users u ON u.id = p.cid
      ORDER BY p.rev_prev DESC`;
    const X = "x.event = 'reduce' AND x.type IN ('schedule_from_liability','schedule') AND x.customer_id = c.cid";
    const originSql = `
      SELECT CASE WHEN EXISTS (SELECT 1 FROM balance_logs x WHERE ${X} AND x.created_at >= ? AND x.created_at < ?) THEN 'retained'
                  WHEN EXISTS (SELECT 1 FROM balance_logs x WHERE ${X} AND x.created_at < ?) THEN 'reactivated'
                  ELSE 'new' END AS asal,
             COUNT(*) AS users, SUM(c.rev) AS revenue
      FROM (SELECT customer_id AS cid, SUM(ABS(\`usage\`)) AS rev FROM balance_logs
            WHERE ${S} AND created_at >= ? AND created_at < ? GROUP BY customer_id) c
      GROUP BY asal`;
    const [r, o] = await Promise.all([
      runQuery(sql, [baseStart, baseEnd, cmpStart, cmpEnd, h3, cmpStart]),
      runQuery(originSql, [baseStart, baseEnd, baseStart, cmpStart, cmpEnd]),
    ]);
    const all = r.rows.map((x: any) => {
      const months3 = Number(x.months3 ?? 0);
      const first = String(x.first_at ?? "");
      const rev_prev = Number(x.rev_prev ?? 0);
      return {
        id: Number(x.id), name: x.name, email: x.email, phone: x.phone,
        balance: Number(x.balance ?? 0), base_schedules: Number(x.jadwal_prev ?? 0),
        base_usage: rev_prev, rev_curr: x.rev_curr == null ? null : Number(x.rev_curr),
        last_schedule_at: x.last_at, first_active_at: x.first_at, months_active_3: months3,
        segment: months3 >= 2 ? "loyal" : first >= baseStart ? "bulan_pertama" : "sekali_lainnya",
        high_value: rev_prev >= 100000,
      };
    });
    const churned = all.filter((x) => x.rev_curr == null);
    const retained = all.filter((x) => x.rev_curr != null);
    const sum = (a: typeof all, f: (x: typeof all[number]) => number) => a.reduce((s, x) => s + f(x), 0);
    const n = all.length;
    const origin: Record<string, { users: number; revenue: number }> = {
      retained: { users: 0, revenue: 0 }, reactivated: { users: 0, revenue: 0 }, new: { users: 0, revenue: 0 },
    };
    for (const x of o.rows as any[]) origin[x.asal] = { users: Number(x.users), revenue: Number(x.revenue ?? 0) };
    return json({
      ok: true,
      period: { base: baseStart.slice(0, 7), compare: month },
      active_base: n,
      churned_count: churned.length,
      retained_count: retained.length,
      churn_rate: n ? (churned.length / n) * 100 : 0,
      retention_rate: n ? (retained.length / n) * 100 : 0,
      revenue_prev: sum(all, (x) => x.base_usage),
      lost_revenue: sum(churned, (x) => x.base_usage),
      retained_rev_prev: sum(retained, (x) => x.base_usage),
      retained_rev_curr: sum(retained, (x) => x.rev_curr ?? 0),
      origin,
      churned_users: churned.map(({ rev_curr, ...rest }) => rest),
      duration_ms: r.durationMs,
    });
  } catch (e) {
    console.error("stats-churn", e);
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});
