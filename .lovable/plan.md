
# Rencana: Perbaiki Layout FAQ di Quick Order

## Analisis Masalah

Dari screenshot terlihat bahwa ketika FAQ section di-expand:
- Konten FAQ mempengaruhi lebar seluruh kolom form
- Ini terjadi karena FAQ berada di dalam grid 2 kolom yang sama dengan form
- Accordion yang terbuka menyebabkan reflow layout

Di halaman QuickOrderDetail, FAQ ditampilkan dalam Card terpisah di luar grid form (lines 921-1015):

```tsx
{/* FAQ Section (only for paid orders) */}
{isPaid && (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-lg">Pertanyaan Umum (FAQ)</h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        ...
      </Accordion>
    </CardContent>
  </Card>
)}
```

---

## Solusi

Memindahkan FAQ section keluar dari grid form dan menempatkannya dalam Card terpisah di bawah form utama.

---

## Perubahan Detail

### 1. Update QuickOrderForm.tsx

**Hapus FAQ dari dalam grid layout** dan kembalikan sebagai child component yang di-render di luar grid.

### 2. Update QuickOrder.tsx (halaman utama)

**Tambahkan FAQ dalam Card terpisah** di bawah form container.

---

## Struktur Sebelum

```text
┌─────────────────────────────────────────────────────────────┐
│  bg-card border rounded-2xl p-6 shadow-lg                   │
│                                                             │
│  ┌────────────────────────┐  ┌────────────────────────┐    │
│  │   Left Column          │  │   Right Column         │    │
│  │   (Form Fields)        │  │   (Summary)            │    │
│  │                        │  │   [Bayar Sekarang]     │    │
│  │                        │  │   Payment Methods      │    │
│  │                        │  │   FAQ Section ← MASALAH│    │
│  └────────────────────────┘  └────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Struktur Sesudah

```text
┌─────────────────────────────────────────────────────────────┐
│  bg-card border rounded-2xl p-6 shadow-lg                   │
│                                                             │
│  ┌────────────────────────┐  ┌────────────────────────┐    │
│  │   Left Column          │  │   Right Column         │    │
│  │   (Form Fields)        │  │   (Summary)            │    │
│  │                        │  │   [Bayar Sekarang]     │    │
│  │                        │  │   Payment Methods      │    │
│  └────────────────────────┘  └────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Card terpisah untuk FAQ                                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  ❓ Pertanyaan Umum                                     ││
│  │  ▸ Berapa lama durasi yang didapatkan?                  ││
│  │  ▸ Apakah dalam satu tanggal bisa berkali-kali?         ││
│  │  ▸ Bagaimana prosesnya?                                 ││
│  │  ...                                                    ││
│  │  [ 💬 Ada pertanyaan lain? Hubungi Admin ]              ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## File yang Diubah

| File | Aksi | Deskripsi |
|------|------|-----------|
| `src/components/quick-order/QuickOrderForm.tsx` | Ubah | Hapus import dan render QuickOrderFAQ |
| `src/components/quick-order/QuickOrderFAQ.tsx` | Ubah | Kembalikan ke struktur non-Collapsible, langsung gunakan Card |
| `src/pages/QuickOrder.tsx` | Ubah | Import dan render QuickOrderFAQ dalam Card terpisah di bawah form |

---

## Detail Kode

### QuickOrderFAQ.tsx (Struktur Baru)

```tsx
import { HelpCircle, MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const faqItems = [
  // ... same as before
];

export function QuickOrderFAQ() {
  const whatsappNumber = "6281318887658";
  const whatsappMessage = encodeURIComponent("...");

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Pertanyaan Umum</h3>
        </div>

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

        <div className="pt-4">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
               target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4 mr-2" />
              Ada pertanyaan lain? Hubungi Admin
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### QuickOrder.tsx (Tambahan di Form Section)

```tsx
import { QuickOrderFAQ } from "@/components/quick-order/QuickOrderFAQ";

// Di bagian Form Section, setelah form container
<section className="pb-16 md:pb-24">
  <div className="container mx-auto px-4">
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Form Container */}
      <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-lg">
        <QuickOrderForm />
      </div>

      {/* FAQ Section - Card terpisah */}
      <QuickOrderFAQ />
    </div>
  </div>
</section>
```

---

## Benefit

1. **Layout stabil** - FAQ tidak mempengaruhi lebar kolom form
2. **Konsisten dengan QuickOrderDetail** - Menggunakan pola Card terpisah yang sama
3. **Lebih rapi di mobile** - FAQ memiliki container sendiri yang jelas
4. **Tidak perlu Collapsible** - Card terpisah sudah cukup untuk visual separation
