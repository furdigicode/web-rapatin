// Admin-only: monthly activation funnel from Rapatin MySQL (analyst reference SQL).
// Returns metrics for the selected completed month and the previous month (for MoM).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { runQuery } from "../_shared/mysql.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

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
const n = (v: unknown) => Number(v ?? 0);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { token, month } = await req.json().catch(() => ({}));
    if (!(await verifyAdminToken(token))) return json({ ok: false, error: "Unauthorized" }, 401);
    if (typeof month !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return json({ ok: false, error: "Format bulan harus YYYY-MM" }, 400);
    }
    const [y, m] = month.split("-").map(Number);
    const wib = new Date(Date.now() + 7 * 3600_000);
    if (y * 12 + m >= wib.getUTCFullYear() * 12 + wib.getUTCMonth() + 1) {
      return json({ ok: false, error: "Bulan berjalan atau mendatang belum bisa dianalisis." }, 400);
    }
    const start = m === 1 ? ym(y - 1, 12) : ym(y, m - 1);
    const end = m === 12 ? ym(y + 1, 1) : ym(y, m + 1);
    const prevKey = start.slice(0, 7);

    // runQuery closes its connection before resolving; await each query so
    // one Activation request never occupies four MySQL connections at once.
    const funnel = await runQuery(`
        SELECT DATE_FORMAT(u.created_at, '%Y-%m') AS bulan,
          COUNT(DISTINCT u.id) AS new_signups,
          COUNT(DISTINCT o.customer_id) AS deposit_users,
          COUNT(DISTINCT s.customer_id) AS schedule_users
        FROM users u
        LEFT JOIN orders o ON o.customer_id = u.id AND o.status = 'Completed'
          AND o.created_at >= DATE_FORMAT(u.created_at, '%Y-%m-01')
          AND o.created_at < LAST_DAY(u.created_at) + INTERVAL 1 DAY
        LEFT JOIN schedules s ON s.customer_id = u.id AND s.deleted_at IS NULL
          AND s.created_at >= DATE_FORMAT(u.created_at, '%Y-%m-01')
          AND s.created_at < LAST_DAY(u.created_at) + INTERVAL 1 DAY
        WHERE u.created_at >= ? AND u.created_at < ?
        GROUP BY bulan`, [start, end]);
    const speed = await runQuery(`
        SELECT DATE_FORMAT(u.created_at, '%Y-%m') AS bulan, COUNT(*) AS depositors,
          AVG(TIMESTAMPDIFF(SECOND, u.created_at, f.first_deposit_at)) / 3600 AS avg_hours,
          SUM(TIMESTAMPDIFF(SECOND, u.created_at, f.first_deposit_at) <= 86400) AS deposit_24h
        FROM users u
        JOIN (SELECT customer_id, MIN(created_at) AS first_deposit_at FROM orders
              WHERE status = 'Completed' AND created_at >= ? AND created_at < ?
              GROUP BY customer_id) f
          ON f.customer_id = u.id AND f.first_deposit_at < LAST_DAY(u.created_at) + INTERVAL 1 DAY
        WHERE u.created_at >= ? AND u.created_at < ?
        GROUP BY bulan`, [start, end, start, end]);
    const rev = await runQuery(`
        SELECT r.bulan,
          SUM(CASE WHEN DATE_FORMAT(u.created_at, '%Y-%m') = r.bulan THEN r.amt ELSE 0 END) AS revenue_new,
          SUM(DATE_FORMAT(u.created_at, '%Y-%m') = r.bulan) AS new_paying,
          SUM(r.amt) AS revenue_total
        FROM (SELECT customer_id, DATE_FORMAT(created_at, '%Y-%m') AS bulan, ABS(SUM(\`usage\`)) AS amt
              FROM balance_logs
              WHERE event = 'reduce' AND type IN ('schedule_from_liability','schedule')
                AND created_at >= ? AND created_at < ?
              GROUP BY customer_id, bulan) r
        LEFT JOIN users u ON u.id = r.customer_id
        GROUP BY r.bulan`, [start, end]);
    const guest = await runQuery(`
        SELECT DATE_FORMAT(created_at, '%Y-%m') AS bulan,
          SUM(customer_id = 14) AS guest, COUNT(*) AS total
        FROM schedules WHERE deleted_at IS NULL AND created_at >= ? AND created_at < ?
        GROUP BY bulan`, [start, end]);

    const pick = (rows: any[], key: string) => rows.find((r) => String(r.bulan) === key) ?? {};
    const build = (key: string) => {
      const f = pick(funnel.rows as any[], key), s = pick(speed.rows as any[], key);
      const r = pick(rev.rows as any[], key), g = pick(guest.rows as any[], key);
      return {
        month: key,
        new_signups: n(f.new_signups), deposit_users: n(f.deposit_users), schedule_users: n(f.schedule_users),
        depositors: n(s.depositors), avg_hours_first_deposit: n(s.avg_hours), deposit_24h: n(s.deposit_24h),
        revenue_new: n(r.revenue_new), new_paying: n(r.new_paying), revenue_total: n(r.revenue_total),
        guest_schedules: n(g.guest), total_schedules: n(g.total),
      };
    };
    return json({ ok: true, current: build(month), previous: build(prevKey) });
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
