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
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface Template {
  id: string;
  external_id: string;
  template_name: string;
  language: string;
  status: string | null;
  category: string | null;
  header_type: string | null;
  header_content: string | null;
  body_content: string | null;
  footer_content: string | null;
  buttons: any;
  variables: any;
  has_variables: boolean;
  variable_count: number;
  synced_at: string;
  updated_at: string;
}

const KirimchatTemplates: React.FC = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [detail, setDetail] = useState<Template | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("kirimchat_templates")
      .select("*")
      .order("template_name", { ascending: true });
    if (error) {
      toast({ title: "Gagal memuat", description: error.message, variant: "destructive" });
    } else {
      setTemplates((data ?? []) as Template[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const sync = async () => {
    setSyncing(true);
    const { data, error } = await supabase.functions.invoke("kirimchat-templates-sync");
    setSyncing(false);
    if (error) {
      toast({ title: "Gagal sinkron", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Sinkronisasi berhasil", description: `${data?.synced ?? 0} template diperbarui.` });
    load();
  };

  const statusBadge = (s: string | null) => {
    if (!s) return <Badge variant="outline">—</Badge>;
    const variant = s === "APPROVED" ? "default" : s === "REJECTED" ? "destructive" : "secondary";
    return <Badge variant={variant as any}>{s}</Badge>;
  };

  return (
    <AdminLayout title="KirimChat Templates">
      <AdminPageHeader
        title="KirimChat Templates"
        description="Daftar template WhatsApp dari akun KirimChat. Sinkronkan untuk memperbarui."
      >
        <Button onClick={sync} disabled={syncing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Menyinkron…" : "Sinkron dari KirimChat"}
        </Button>
      </AdminPageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Bahasa</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Header</TableHead>
              <TableHead>Variabel</TableHead>
              <TableHead>Disinkron</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Memuat…
                </TableCell>
              </TableRow>
            ) : templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Belum ada template. Klik "Sinkron dari KirimChat" untuk mengambil.
                </TableCell>
              </TableRow>
            ) : (
              templates.map((t) => (
                <TableRow
                  key={t.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setDetail(t)}
                >
                  <TableCell className="font-medium">
                    <code className="text-xs">{t.template_name}</code>
                  </TableCell>
                  <TableCell>{t.language}</TableCell>
                  <TableCell>{t.category ?? "—"}</TableCell>
                  <TableCell>{statusBadge(t.status)}</TableCell>
                  <TableCell>{t.header_type ?? "—"}</TableCell>
                  <TableCell>
                    {t.variable_count > 0 ? (
                      <Badge variant="outline">{t.variable_count} var</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(t.synced_at), { addSuffix: true, locale: idLocale })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {detail?.template_name}
            </DialogTitle>
            <DialogDescription>
              {detail?.language} • {detail?.category} • {detail?.status}
            </DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-4 text-sm">
              {detail.header_content && (
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-1">
                    Header ({detail.header_type})
                  </div>
                  <pre className="bg-muted rounded p-2 whitespace-pre-wrap text-xs">{detail.header_content}</pre>
                </div>
              )}
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-1">Body</div>
                <pre className="bg-muted rounded p-2 whitespace-pre-wrap text-xs">{detail.body_content ?? "—"}</pre>
                {detail.variable_count > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {detail.variable_count} variabel terdeteksi ({Array.from({ length: detail.variable_count }, (_, i) => `{{${i + 1}}}`).join(", ")})
                  </p>
                )}
              </div>
              {detail.footer_content && (
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-1">Footer</div>
                  <pre className="bg-muted rounded p-2 whitespace-pre-wrap text-xs">{detail.footer_content}</pre>
                </div>
              )}
              {Array.isArray(detail.buttons) && detail.buttons.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-1">Buttons</div>
                  <pre className="bg-muted rounded p-2 text-xs overflow-x-auto">
                    {JSON.stringify(detail.buttons, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default KirimchatTemplates;
