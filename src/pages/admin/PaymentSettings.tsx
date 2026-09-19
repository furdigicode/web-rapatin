import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard } from "lucide-react";
import type { PaymentGateway } from "@/types/OrderTypes";

const GATEWAYS: { id: PaymentGateway; label: string; description: string }[] = [
  {
    id: "duitku",
    label: "Duitku",
    description: "Pop-up pembayaran di halaman order. QRIS, Virtual Account, E-Wallet, Retail.",
  },
  {
    id: "xendit",
    label: "Xendit",
    description: "Pengalihan ke halaman pembayaran Xendit. QRIS, Virtual Account, E-Wallet, Kartu Kredit.",
  },
];

export default function PaymentSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gateway, setGateway] = useState<PaymentGateway>("duitku");
  const [meta, setMeta] = useState<{ updated_at: string | null; updated_by: string | null }>({
    updated_at: null,
    updated_by: null,
  });

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("payment_gateway_settings")
      .select("active_gateway, updated_at, updated_by")
      .eq("id", "default")
      .maybeSingle();
    if (error) {
      toast({ title: "Gagal memuat pengaturan", description: error.message, variant: "destructive" });
    } else if (data) {
      setGateway((data.active_gateway === "xendit" ? "xendit" : "duitku") as PaymentGateway);
      setMeta({ updated_at: data.updated_at, updated_by: data.updated_by });
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    setSaving(true);
    try {
      const token = localStorage.getItem("adminAuthToken") ?? "";
      const { data, error } = await supabase.functions.invoke("update-payment-gateway", {
        body: { token, active_gateway: gateway },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      setMeta({ updated_at: data.updated_at, updated_by: data.updated_by });
      toast({ title: "Pengaturan disimpan", description: `Order baru akan menggunakan ${gateway === "duitku" ? "Duitku" : "Xendit"}.` });
    } catch (e) {
      toast({ title: "Gagal menyimpan", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Pengaturan Pembayaran</h1>
          <p className="text-muted-foreground text-sm">
            Tentukan penyedia pembayaran yang dipakai untuk order baru di halaman Quick Order.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Penyedia Pembayaran Aktif
            </CardTitle>
            <CardDescription>
              Pelanggan tidak memilih penyedia pembayaran. Semua order baru memakai pilihan di bawah ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> Memuat...
              </div>
            ) : (
              <>
                <RadioGroup
                  value={gateway}
                  onValueChange={(v) => setGateway(v as PaymentGateway)}
                  className="space-y-3"
                >
                  {GATEWAYS.map((g) => (
                    <div key={g.id} className="flex items-start gap-3 rounded-xl border p-4">
                      <RadioGroupItem value={g.id} id={`gateway-${g.id}`} className="mt-1" />
                      <Label htmlFor={`gateway-${g.id}`} className="cursor-pointer space-y-1">
                        <span className="block font-semibold">{g.label}</span>
                        <span className="block text-xs font-normal text-muted-foreground">
                          {g.description}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={save} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan Pengaturan
                  </Button>
                  {meta.updated_at && (
                    <span className="text-xs text-muted-foreground">
                      Terakhir diubah {new Date(meta.updated_at).toLocaleString("id-ID")}
                      {meta.updated_by ? ` oleh ${meta.updated_by}` : ""}
                    </span>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
