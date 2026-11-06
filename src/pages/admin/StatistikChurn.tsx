import { useEffect, useMemo, useState, type ReactNode } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw, UserMinus, Wallet, UserCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChurnUser {
  id: number; name: string | null; email: string | null; phone: string | null;
  balance: number; base_usage: number; base_schedules: number;
  last_schedule_at: string | null; segment: Segment; high_value: boolean;
}
type Segment = "loyal" | "bulan_pertama" | "sekali_lainnya";
const SEGMENTS: Record<Segment, string> = { loyal: "Loyal", bulan_pertama: "Bulan pertama", sekali_lainnya: "Sekali lainnya" };
interface ChurnData {
  period: { base: string; compare: string };
  active_base: number; churned_count: number; retained_count: number;
  churn_rate: number; retention_rate: number; revenue_prev: number; lost_revenue: number;
  retained_rev_prev: number; retained_rev_curr: number;
  origin: Record<"retained" | "reactivated" | "new", { users: number; revenue: number }>;
  churned_users: ChurnUser[];
}

const PAGE_SIZE = 20;
const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const label = (ym: string) => { const [y, m] = ym.split("-").map(Number); return `${MONTHS[m - 1]} ${y}`; };
const rupiah = (n: number) => `Rp ${Math.round(n).toLocaleString("id-ID")}`;

// Completed months only (current WIB month is still running).
function monthOptions(count = 18) {
  const wib = new Date(Date.now() + 7 * 3600_000);
  let y = wib.getUTCFullYear(), m = wib.getUTCMonth() + 1;
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    m -= 1; if (m === 0) { m = 12; y -= 1; }
    out.push(`${y}-${String(m).padStart(2, "0")}`);
  }
  return out;
}

export default function StatistikChurn() {
  const options = useMemo(() => monthOptions(), []);
  const [month, setMonth] = useState(options[0]);
  const [data, setData] = useState<ChurnData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (mo: string) => {
    setLoading(true); setError(null);
    try {
      const { data: res, error } = await supabase.functions.invoke("stats-churn", {
        body: { token: localStorage.getItem("adminAuthToken") ?? "", month: mo },
      });
      if (error) throw new Error(error.message);
      if (!res?.ok) throw new Error(res?.error ?? "Gagal memuat data");
      if (!res.origin || typeof res.retention_rate !== "number") throw new Error("Format data lama, silakan klik Segarkan");
      setData(res);
    } catch (e) {
      setError((e as Error).message); setData(null);
    } finally { setLoading(false); }
  };

  const [page, setPage] = useState(1);
  const [seg, setSeg] = useState<"all" | Segment | "high">("all");
  const filtered = useMemo(() => (data?.churned_users ?? []).filter((u) =>
    seg === "all" ? true : seg === "high" ? u.high_value : u.segment === seg), [data, seg]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const segCount = (k: Segment) => data?.churned_users.filter((u) => u.segment === k).length ?? 0;
  const high = data?.churned_users.filter((u) => u.high_value) ?? [];

  useEffect(() => { setPage(1); load(month); }, [month]);
  useEffect(() => { setPage(1); }, [seg]);

  return (
    <AdminLayout title="Statistik — Churn">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Statistik — Churn</h1>
          <p className="text-muted-foreground text-sm">
            User aktif = ada pemotongan saldo untuk jadwal di bulan tersebut. Bulan berjalan tidak ditampilkan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {options.map((o) => <SelectItem key={o} value={o}>{label(o)}</SelectItem>)}
                </SelectContent>
              </Select>
              {data && (
                <span className="text-sm text-muted-foreground">
                  dibandingkan dengan {label(data.period.base)}
                </span>
              )}
              <Button variant="outline" size="sm" onClick={() => load(month)} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                <span className="ml-2">Segarkan</span>
              </Button>
            </div>

        <Tabs defaultValue="ringkasan">
          <TabsList>
            <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
            <TabsTrigger value="followup">Follow Up</TabsTrigger>
          </TabsList>

          <TabsContent value="ringkasan" className="space-y-6">
            {error && <p className="text-destructive text-sm">{error}</p>}

            {data && (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Stat title="Churn" icon={<UserMinus className="h-4 w-4 text-muted-foreground" />}
                    value={<>{data.churned_count}<span className="text-base font-normal text-muted-foreground"> / {data.active_base}</span></>}
                    note={<>Churn rate <b className="text-foreground">{(data.churn_rate ?? 0).toFixed(1)}%</b> dari user aktif {label(data.period.base)}</>} />
                  <Stat title="Retained" icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
                    value={data.retained_count}
                    note={<>Retention rate <b className="text-foreground">{(data.retention_rate ?? 0).toFixed(1)}%</b></>} />
                  <Stat title="Potensi Revenue Hilang" icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
                    value={rupiah(data.lost_revenue)}
                    note={<>Pemakaian saldo user churn di {label(data.period.base)} dari total {rupiah(data.revenue_prev)}</>} />
                  <Stat title="Revenue User Retained" icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
                    value={rupiah(data.retained_rev_curr)}
                    note={<>{label(data.period.compare)} · sebelumnya {rupiah(data.retained_rev_prev)}</>} />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="h-4 w-4" />Asal User Aktif {label(data.period.compare)}</CardTitle>
                    <CardDescription>Total {data.origin.retained.users + data.origin.reactivated.users + data.origin.new.users} user aktif</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-3">
                    {([["retained", "Retained", "Aktif juga bulan lalu"], ["reactivated", "Reactivated", "Kembali setelah absen"], ["new", "Baru", "Aktif pertama kali"]] as const).map(([k, t, d]) => (
                      <div key={k} className="rounded-md border p-4">
                        <div className="text-sm text-muted-foreground">{t}</div>
                        <div className="text-2xl font-bold">{data.origin[k].users}</div>
                        <div className="text-xs text-muted-foreground">{d} · {rupiah(data.origin[k].revenue)}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="followup" className="space-y-6">
            {data && (
              <>
                <div className="flex flex-wrap gap-2">
                  {([["all", `Semua (${data.churned_count})`], ["loyal", `Loyal (${segCount("loyal")})`], ["bulan_pertama", `Bulan pertama (${segCount("bulan_pertama")})`], ["sekali_lainnya", `Sekali lainnya (${segCount("sekali_lainnya")})`], ["high", `Nilai tinggi (${high.length} · ${rupiah(high.reduce((s, u) => s + u.base_usage, 0))})`]] as const).map(([k, t]) => (
                    <Button key={k} size="sm" variant={seg === k ? "default" : "outline"} onClick={() => setSeg(k)}>{t}</Button>
                  ))}
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>User Churn</CardTitle>
                    <CardDescription>
                      Aktif di {label(data.period.base)}, tidak ada jadwal di {label(data.period.compare)}. Loyal = aktif 2+ bulan dalam 3 bulan terakhir; nilai tinggi = pemakaian ≥ Rp 100.000.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama</TableHead>
                          <TableHead>Kontak</TableHead>
                          <TableHead>Segmen</TableHead>
                          <TableHead className="text-right">Jadwal</TableHead>
                          <TableHead className="text-right">Pemakaian Saldo</TableHead>
                          <TableHead>Jadwal Terakhir</TableHead>
                          <TableHead className="text-right">Sisa Saldo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((u) => (
                          <TableRow key={u.id}>
                            <TableCell>{u.name ?? `#${u.id}`}</TableCell>
                            <TableCell className="text-xs"><div>{u.phone ?? "-"}</div><div className="text-muted-foreground">{u.email ?? "-"}</div></TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                <Badge variant="secondary">{SEGMENTS[u.segment]}</Badge>
                                {u.high_value && <Badge>Nilai tinggi</Badge>}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{u.base_schedules}</TableCell>
                            <TableCell className="text-right">{rupiah(u.base_usage)}</TableCell>
                            <TableCell className="text-xs">{u.last_schedule_at?.slice(0, 16) ?? "-"}</TableCell>
                            <TableCell className="text-right">{rupiah(u.balance)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {filtered.length > PAGE_SIZE && (
                      <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
                        <span>{filtered.length} user · Halaman {page} dari {totalPages}</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Sebelumnya</Button>
                          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Berikutnya</Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

function Stat({ title, icon, value, note }: { title: string; icon: ReactNode; value: ReactNode; note: ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>{icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{note}</p>
      </CardContent>
    </Card>
  );
}
