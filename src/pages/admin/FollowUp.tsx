import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Save, Send } from "lucide-react";
import { previewText, templateVariables } from "../../../supabase/functions/_shared/template-variables";

interface LogRow {
  id: string;
  name: string | null;
  email: string | null;
  phone: string;
  template_name: string;
  status: string;
  is_test: boolean;
  error_message: string | null;
  created_at: string;
}

async function call(body: Record<string, unknown>) {
  const token = localStorage.getItem("adminAuthToken") ?? "";
  const { data, error } = await supabase.functions.invoke("followup-admin", { body: { token, ...body } });
  if (error) {
    const response = "context" in error ? error.context : null;
    if (response instanceof Response) {
      const details = await response.json().catch(() => null);
      if (typeof details?.error === "string") throw new Error(details.error);
    }
    throw new Error(error.message);
  }
  if (data?.error && body.action !== "test") throw new Error(data.error);
  return data;
}

export default function FollowUp() {
  const { toast } = useToast();
  const [template, setTemplate] = useState("");
  const [language, setLanguage] = useState("id");
  const [phone, setPhone] = useState("");
  const [headerValues, setHeaderValues] = useState<string[]>([]);
  const [bodyValues, setBodyValues] = useState<string[]>([]);
  const [tplInfo, setTplInfo] = useState<{ header: string | null; body: string | null; keys: { header: string[]; body: string[] } } | null | undefined>(undefined);
  const [logs, setLogs] = useState<LogRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    setTplInfo(undefined);
    setHeaderValues([]);
    setBodyValues([]);
    const name = template.trim();
    if (!name) return;
    const t = setTimeout(async () => {
      const { data } = await supabase.from("kirimchat_templates")
        .select("header_type, header_content, body_content").eq("template_name", name).eq("language", language.trim() || "id").maybeSingle();
      if (cancelled) return;
      if (!data) { setTplInfo(null); return; }
      const keys = templateVariables(data);
      const textHeader = !data.header_type || data.header_type.toLowerCase() === "text";
      setTplInfo({ header: textHeader ? data.header_content : null, body: data.body_content, keys });
      setHeaderValues(keys.header.map(() => ""));
      setBodyValues(keys.body.map(() => ""));
    }, 400);
    return () => { cancelled = true; clearTimeout(t); };
  }, [template, language]);

  const headerPreview = tplInfo ? previewText(tplInfo.header, tplInfo.keys.header, headerValues) : "";
  const bodyPreview = tplInfo ? previewText(tplInfo.body, tplInfo.keys.body, bodyValues) : "";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const d = await call({ action: "get" });
      if (d.settings) {
        setTemplate((t) => t || d.settings.template_name || "");
        setLanguage(d.settings.template_language || "id");
      }
      setLogs(d.logs ?? []);
    } catch (e) {
      toast({ title: "Gagal memuat", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      await call({ action: "save", template_name: template, template_language: language });
      toast({ title: "Template disimpan" });
    } catch (e) {
      toast({ title: "Gagal menyimpan", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const test = async () => {
    setSending(true);
    try {
      if (!tplInfo || [...headerValues, ...bodyValues].some((v) => !v.trim())) {
        toast({ title: "Variabel belum lengkap", description: "Isi semua variabel template.", variant: "destructive" });
        return;
      }
      const d = await call({ action: "test", template_name: template, template_language: language, phone,
        header_variables: headerValues.map((v) => v.trim()), body_variables: bodyValues.map((v) => v.trim()) });
      if (d.ok) toast({ title: "Uji kirim berhasil", description: `Terkirim ke ${phone}` });
      else toast({ title: "Uji kirim gagal", description: String(d.error), variant: "destructive" });
      load();
    } catch (e) {
      toast({ title: "Uji kirim gagal", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const q = search.toLowerCase();
  const filtered = logs.filter((l) =>
    !q || [l.name, l.email, l.phone, l.template_name].some((v) => v?.toLowerCase().includes(q)));

  return (
    <AdminLayout title="Follow Up">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">Follow Up</h1>
          <p className="text-muted-foreground">Follow up WhatsApp untuk user yang mendaftar tapi belum top up.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Template WhatsApp</CardTitle>
              <CardDescription>Nama template Kirim.Chat yang dipakai untuk follow up.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tpl">Nama Template</Label>
                <Input id="tpl" value={template} onChange={(e) => setTemplate(e.target.value)} placeholder="contoh: followup_h1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lang">Kode Bahasa</Label>
                <Input id="lang" value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="id" />
              </div>
              <Button onClick={save} disabled={saving || !template.trim()}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Simpan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Uji Kirim</CardTitle>
              <CardDescription>Kirim template di samping ke nomor mana saja.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor WhatsApp</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08123456789" />
              </div>
              {tplInfo === null && (
                <p className="text-sm text-destructive">
                  Template "{template}" ({language}) belum ada di daftar. Buka menu KirimChat → Templates lalu klik "Sinkron dari KirimChat".
                </p>
              )}
              {template.trim() && tplInfo === undefined && (
                <p className="text-sm text-muted-foreground">Memuat template…</p>
              )}
              {tplInfo && tplInfo.keys.header.length + tplInfo.keys.body.length === 0 && (
                <p className="text-sm text-muted-foreground">Template ini tidak memiliki variabel.</p>
              )}
              {tplInfo && (["header", "body"] as const).map((section) => {
                const values = section === "header" ? headerValues : bodyValues;
                const setValues = section === "header" ? setHeaderValues : setBodyValues;
                return tplInfo.keys[section].map((key, i) => (
                  <div key={`${section}-${key}`} className="space-y-2">
                    <Label htmlFor={`var-${section}-${key}`}>Variabel {section === "header" ? "Header" : "Body"}: {`{{${key}}}`}</Label>
                    <Input id={`var-${section}-${key}`} value={values[i] ?? ""}
                      onChange={(e) => setValues((arr) => arr.map((x, j) => j === i ? e.target.value : x))}
                      placeholder={i === 0 ? "contoh: Budi" : `Isi untuk {{${key}}}`} />
                  </div>
                ));
              })}
              {tplInfo && (tplInfo.header || tplInfo.body) && (
                <div className="space-y-2">
                  <Label>Pratinjau pesan</Label>
                  <div className="space-y-2 rounded-md bg-muted p-3 text-sm break-words">
                    {headerPreview && <p className="whitespace-pre-wrap font-semibold">{headerPreview}</p>}
                    {bodyPreview && <p className="whitespace-pre-wrap">{bodyPreview}</p>}
                  </div>
                </div>
              )}
              <Button onClick={test} disabled={sending || !template.trim() || !phone.trim() || !tplInfo || [...headerValues, ...bodyValues].some((v) => !v.trim())}>
                {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Kirim Uji Coba
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Riwayat Follow Up</CardTitle>
              <CardDescription>{filtered.length} data</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari..." className="w-48" />
              <Button variant="outline" size="icon" onClick={load} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Belum ada data</TableCell></TableRow>
                ) : filtered.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="whitespace-nowrap">{new Date(l.created_at).toLocaleString("id-ID")}</TableCell>
                    <TableCell>{l.name ?? "-"}</TableCell>
                    <TableCell>{l.email ?? "-"}</TableCell>
                    <TableCell>{l.phone}</TableCell>
                    <TableCell>{l.template_name}</TableCell>
                    <TableCell className="space-x-1">
                      <Badge variant={l.status === "success" ? "default" : "destructive"} title={l.error_message ?? ""}>
                        {l.status === "success" ? "Berhasil" : "Gagal"}
                      </Badge>
                      {l.is_test && <Badge variant="outline">Uji</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
