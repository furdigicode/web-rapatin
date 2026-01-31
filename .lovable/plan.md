
# Rencana: Tambah FAQ Section di Halaman Quick Order

## Ringkasan

Menambahkan section FAQ (Pertanyaan yang Sering Diajukan) di bawah daftar payment method pada halaman Quick Order. FAQ menggunakan komponen Accordion untuk tampilan yang rapi dan interaktif.

---

## Struktur FAQ

| No | Pertanyaan | Jawaban |
|----|-----------|---------|
| 1 | Berapa lama durasi yang didapatkan? | 24 jam dalam satu tanggal, mulai jam 00:00 sampai jam 24:00. |
| 2 | Apakah dalam satu tanggal bisa digunakan berkali-kali? | Ya, bisa. Anda dapat menggunakan meeting berkali-kali selama masih dalam tanggal yang sama. |
| 3 | Bagaimana prosesnya? | Setelah mengisi data pesanan dan data meeting, kemudian menyelesaikan pembayaran, Anda langsung mendapatkan akses meeting. Akses diberikan langsung di halaman pembayaran berhasil, dan informasi juga dikirimkan ke email dan WhatsApp. |
| 4 | Apakah pesanan bisa di-reschedule atau di-upgrade? | Tidak bisa. Pesanan melalui Quick Order tidak dapat diubah atau diedit. Jika ingin akses jadwal yang lebih fleksibel, silakan mendaftar ke aplikasi Rapatin. |
| 5 | Apakah tersedia rekaman cloud? | Ya, tersedia. Untuk orderan Quick Order, hasil rekaman harus diminta manual melalui admin. Jika ingin akses rekaman tanpa bantuan admin, bisa mendaftar aplikasi Rapatin. |
| 6 | (Footer) | Ada pertanyaan lain? Hubungi WhatsApp Admin → tombol |

---

## Perubahan Detail

### 1. Buat Komponen Baru: `QuickOrderFAQ.tsx`

**File:** `src/components/quick-order/QuickOrderFAQ.tsx`

Komponen menggunakan Accordion dari Radix UI yang sudah tersedia di project:

```tsx
import { HelpCircle, MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqItems = [
  {
    question: "Berapa lama durasi yang didapatkan?",
    answer: "24 jam dalam satu tanggal, mulai jam 00:00 sampai jam 24:00."
  },
  {
    question: "Apakah dalam satu tanggal bisa digunakan berkali-kali?",
    answer: "Ya, bisa. Anda dapat menggunakan meeting berkali-kali selama masih dalam tanggal yang sama."
  },
  {
    question: "Bagaimana prosesnya?",
    answer: "Setelah mengisi data pesanan dan data meeting, kemudian menyelesaikan pembayaran, Anda langsung mendapatkan akses meeting. Akses diberikan langsung di halaman pembayaran berhasil, dan informasi juga dikirimkan ke email dan WhatsApp."
  },
  {
    question: "Apakah pesanan bisa di-reschedule atau di-upgrade?",
    answer: "Tidak bisa. Pesanan melalui Quick Order tidak dapat diubah atau diedit. Jika ingin akses jadwal yang lebih fleksibel, silakan mendaftar ke aplikasi Rapatin."
  },
  {
    question: "Apakah tersedia rekaman cloud?",
    answer: "Ya, tersedia. Untuk orderan Quick Order, hasil rekaman harus diminta manual melalui admin. Jika ingin akses rekaman tanpa bantuan admin, bisa mendaftar aplikasi Rapatin."
  }
];

export function QuickOrderFAQ() {
  const whatsappNumber = "6281234567890"; // Ganti dengan nomor admin
  const whatsappMessage = encodeURIComponent("Halo, saya ada pertanyaan tentang Quick Order Rapatin");

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-primary" />
        Pertanyaan Umum
      </h3>

      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-sm">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="pt-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          asChild
        >
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Ada pertanyaan lain? Hubungi Admin
          </a>
        </Button>
      </div>
    </div>
  );
}
```

### 2. Update QuickOrderForm untuk Menampilkan FAQ

**File:** `src/components/quick-order/QuickOrderForm.tsx`

Tambahkan import dan gunakan komponen di bawah `PaymentMethods`:

```tsx
// Tambah import
import { QuickOrderFAQ } from "./QuickOrderFAQ";

// Di bagian Right Column - Summary (setelah PaymentMethods, baris 463)
<PaymentMethods />

{/* FAQ Section */}
<QuickOrderFAQ />
```

---

## Preview Tampilan

```text
┌─────────────────────────────────────────────────────┐
│  📋 Ringkasan Order                                 │
│  ...                                                │
│  Total Bayar              Rp10.000                  │
└─────────────────────────────────────────────────────┘

[ 💳 Bayar Sekarang ]

   QRIS    Virtual Account    E-Wallet

┌─────────────────────────────────────────────────────┐
│  ❓ Pertanyaan Umum                                 │
│                                                     │
│  ▸ Berapa lama durasi yang didapatkan?             │
│  ▸ Apakah dalam satu tanggal bisa berkali-kali?    │
│  ▸ Bagaimana prosesnya?                            │
│  ▸ Apakah pesanan bisa di-reschedule/upgrade?      │
│  ▸ Apakah tersedia rekaman cloud?                  │
│                                                     │
│  [ 💬 Ada pertanyaan lain? Hubungi Admin ]         │
└─────────────────────────────────────────────────────┘
```

---

## Ringkasan Perubahan

| File | Aksi | Deskripsi |
|------|------|-----------|
| `src/components/quick-order/QuickOrderFAQ.tsx` | Buat | Komponen FAQ dengan Accordion |
| `src/components/quick-order/QuickOrderForm.tsx` | Ubah | Import dan tampilkan QuickOrderFAQ |

---

## Catatan Teknis

- Menggunakan komponen `Accordion` dari Radix UI yang sudah tersedia di `@/components/ui/accordion`
- Nomor WhatsApp admin perlu disesuaikan dengan nomor yang benar
- FAQ menggunakan `type="single"` dan `collapsible` agar hanya satu item terbuka dalam satu waktu
