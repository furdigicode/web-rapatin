import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw, UserMinus, Wallet } from "lucide-react";

interface ChurnUser {
  id: number; name: string | null; email: string | null; phone: string | null;
  balance: number; base_usage: number; base_schedules: number;
}
interface ChurnData {
  period: { base: string; compare: string };
  active_base: number; churned_count: number; retained_count: number;
  churn_rate: number; lost_revenue: number; churned_users: ChurnUser[];
}

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
      setData(res);
    } catch (e) {
      setError((e as Error).message); setData(null);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(month); }, [month]);

  return (
    <AdminLayout title="Statistik — Churn">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Statistik — Churn</h1>
          <p className="text-muted-foreground text-sm">
            User aktif = membuat minimal 1 jadwal rapat di bulan tersebut. Bulan berjalan tidak ditampilkan.
          </p>
        </div>

        <Tabs defaultValue="ringkasan">
          <TabsList>
            <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
            <TabsTrigger value="followup">Follow Up</TabsTrigger>
          </TabsList>

          <TabsContent value="ringkasan" className="space-y-6">
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

            {error && <p className="text-destructive text-sm">{error}</p>}

            {data && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Churn</CardTitle>
                      <UserMinus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {data.churned_count}
                        <span className="text-base font-normal text-muted-foreground"> / {data.active_base} user aktif</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Churn rate <span className="font-semibold text-foreground">{data.churn_rate.toFixed(1)}%</span>
                        {" · "}{data.retained_count} user tetap aktif
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Potensi Revenue Hilang</CardTitle>
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{rupiah(data.lost_revenue)}</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Penggunaan saldo user churn selama {label(data.period.base)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>User Churn</CardTitle>
                    <CardDescription>
                      Aktif di {label(data.period.base)}, tidak membuat jadwal di {label(data.period.compare)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Telepon</TableHead>
                          <TableHead className="text-right">Jadwal</TableHead>
                          <TableHead className="text-right">Pemakaian Saldo</TableHead>
                          <TableHead className="text-right">Sisa Saldo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.churned_users.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell>{u.name ?? `#${u.id}`}</TableCell>
                            <TableCell>{u.email ?? "-"}</TableCell>
                            <TableCell>{u.phone ?? "-"}</TableCell>
                            <TableCell className="text-right">{u.base_schedules}</TableCell>
                            <TableCell className="text-right">{rupiah(u.base_usage)}</TableCell>
                            <TableCell className="text-right">{rupiah(u.balance)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="followup">
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                Follow Up untuk user churn akan disusun berikutnya.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
