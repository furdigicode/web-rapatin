import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Plus, Trash2, Zap } from "lucide-react";
import { z } from "zod";

interface Rule {
  id: string;
  name: string;
  is_active: boolean;
  event_type: string;
  match_mode: string;
  keyword: string | null;
  case_sensitive: boolean;
  delay_seconds: number;
  template_name: string;
  template_language: string;
  header_image_url: string | null;
  priority: number;
  created_at: string;
  updated_at: string;

}

const EVENT_TYPES = [
  { value: "*", label: "Semua Event" },
  { value: "message.received", label: "Pesan Masuk" },
  { value: "message.sent", label: "Pesan Terkirim" },
  { value: "message.delivered", label: "Pesan Diterima" },
  { value: "message.read", label: "Pesan Dibaca" },
  { value: "message.failed", label: "Pesan Gagal" },
];

const MATCH_MODES = [
  { value: "any", label: "Selalu cocok (Any)" },
  { value: "contains", label: "Mengandung (Contains)" },
  { value: "exact", label: "Persis (Exact)" },
  { value: "starts_with", label: "Diawali dengan" },
  { value: "ends_with", label: "Diakhiri dengan" },
  { value: "regex", label: "Regex" },
];

const ruleSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib").max(100),
  is_active: z.boolean(),
  event_type: z.string().min(1),
  match_mode: z.enum(["any", "contains", "exact", "starts_with", "ends_with", "regex"]),
  keyword: z.string().max(500).optional().nullable(),
  case_sensitive: z.boolean(),
  delay_seconds: z.number().int().min(0).max(300),
  template_name: z.string().trim().min(1, "Nama template wajib").max(100),
  template_language: z.string().trim().min(1).max(10),
  header_image_url: z
    .string()
    .trim()
    .max(2000)
    .url("URL gambar tidak valid")
    .optional()
    .or(z.literal("")),
  priority: z.number().int().min(0).max(1000),

});

type RuleForm = z.infer<typeof ruleSchema>;

const emptyForm: RuleForm = {
  name: "",
  is_active: true,
  event_type: "message_received",
  match_mode: "contains",
  keyword: "",
  case_sensitive: false,
  delay_seconds: 0,
  template_name: "",
  template_language: "id",
  header_image_url: "",
  priority: 0,

};

const KirimchatRules: React.FC = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Rule | null>(null);
  const [form, setForm] = useState<RuleForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("kirimchat_rules")
      .select("*")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: true });
    if (error) {
      toast({ title: "Gagal memuat", description: error.message, variant: "destructive" });
    } else {
      setRules((data ?? []) as Rule[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (r: Rule) => {
    setEditing(r);
    setForm({
      name: r.name,
      is_active: r.is_active,
      event_type: r.event_type,
      match_mode: r.match_mode as RuleForm["match_mode"],
      keyword: r.keyword ?? "",
      case_sensitive: r.case_sensitive,
      delay_seconds: r.delay_seconds,
      template_name: r.template_name,
      template_language: r.template_language,
      header_image_url: r.header_image_url ?? "",
      priority: r.priority,

    });
    setDialogOpen(true);
  };

  const submit = async () => {
    const parsed = ruleSchema.safeParse(form);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast({ title: "Form tidak valid", description: first.message, variant: "destructive" });
      return;
    }
    const payload = {
      name: parsed.data.name,
      is_active: parsed.data.is_active,
      event_type: parsed.data.event_type,
      match_mode: parsed.data.match_mode,
      case_sensitive: parsed.data.case_sensitive,
      delay_seconds: parsed.data.delay_seconds,
      template_name: parsed.data.template_name,
      template_language: parsed.data.template_language,
      header_image_url: parsed.data.header_image_url?.trim() ? parsed.data.header_image_url.trim() : null,
      priority: parsed.data.priority,
      keyword: parsed.data.match_mode === "any" ? null : (parsed.data.keyword?.trim() || null),
    };

    if (payload.match_mode !== "any" && !payload.keyword) {
      toast({ title: "Keyword wajib", description: "Isi keyword atau pilih mode Any.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = editing
      ? await supabase.from("kirimchat_rules").update(payload).eq("id", editing.id)
      : await supabase.from("kirimchat_rules").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Gagal menyimpan", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: editing ? "Rule diperbarui" : "Rule dibuat" });
    setDialogOpen(false);
    load();
  };

  const toggleActive = async (r: Rule) => {
    const { error } = await supabase
      .from("kirimchat_rules")
      .update({ is_active: !r.is_active })
      .eq("id", r.id);
    if (error) {
      toast({ title: "Gagal", description: error.message, variant: "destructive" });
    } else {
      load();
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("kirimchat_rules").delete().eq("id", deleteId);
    if (error) {
      toast({ title: "Gagal menghapus", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Rule dihapus" });
    }
    setDeleteId(null);
    load();
  };

  const eventLabel = (v: string) => EVENT_TYPES.find((e) => e.value === v)?.label ?? v;
  const matchLabel = (v: string) => MATCH_MODES.find((m) => m.value === v)?.label ?? v;

  return (
    <AdminLayout title="KirimChat Rules">
      <AdminPageHeader
        title="KirimChat Rules"
        description="Otomatisasi pengiriman pesan template berdasarkan event webhook dan keyword."
      >
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Rule
        </Button>
      </AdminPageHeader>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Match</TableHead>
              <TableHead>Keyword</TableHead>
              <TableHead>Delay</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Prioritas</TableHead>
              <TableHead>Aktif</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  Memuat…
                </TableCell>
              </TableRow>
            ) : rules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  Belum ada rule. Tambahkan rule pertama untuk memulai otomatisasi.
                </TableCell>
              </TableRow>
            ) : (
              rules.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{eventLabel(r.event_type)}</Badge>
                  </TableCell>
                  <TableCell>{matchLabel(r.match_mode)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {r.keyword ? <code className="text-xs">{r.keyword}</code> : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>{r.delay_seconds}s</TableCell>
                  <TableCell><code className="text-xs">{r.template_name}</code></TableCell>
                  <TableCell>{r.priority}</TableCell>
                  <TableCell>
                    <Switch checked={r.is_active} onCheckedChange={() => toggleActive(r)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {editing ? "Edit Rule" : "Tambah Rule"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label>Nama Rule</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Mis. Balas sapaan 'halo'"
              />
            </div>

            <div className="space-y-2">
              <Label>Event Webhook</Label>
              <Select value={form.event_type} onValueChange={(v) => setForm({ ...form, event_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((e) => (
                    <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mode Pencocokan</Label>
              <Select
                value={form.match_mode}
                onValueChange={(v) => setForm({ ...form, match_mode: v as RuleForm["match_mode"] })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MATCH_MODES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Keyword</Label>
              <Input
                value={form.keyword ?? ""}
                onChange={(e) => setForm({ ...form, keyword: e.target.value })}
                placeholder={form.match_mode === "any" ? "(tidak dipakai)" : "Mis. halo"}
                disabled={form.match_mode === "any"}
              />
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label>Case Sensitive</Label>
                <p className="text-xs text-muted-foreground">Bedakan huruf besar/kecil</p>
              </div>
              <Switch
                checked={form.case_sensitive}
                onCheckedChange={(v) => setForm({ ...form, case_sensitive: v })}
              />
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label>Aktif</Label>
                <p className="text-xs text-muted-foreground">Rule akan dieksekusi</p>
              </div>
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })}
              />
            </div>

            <div className="space-y-2">
              <Label>Delay (detik) — maks 300</Label>
              <Input
                type="number"
                min={0}
                max={300}
                value={form.delay_seconds}
                onChange={(e) => setForm({ ...form, delay_seconds: Number(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label>Prioritas (lebih tinggi = duluan)</Label>
              <Input
                type="number"
                min={0}
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: Number(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label>Nama Template KirimChat</Label>
              <Input
                value={form.template_name}
                onChange={(e) => setForm({ ...form, template_name: e.target.value })}
                placeholder="Mis. balasan_halo"
              />
            </div>

            <div className="space-y-2">
              <Label>Bahasa Template</Label>
              <Input
                value={form.template_language}
                onChange={(e) => setForm({ ...form, template_language: e.target.value })}
                placeholder="id"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>URL Gambar Header (opsional)</Label>
              <Input
                value={form.header_image_url ?? ""}
                onChange={(e) => setForm({ ...form, header_image_url: e.target.value })}
                placeholder="https://example.com/promo-banner.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Isi hanya jika template KirimChat memiliki header berupa gambar.
              </p>
            </div>
          </div>


          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Batal
            </Button>
            <Button onClick={submit} disabled={saving}>
              {saving ? "Menyimpan…" : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus rule ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak bisa dibatalkan. Otomatisasi tidak akan berjalan lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default KirimchatRules;
