import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw, Eye } from "lucide-react";

interface WebhookEvent {
  id: string;
  event_type: string;
  channel: string | null;
  message_id: string | null;
  phone_number: string | null;
  template_name: string | null;
  status: string | null;
  error_message: string | null;
  payload: any;
  received_at: string;
}

const PAGE_SIZE = 50;
const EVENT_TYPES = [
  "all",
  "message_received",
  "message_sent",
  "message_delivered",
  "message_read",
  "message_failed",
  "unknown",
];

const eventBadgeVariant = (
  type: string,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (type) {
    case "message_failed":
      return "destructive";
    case "message_delivered":
    case "message_read":
      return "default";
    case "message_sent":
    case "message_received":
      return "secondary";
    default:
      return "outline";
  }
};

const WEBHOOK_URL = `https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1/kirimchat-webhook`;

const KirimchatWebhooks: React.FC = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [eventFilter, setEventFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<WebhookEvent | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    let query = supabase
      .from("kirimchat_webhook_events")
      .select("*")
      .order("received_at", { ascending: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    if (eventFilter !== "all") {
      query = query.eq("event_type", eventFilter);
    }
    if (searchTerm.trim()) {
      const s = searchTerm.trim();
      query = query.or(
        `phone_number.ilike.%${s}%,message_id.ilike.%${s}%`,
      );
    }

    const { data, error } = await query;
    if (error) {
      toast({
        title: "Gagal memuat data",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setEvents((data as any) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, eventFilter]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(WEBHOOK_URL);
    toast({ title: "URL disalin", description: WEBHOOK_URL });
  };

  return (
    <AdminLayout title="Riwayat Webhook KirimChat">
      <AdminPageHeader
        title="Riwayat Webhook KirimChat"
        description="Daftar event webhook yang diterima dari KirimChat."
      >
        <Button variant="outline" onClick={fetchEvents} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </AdminPageHeader>

      <div className="rounded-lg border bg-card p-4 mb-6">
        <div className="text-sm font-medium mb-2">Endpoint Webhook</div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <code className="flex-1 px-3 py-2 text-xs sm:text-sm bg-muted rounded break-all">
            {WEBHOOK_URL}
          </code>
          <Button variant="outline" size="sm" onClick={handleCopyUrl}>
            <Copy className="h-4 w-4 mr-2" />
            Salin
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Tempel URL ini di dashboard KirimChat saat membuat webhook baru. Pilih event yang ingin Anda terima.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Select value={eventFilter} onValueChange={(v) => { setPage(0); setEventFilter(v); }}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EVENT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t === "all" ? "Semua Event" : t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <form
          className="flex gap-2 flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(0);
            fetchEvents();
          }}
        >
          <Input
            placeholder="Cari nomor telepon atau message ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="secondary">
            Cari
          </Button>
        </form>
      </div>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Waktu</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Message ID</TableHead>
              <TableHead>Penerimaan</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Memuat...
                </TableCell>
              </TableRow>
            ) : events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Belum ada event webhook.
                </TableCell>
              </TableRow>
            ) : (
              events.map((ev) => (
                <TableRow key={ev.id}>
                  <TableCell className="text-xs whitespace-nowrap">
                    {new Date(ev.received_at).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={eventBadgeVariant(ev.event_type)}>
                      {ev.event_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{ev.channel || "-"}</TableCell>
                  <TableCell className="text-xs">{ev.phone_number || "-"}</TableCell>
                  <TableCell className="text-xs font-mono max-w-[180px] truncate">
                    {ev.message_id || "-"}
                  </TableCell>
                  <TableCell className="text-xs">{ev.status || "-"}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelected(ev)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          Halaman {page + 1}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0 || loading}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={events.length < PAGE_SIZE || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Selanjutnya
          </Button>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Webhook Event</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">Event</div>
                  <div>{selected.event_type}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Waktu</div>
                  <div>{new Date(selected.received_at).toLocaleString("id-ID")}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Channel</div>
                  <div>{selected.channel || "-"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Phone</div>
                  <div>{selected.phone_number || "-"}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-muted-foreground text-xs">Message ID</div>
                  <div className="font-mono text-xs break-all">{selected.message_id || "-"}</div>
                </div>
                {selected.template_name && (
                  <div>
                    <div className="text-muted-foreground text-xs">Template</div>
                    <div>{selected.template_name}</div>
                  </div>
                )}
                {selected.status && (
                  <div>
                    <div className="text-muted-foreground text-xs">Status</div>
                    <div>{selected.status}</div>
                  </div>
                )}
                {selected.error_message && (
                  <div className="col-span-2">
                    <div className="text-muted-foreground text-xs">Error</div>
                    <div className="text-destructive">{selected.error_message}</div>
                  </div>
                )}
              </div>
              <div>
                <div className="text-muted-foreground text-xs mb-1">Raw Payload</div>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap break-all">
                  {JSON.stringify(selected.payload, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default KirimchatWebhooks;
