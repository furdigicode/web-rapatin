import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface LogRow {
  id: string;
  order_id: string | null;
  event_type: string;
  template_name: string | null;
  phone_number: string | null;
  attempt: number;
  status: string;
  status_code: number | null;
  request: any;
  response: any;
  error_message: string | null;
  duration_ms: number | null;
  created_at: string;
  order_number?: string | null;
}

const AdminNotificationLog: React.FC = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<LogRow | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_notification_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      toast({ title: "Gagal memuat", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    const list = (data ?? []) as LogRow[];

    // fetch order numbers
    const orderIds = Array.from(new Set(list.map((r) => r.order_id).filter(Boolean))) as string[];
    if (orderIds.length > 0) {
      const { data: orders } = await supabase
        .from("guest_orders")
        .select("id, order_number")
        .in("id", orderIds);
      const map = new Map<string, string | null>();
      (orders ?? []).forEach((o: any) => map.set(o.id, o.order_number));
      list.forEach((r) => {
        if (r.order_id) r.order_number = map.get(r.order_id) ?? null;
      });
    }

    setRows(list);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const statusBadge = (s: string) => {
    if (s === "success") return <Badge>Sukses</Badge>;
    return <Badge variant="destructive">Gagal</Badge>;
  };

  const eventLabel = (e: string) =>
    e === "new_order" ? "Order baru" : e === "payment_success" ? "Pembayaran berhasil" : e;

  return (
    <AdminLayout title="Log Notifikasi Admin">
      <AdminPageHeader
        title="Log Notifikasi Admin"
        description="Riwayat percobaan pengiriman notifikasi WhatsApp ke admin (order_new / order_paid)."
      >
        <Button onClick={load} disabled={loading} variant="outline">
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </AdminPageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Waktu</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Attempt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>HTTP</TableHead>
              <TableHead>Durasi</TableHead>
              <TableHead>Error</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  Memuat…
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  Belum ada log notifikasi admin.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow
                  key={r.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setDetail(r)}
                >
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: idLocale })}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs">{r.order_number ?? r.order_id?.slice(0, 8) ?? "—"}</code>
                  </TableCell>
                  <TableCell>{eventLabel(r.event_type)}</TableCell>
                  <TableCell>
                    <code className="text-xs">{r.template_name ?? "—"}</code>
                  </TableCell>
                  <TableCell>{r.attempt}</TableCell>
                  <TableCell>{statusBadge(r.status)}</TableCell>
                  <TableCell>{r.status_code ?? "—"}</TableCell>
                  <TableCell className="text-xs">{r.duration_ms != null ? `${r.duration_ms}ms` : "—"}</TableCell>
                  <TableCell className="text-xs text-destructive max-w-[240px] truncate">
                    {r.error_message ?? ""}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Notifikasi</DialogTitle>
            <DialogDescription>
              {detail && `${eventLabel(detail.event_type)} • attempt ${detail.attempt} • ${detail.status}`}
            </DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">Order</div>
                  <div>{detail.order_number ?? detail.order_id ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">Nomor Admin</div>
                  <div>{detail.phone_number ?? "—"}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">Template</div>
                  <div><code className="text-xs">{detail.template_name ?? "—"}</code></div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">HTTP status</div>
                  <div>{detail.status_code ?? "—"}</div>
                </div>
              </div>
              {detail.error_message && (
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-1">Error</div>
                  <pre className="bg-destructive/10 text-destructive rounded p-2 whitespace-pre-wrap text-xs">
                    {detail.error_message}
                  </pre>
                </div>
              )}
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-1">Request</div>
                <pre className="bg-muted rounded p-2 text-xs overflow-x-auto">
                  {JSON.stringify(detail.request, null, 2)}
                </pre>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-1">Response</div>
                <pre className="bg-muted rounded p-2 text-xs overflow-x-auto">
                  {JSON.stringify(detail.response, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminNotificationLog;
