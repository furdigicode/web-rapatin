
import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TERMS_SLUG = "syarat-ketentuan";

const LegalTermsManagement: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("Syarat & Ketentuan");
  const [slug] = useState<string>(TERMS_SLUG);
  const [published, setPublished] = useState<boolean>(true);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const loadDoc = async () => {
      setLoading(true);
      console.log('[Admin/Terms] Loading legal terms document...');
      const { data, error } = await supabase
        .from("legal_documents")
        .select("title, slug, content, published, last_updated")
        .eq("slug", TERMS_SLUG)
        .maybeSingle();

      if (error) {
        console.error("[Admin/Terms] Error loading:", error);
        toast({
          title: "Gagal memuat",
          description: "Terjadi kesalahan saat memuat data dokumen.",
          variant: "destructive",
        });
      } else if (data) {
        setTitle(data.title || "Syarat & Ketentuan");
        setPublished(Boolean(data.published));
        setContent(data.content || "");
      } else {
        console.log("[Admin/Terms] No document found, using defaults.");
      }

      setLoading(false);
    };

    loadDoc();
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    console.log('[Admin/Terms] Saving legal terms document...');
    const payload = {
      slug,
      title: title?.trim() || "Syarat & Ketentuan",
      content: content || "",
      published,
      last_updated: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("legal_documents")
      .upsert(payload, { onConflict: "slug" });

    setSaving(false);

    if (error) {
      console.error("[Admin/Terms] Save error:", error);
      toast({
        title: "Gagal menyimpan",
        description: error.message?.includes('permission') || error.code === '42501'
          ? "Sesi admin berakhir. Silakan login ulang."
          : "Silakan coba lagi beberapa saat lagi.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Berhasil disimpan",
      description: "Syarat & Ketentuan telah diperbarui.",
    });
  };

  return (
    <AdminLayout title="Legal - Syarat & Ketentuan">
      <AdminPageHeader
        title="Syarat & Ketentuan"
        description="Kelola konten Syarat & Ketentuan yang tampil di halaman publik."
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="glass p-4 md:p-6 rounded-xl space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Syarat & Ketentuan"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={slug} readOnly disabled className="bg-muted/50" />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="block">Publikasikan</Label>
                <p className="text-sm text-muted-foreground">
                  Jika dinonaktifkan, konten tidak akan tampil di halaman publik.
                </p>
              </div>
              <Switch checked={published} onCheckedChange={setPublished} disabled={loading} />
            </div>

            <div className="space-y-2">
              <Label>Konten</Label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Tulis konten HTML syarat & ketentuan di sini..."
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving || loading}>
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass p-4 md:p-6 rounded-xl space-y-3">
            <h3 className="font-semibold">Tips</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Gunakan tag HTML seperti h2, p, ul, li untuk struktur yang rapi.</li>
              <li>Tekan "Simpan" untuk menerbitkan perubahan (last updated di-set otomatis).</li>
              <li>Toggle "Publikasikan" untuk menampilkan/menyembunyikan di publik.</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LegalTermsManagement;
