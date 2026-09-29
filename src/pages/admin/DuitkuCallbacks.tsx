import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Send } from "lucide-react";

interface LogRow {
  id: string;
  merchant_order_id: string | null;
  destination: string;
  result_code: string | null;
  status: string;
  payload: Record<string, unknown>;
  target_url: string | null;
  response_status: number | null;
  response_body: string | null;
  duration_ms: number | null;
  error_message: string | null;
  resend_count: number;
  created_at: string;
}

const DEST_LABEL: Record<string, string> = { quick_order: "Quick Order", member: "Member", unknown: "Tidak dikenal" };

async function call(body: Record<string, unknown>) {
  const token = localStorage.getItem("adminAuthToken") ?? "";
  const { data, error } = await supabase.functions.invoke("duitku-callback-admin", { body: { token, ...body } });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data;
}

export default function DuitkuCallbacks() {
  const { toast } = useToast();
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<LogRow | null>(null);
  const [resending, setResending] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await call({ action: "list", destination, status, search });
      setRows(data.rows ?? []);
    } catch (e) {
      toast({ title: "Gagal memuat", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [destination, status]);

  async function resend(row: LogRow) {
    setResending(row.id);
    try {
      const res = await call({ action: "resend", id: row.id });
      toast({ title: res.ok ? "Terkirim ulang" : "Masih gagal", description: `Status ${res.response_status ?? "-"}` });
      await load();
    } catch (e) {
      toast({ title: "Gagal kirim ulang", description: (e as Error).message, variant: "destructive" });
    } finally {
      setResending(null);
    }
  }

  const statusVariant = (s: string) => (s === "success" ? "default" : s === "failed" ? "destructive" : "secondary");

  return (
    <AdminLayout title="Monitor Callback Duitku">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Monitor Callback Duitku</h1>
          <p className="text-sm text-muted-foreground">Semua callback Duitku yang masuk, termasuk yang diteruskan ke Dashboard Member.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua tujuan</SelectItem>
              <SelectItem value="quick_order">Quick Order</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua status</SelectItem>
              <SelectItem value="success">Berhasil</SelectItem>
              <SelectItem value="failed">Gagal</SelectItem>
              <SelectItem value="invalid">Tidak valid</SelectItem>
            </SelectContent>
          </Select>
          <Input
            className="w-60"
            placeholder="Cari order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
          />
          <Button variant="outline" onClick={load} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2">Refresh</span>
          </Button>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Tujuan</TableHead>
                <TableHead>resultCode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Respons</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && !loading && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Belum ada callback.</TableCell></TableRow>
              )}
              {rows.map((r) => (
                <TableRow key={r.id} className="cursor-pointer" onClick={() => setSelected(r)}>
                  <TableCell className="whitespace-nowrap text-xs">{new Date(r.created_at).toLocaleString("id-ID")}</TableCell>
                  <TableCell className="font-mono text-xs">{r.merchant_order_id ?? "-"}</TableCell>
                  <TableCell>{DEST_LABEL[r.destination] ?? r.destination}</TableCell>
                  <TableCell>{r.result_code ?? "-"}</TableCell>
                  <TableCell><Badge variant={statusVariant(r.status)}>{r.status}</Badge></TableCell>
                  <TableCell className="text-xs">{r.response_status ?? (r.error_message ? "error" : "-")}</TableCell>
                  <TableCell className="text-xs">{r.duration_ms != null ? `${r.duration_ms} ms` : "-"}</TableCell>
                  <TableCell>
                    {r.destination === "member" && r.status !== "success" && (
                      <Button size="sm" variant="outline" disabled={resending === r.id}
                        onClick={(e) => { e.stopPropagation(); resend(r); }}>
                        {resending === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                        <span className="ml-1">Kirim Ulang</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Detail Callback {selected?.merchant_order_id}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div><b>Tujuan:</b> {DEST_LABEL[selected.destination]} {selected.target_url && `(${selected.target_url})`}</div>
              <div><b>Status:</b> {selected.status} · HTTP {selected.response_status ?? "-"} · kirim ulang {selected.resend_count}x</div>
              {selected.error_message && <div className="text-destructive"><b>Error:</b> {selected.error_message}</div>}
              <div>
                <b>Payload</b>
                <pre className="mt-1 rounded bg-muted p-3 text-xs overflow-x-auto">{JSON.stringify(selected.payload, null, 2)}</pre>
              </div>
              {selected.response_body && (
                <div>
                  <b>Respons Member</b>
                  <pre className="mt-1 rounded bg-muted p-3 text-xs overflow-x-auto whitespace-pre-wrap">{selected.response_body}</pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
