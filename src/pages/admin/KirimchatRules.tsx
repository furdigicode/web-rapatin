import React, { useEffect, useMemo, useState } from "react";
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
import { Pencil, Plus, Trash2, Zap, ScrollText, RefreshCw, ChevronDown, ChevronRight } from "lucide-react";
import { z } from "zod";

interface WebhookEvent {
  id: string;
  event_type: string;
  phone_number: string | null;
  template_name: string | null;
  status: string | null;
  error_message: string | null;
  rule_action: string | null;
  payload: any;
  received_at: string;
}

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
  body_variables: string[] | null;
  priority: number;
  created_at: string;
  updated_at: string;
}

interface Template {
  id: string;
  template_name: string;
  language: string;
  category: string | null;
  status: string | null;
  body_content: string | null;
  variable_count: number;
  header_type: string | null;
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

const PLACEHOLDERS = [
  "{{customer_name}}",
  "{{customer_phone}}",
  "{{customer_id}}",
  "{{message_text}}",
  "{{channel}}",
  "{{event_type}}",
];

const ruleSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib").max(100),
  is_active: z.boolean(),
  event_type: z.string().min(1),
  match_mode: z.enum(["any", "contains", "exact", "starts_with", "ends_with", "regex"]),
  keyword: z.string().max(500).optional().nullable(),
  case_sensitive: z.boolean(),
  delay_seconds: z.number().int().min(0).max(300),
  template_name: z.string().trim().min(1, "Pilih template").max(100),
  template_language: z.string().trim().min(1).max(10),
  header_image_url: z
    .string()
    .trim()
    .max(2000)
    .url("URL gambar tidak valid")
    .optional()
    .or(z.literal("")),
  body_variables: z.array(z.string().max(500)).max(20),
  priority: z.number().int().min(0).max(1000),
});

type RuleForm = z.infer<typeof ruleSchema>;

const emptyForm: RuleForm = {
  name: "",
  is_active: true,
  event_type: "message.received",
  match_mode: "contains",
  keyword: "",
  case_sensitive: false,
  delay_seconds: 0,
  template_name: "",
  template_language: "id",
  header_image_url: "",
  body_variables: [],
  priority: 0,
};

const templateKey = (name: string, lang: string) => `${name}::${lang}`;

const KirimchatRules: React.FC = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<Rule[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Rule | null>(null);
  const [form, setForm] = useState<RuleForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [logRule, setLogRule] = useState<Rule | null>(null);
  const [logs, setLogs] = useState<WebhookEvent[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const loadLogs = async (ruleId: string) => {
    setLogsLoading(true);
    const { data, error } = await supabase
      .from("kirimchat_webhook_events")
      .select("id, event_type, phone_number, template_name, status, error_message, rule_action, payload, received_at")
      .eq("matched_rule_id", ruleId)
      .order("received_at", { ascending: false })
      .limit(50);
    if (error) {
      toast({ title: "Gagal memuat log", description: error.message, variant: "destructive" });
    } else {
      setLogs((data ?? []) as WebhookEvent[]);
    }
    setLogsLoading(false);
  };

  const openLogs = (r: Rule) => {
    setLogRule(r);
    setExpandedLog(null);
    setLogs([]);
    loadLogs(r.id);
  };

  const load = async () => {
    setLoading(true);
    const [rulesRes, templatesRes] = await Promise.all([
      supabase
        .from("kirimchat_rules")
        .select("*")
        .order("priority", { ascending: false })
        .order("created_at", { ascending: true }),
      supabase
        .from("kirimchat_templates")
        .select("id, template_name, language, category, status, body_content, variable_count, header_type")
        .order("template_name", { ascending: true }),
    ]);
    if (rulesRes.error) {
      toast({ title: "Gagal memuat rules", description: rulesRes.error.message, variant: "destructive" });
    } else {
      setRules((rulesRes.data ?? []) as any as Rule[]);
    }
    if (templatesRes.error) {
      toast({ title: "Gagal memuat templates", description: templatesRes.error.message, variant: "destructive" });
    } else {
      setTemplates((templatesRes.data ?? []) as Template[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const selectedTemplate = useMemo(
    () =>
      templates.find(
        (t) => t.template_name === form.template_name && t.language === form.template_language,
      ) ?? null,
    [templates, form.template_name, form.template_language],
  );

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
      body_variables: Array.isArray(r.body_variables) ? r.body_variables : [],
      priority: r.priority,
    });
    setDialogOpen(true);
  };

  const handleTemplateChange = (key: string) => {
    const t = templates.find((x) => templateKey(x.template_name, x.language) === key);
    if (!t) return;
    const current = form.body_variables ?? [];
    const next = Array.from({ length: t.variable_count }, (_, i) => current[i] ?? "");
    setForm({
      ...form,
      template_name: t.template_name,
      template_language: t.language,
      body_variables: next,
    });
  };

  const updateVariable = (i: number, v: string) => {
    const arr = [...(form.body_variables ?? [])];
    arr[i] = v;
    setForm({ ...form, body_variables: arr });
  };

  const submit = async () => {
    const parsed = ruleSchema.safeParse(form);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast({ title: "Form tidak valid", description: first.message, variant: "destructive" });
      return;
    }
    const variableCount = selectedTemplate?.variable_count ?? 0;
    if (variableCount > 0) {
      const vars = parsed.data.body_variables;
      if (vars.length < variableCount || vars.slice(0, variableCount).some((v) => !v.trim())) {
        toast({
          title: "Variabel belum lengkap",
          description: `Template ini butuh ${variableCount} variabel.`,
          variant: "destructive",
        });
        return;
      }
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
      body_variables: parsed.data.body_variables.slice(0, variableCount),
      priority: parsed.data.priority,
      keyword: parsed.data.match_mode === "any" ? null : (parsed.data.keyword?.trim() || null),
    };

    if (payload.match_mode !== "any" && !payload.keyword) {
      toast({ title: "Keyword wajib", description: "Isi keyword atau pilih mode Any.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = editing
      ? await supabase.from("kirimchat_rules").update(payload as any).eq("id", editing.id)
      : await supabase.from("kirimchat_rules").insert(payload as any);
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
  const variableCount = selectedTemplate?.variable_count ?? 0;

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

      {templates.length === 0 && !loading && (
        <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 text-amber-900 p-3 text-sm">
          Belum ada template di database. Buka menu <strong>Templates</strong> dan klik "Sinkron dari KirimChat" terlebih dahulu.
        </div>
      )}

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
              rules.map((r) => {
                const varCount = Array.isArray(r.body_variables) ? r.body_variables.length : 0;
                return (
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
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <code className="text-xs">{r.template_name}</code>
                        {varCount > 0 && <Badge variant="secondary" className="text-[10px]">{varCount} var</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>{r.priority}</TableCell>
                    <TableCell>
                      <Switch checked={r.is_active} onCheckedChange={() => toggleActive(r)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openLogs(r)} title="Lihat Log">
                        <ScrollText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

            <div className="md:col-span-2 space-y-2">
              <Label>Template</Label>
              <Select
                value={form.template_name ? templateKey(form.template_name, form.template_language) : ""}
                onValueChange={handleTemplateChange}
                disabled={templates.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={templates.length === 0 ? "Tidak ada template — sinkron dulu" : "Pilih template"} />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={templateKey(t.template_name, t.language)}>
                      {t.template_name} ({t.language}){t.category ? ` — ${t.category}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplate?.body_content && (
                <div className="rounded-md border bg-muted/40 p-2 text-xs whitespace-pre-wrap">
                  {selectedTemplate.body_content}
                </div>
              )}
            </div>

            {variableCount > 0 && (
              <div className="md:col-span-2 space-y-3 rounded-md border p-3">
                <div>
                  <Label>Variabel Body ({variableCount})</Label>
                  <p className="text-xs text-muted-foreground">
                    Bisa pakai placeholder dinamis: {PLACEHOLDERS.join(", ")}
                  </p>
                </div>
                {Array.from({ length: variableCount }, (_, i) => (
                  <div key={i} className="space-y-1">
                    <Label className="text-xs"><code>{`{{${i + 1}}}`}</code></Label>
                    <Input
                      value={form.body_variables[i] ?? ""}
                      onChange={(e) => updateVariable(i, e.target.value)}
                      placeholder={`Mis. Halo {{customer_name}}`}
                    />
                  </div>
                ))}
              </div>
            )}

            {selectedTemplate?.header_type === "IMAGE" && (
              <div className="md:col-span-2 space-y-2">
                <Label>URL Gambar Header</Label>
                <Input
                  value={form.header_image_url ?? ""}
                  onChange={(e) => setForm({ ...form, header_image_url: e.target.value })}
                  placeholder="https://example.com/promo-banner.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Template ini punya header gambar — wajib isi URL.
                </p>
              </div>
            )}
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
