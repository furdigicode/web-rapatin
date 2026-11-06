import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw } from "lucide-react";

interface M {
  month: string; new_signups: number; deposit_users: number; schedule_users: number;
  depositors: number; avg_hours_first_deposit: number; deposit_24h: number;
  revenue_new: number; new_paying: number; revenue_total: number;
  guest_schedules: number; total_schedules: number;
}

const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const label = (ym: string) => { const [y, m] = ym.split("-").map(Number); return `${MONTHS[m - 1]} ${y}`; };
const rupiah = (v: number) => `Rp ${Math.round(v).toLocaleString("id-ID")}`;
const pct = (a: number, b: number) => (b ? (a / b) * 100 : 0);
const f1 = (v: number) => v.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function monthOptions(count = 18) {
  const wib = new Date(Date.now() + 7 * 3600_000);
  let y = wib.getUTCFullYear(), m = wib.getUTCMonth() + 1;
  const out: string[] = [];
  for (let i = 0; i < count; i++) { m -= 1; if (m === 0) { m = 12; y -= 1; } out.push(`${y}-${String(m).padStart(2, "0")}`); }
  return out;
}

type Kind = "count" | "rupiah" | "rate" | "hours";
function derive(d: M) {
  return {
    signups: d.new_signups,
    deposit: d.deposit_users,
    depositRate: pct(d.deposit_users, d.new_signups),
    schedule: d.schedule_users,
    scheduleRate: pct(d.schedule_users, d.new_signups),
    depToSched: pct(d.schedule_users, d.deposit_users),
    never: d.new_signups - d.deposit_users,
    neverRate: pct(d.new_signups - d.deposit_users, d.new_signups),
    ttfd: d.avg_hours_first_deposit,
    d24: d.deposit_24h,
    d24Rate: pct(d.deposit_24h, d.depositors),
    revNew: d.revenue_new,
    share: pct(d.revenue_new, d.revenue_total),
    newPaying: d.new_paying,
    arpu: d.new_paying ? d.revenue_new / d.new_paying : 0,
    guest: d.guest_schedules,
    guestShare: pct(d.guest_schedules, d.total_schedules),
  };
}

function Delta({ cur, prev, kind, lowerBetter }: { cur: number; prev: number; kind: Kind; lowerBetter?: boolean }) {
  let text: string; let diff: number;
  if (kind === "rate") { diff = cur - prev; text = `${diff >= 0 ? "+" : ""}${f1(diff)} pp`; }
  else if (kind === "hours") { diff = cur - prev; text = `${diff >= 0 ? "+" : ""}${diff.toLocaleString("id-ID", { maximumFractionDigits: 2 })} jam`; }
  else { if (!prev) return <span className="text-xs text-muted-foreground">—</span>; diff = (cur - prev) / prev * 100; text = `${diff >= 0 ? "+" : ""}${f1(diff)}%`; }
  const good = lowerBetter ? diff < 0 : diff > 0;
  const cls = diff === 0 ? "text-muted-foreground" : good ? "text-primary" : "text-destructive";
  return <span className={`text-xs font-medium ${cls}`}>{text} MoM</span>;
}

function Stat({ title, value, sub, delta }: { title: string; value: string; sub?: string; delta: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-bold">{value}</div>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        {delta}
      </CardContent>
    </Card>
  );
}

export default function StatistikActivation() {
  const options = useMemo(() => monthOptions(), []);
  const [month, setMonth] = useState(options[0]);
  const [data, setData] = useState<{ current: M; previous: M } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (mo: string) => {
    setLoading(true); setError(null);
    try {
      const { data: res, error } = await supabase.functions.invoke("stats-activation", {
        body: { token: localStorage.getItem("adminAuthToken") ?? "", month: mo },
      });
      if (error) throw new Error(error.message);
      if (!res?.ok) throw new Error(res?.error ?? "Gagal memuat data");
      setData({ current: res.current, previous: res.previous });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e)); setData(null);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(month); }, [month]);

  const c = data ? derive(data.current) : null;
  const p = data ? derive(data.previous) : null;

  return (
    <AdminLayout title="Statistik — Activation">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Statistik — Activation</h1>
          <p className="text-muted-foreground text-sm">Funnel user baru per bulan daftar: deposit, jadwal, dan revenue. Bulan berjalan tidak ditampilkan.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{label(o)}</SelectItem>)}</SelectContent>
          </Select>
          {data && <span className="text-sm text-muted-foreground">dibandingkan dengan {label(data.previous.month)}</span>}
          <Button variant="outline" size="sm" onClick={() => load(month)} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2">Segarkan</span>
          </Button>
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        {loading && !data && <p className="text-sm text-muted-foreground">Memuat…</p>}
        {c && p && (
          <>
            <section className="space-y-3">
              <h2 className="font-semibold">Funnel</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Stat title="New signups" value={c.signups.toLocaleString("id-ID")} delta={<Delta cur={c.signups} prev={p.signups} kind="count" />} />
                <Stat title="Deposit users" value={c.deposit.toLocaleString("id-ID")} delta={<Delta cur={c.deposit} prev={p.deposit} kind="count" />} />
                <Stat title="Deposit rate" value={`${f1(c.depositRate)}%`} delta={<Delta cur={c.depositRate} prev={p.depositRate} kind="rate" />} />
                <Stat title="Schedule users" value={c.schedule.toLocaleString("id-ID")} delta={<Delta cur={c.schedule} prev={p.schedule} kind="count" />} />
                <Stat title="Schedule rate" value={`${f1(c.scheduleRate)}%`} delta={<Delta cur={c.scheduleRate} prev={p.scheduleRate} kind="rate" />} />
                <Stat title="Deposit → schedule" value={`${f1(c.depToSched)}%`} delta={<Delta cur={c.depToSched} prev={p.depToSched} kind="rate" />} />
                <Stat title="Never deposited" value={c.never.toLocaleString("id-ID")} sub={`${f1(c.neverRate)}% dari signup`} delta={<Delta cur={c.neverRate} prev={p.neverRate} kind="rate" lowerBetter />} />
              </div>
            </section>
            <section className="space-y-3">
              <h2 className="font-semibold">Kecepatan deposit pertama</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Stat title="Time to first deposit" value={`${c.ttfd.toLocaleString("id-ID", { maximumFractionDigits: 2 })} jam`} delta={<Delta cur={c.ttfd} prev={p.ttfd} kind="hours" lowerBetter />} />
                <Stat title="Deposit ≤24h" value={`${f1(c.d24Rate)}%`} sub={`${c.d24}/${c.deposit}`} delta={<Delta cur={c.d24Rate} prev={p.d24Rate} kind="rate" />} />
              </div>
            </section>
            <section className="space-y-3">
              <h2 className="font-semibold">Revenue user baru</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Stat title="Revenue from new users" value={rupiah(c.revNew)} delta={<Delta cur={c.revNew} prev={p.revNew} kind="rupiah" />} />
                <Stat title="New-user revenue share" value={`${f1(c.share)}%`} sub={`dari ${rupiah(data!.current.revenue_total)}`} delta={<Delta cur={c.share} prev={p.share} kind="rate" />} />
                <Stat title="New paying users" value={c.newPaying.toLocaleString("id-ID")} delta={<Delta cur={c.newPaying} prev={p.newPaying} kind="count" />} />
                <Stat title="ARPU new payer" value={rupiah(c.arpu)} delta={<Delta cur={c.arpu} prev={p.arpu} kind="rupiah" />} />
              </div>
            </section>
            <section className="space-y-3">
              <h2 className="font-semibold">Guest schedule</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Stat title="Guest schedule volume" value={c.guest.toLocaleString("id-ID")} delta={<Delta cur={c.guest} prev={p.guest} kind="count" />} />
                <Stat title="Guest share" value={`${f1(c.guestShare)}%`} sub={`dari ${data!.current.total_schedules.toLocaleString("id-ID")} jadwal`} delta={<Delta cur={c.guestShare} prev={p.guestShare} kind="rate" />} />
              </div>
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
