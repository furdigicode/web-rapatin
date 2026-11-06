import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export interface FollowUpUser {
  id: number; name: string | null; email: string | null; phone: string | null;
  balance: number; base_usage: number; base_schedules: number;
  last_schedule_at: string | null; segment: "loyal" | "bulan_pertama" | "sekali_lainnya"; high_value: boolean;
}

const SEG: Record<FollowUpUser["segment"], string> = { loyal: "Loyal", bulan_pertama: "Bulan pertama", sekali_lainnya: "Sekali lainnya" };
const rupiah = (n: number) => `Rp ${Math.round(n).toLocaleString("id-ID")}`;

export function toWaNumber(phone: string | null): string | null {
  if (!phone) return null;
  let d = phone.replace(/\D/g, "");
  if (!d) return null;
  if (d.startsWith("0")) d = "62" + d.slice(1);
  else if (!d.startsWith("62")) d = "62" + d;
  return d;
}

export function buildMessage(u: FollowUpUser, baseLabel: string, compareLabel: string): string {
  const name = (u.name ?? "").trim() || "Kak";
  const greet = `Halo kak ${name}, salam dari tim Rapatin 👋`;
  let body: string;
  if (u.segment === "loyal") {
    body = `Terima kasih sudah rutin memakai Rapatin. Di ${baseLabel} kakak menjadwalkan ${u.base_schedules} rapat, tapi di ${compareLabel} kami belum melihat jadwal baru. Apakah ada kendala yang bisa kami bantu?`;
  } else if (u.segment === "bulan_pertama") {
    body = `Terima kasih sudah mencoba Rapatin di ${baseLabel}. Bagaimana pengalaman rapat pertama kakak? Kalau ada yang membingungkan atau kurang pas, kami siap bantu.`;
  } else {
    body = `Kami lihat kakak pernah menjadwalkan rapat di Rapatin pada ${baseLabel}. Yuk jadwalkan rapat berikutnya, prosesnya cepat dan bayar sesuai pemakaian.`;
  }
  const saldo = u.balance > 0
    ? `Saldo kakak masih ${rupiah(u.balance)}, bisa langsung dipakai untuk jadwal berikutnya.`
    : `Saldo kakak saat ini ${rupiah(0)}. Kakak bisa top up kapan saja untuk menjadwalkan rapat berikutnya.`;
  return `${greet}\n\n${body}\n\n${saldo}\n\nBalas pesan ini kalau butuh bantuan ya kak 🙏`;
}

interface Props {
  user: FollowUpUser | null; baseLabel: string; compareLabel: string; onOpenChange: (o: boolean) => void;
}

export default function ChurnFollowUpSheet({ user, baseLabel, compareLabel, onOpenChange }: Props) {
  const [msg, setMsg] = useState("");
  useEffect(() => { if (user) setMsg(buildMessage(user, baseLabel, compareLabel)); }, [user, baseLabel, compareLabel]);
  const wa = toWaNumber(user?.phone ?? null);

  return (
    <Sheet open={!!user} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        {user && (
          <>
            <SheetHeader>
              <SheetTitle>Follow Up · {user.name ?? `#${user.id}`}</SheetTitle>
              <SheetDescription>Pesan dipersonalisasi dari data user. Bisa diedit sebelum dikirim.</SheetDescription>
            </SheetHeader>
            <div className="mt-4 grid grid-cols-2 gap-3 rounded-md border p-3 text-sm">
              <div><div className="text-muted-foreground text-xs">WhatsApp</div>{user.phone ?? "-"}</div>
              <div><div className="text-muted-foreground text-xs">Email</div><span className="break-all">{user.email ?? "-"}</span></div>
              <div><div className="text-muted-foreground text-xs">Segmen</div>
                <div className="flex flex-wrap gap-1"><Badge variant="secondary">{SEG[user.segment]}</Badge>{user.high_value && <Badge>Nilai tinggi</Badge>}</div></div>
              <div><div className="text-muted-foreground text-xs">Jadwal ({baseLabel})</div>{user.base_schedules}</div>
              <div><div className="text-muted-foreground text-xs">Pemakaian saldo</div>{rupiah(user.base_usage)}</div>
              <div><div className="text-muted-foreground text-xs">Jadwal terakhir</div>{user.last_schedule_at?.slice(0, 16) ?? "-"}</div>
              <div className="col-span-2"><div className="text-muted-foreground text-xs">Sisa saldo</div><span className="text-base font-semibold">{rupiah(user.balance)}</span></div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium">Pesan</div>
              <Textarea rows={12} value={msg} onChange={(e) => setMsg(e.target.value)} />
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={async () => { await navigator.clipboard.writeText(msg); toast.success("Pesan disalin"); }}>
                <Copy className="mr-2 h-4 w-4" />Salin Pesan
              </Button>
              <Button disabled={!wa} asChild={!!wa}>
                {wa ? (
                  <a href={`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />Buka WhatsApp
                  </a>
                ) : (<span><MessageCircle className="mr-2 h-4 w-4 inline" />Nomor kosong</span>)}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
