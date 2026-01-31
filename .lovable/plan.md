
# Rencana: Perbaiki Tampilan FAQ di Mobile

## Masalah

Dari screenshot terlihat FAQ section terlalu panjang di mobile karena:
- Accordion trigger memiliki padding yang besar (py-4)
- Tidak ada opsi untuk menyembunyikan seluruh FAQ section
- Pertanyaan panjang memakan banyak baris

---

## Solusi

Memperbaiki styling FAQ agar lebih compact di mobile dengan:
1. Mengurangi padding pada accordion trigger
2. Membungkus FAQ dalam Collapsible component sehingga user bisa menyembunyikan seluruh section
3. Memperkecil ukuran font di mobile

---

## Perubahan Detail

**File:** `src/components/quick-order/QuickOrderFAQ.tsx`

### Perubahan yang dilakukan:

```tsx
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function QuickOrderFAQ() {
  const [isOpen, setIsOpen] = useState(false);
  // ...

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      {/* Header yang bisa diklik */}
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          <span className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Pertanyaan Umum
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </Button>
      </CollapsibleTrigger>

      {/* Content yang bisa di-collapse */}
      <CollapsibleContent>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-sm py-3">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* WhatsApp Button */}
        <Button variant="outline" size="sm" className="w-full mt-4" asChild>
          <a href={...}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Ada pertanyaan lain? Hubungi Admin
          </a>
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
}
```

---

## Preview Tampilan Mobile

### Sebelum (FAQ terbuka langsung)
```text
┌────────────────────────────────────┐
│  [ Bayar Sekarang ]                │
│  QRIS  Virtual Account  E-Wallet   │
│                                    │
│  ❓ Pertanyaan Umum                │
│  ────────────────────────────────  │
│  ▸ Berapa lama durasi...?     ▼    │
│  ────────────────────────────────  │
│  ▸ Apakah dalam satu tanggal...    │
│    bisa digunakan berkali-kali? ▼  │
│  ────────────────────────────────  │
│  ▸ Bagaimana prosesnya?       ▼    │
│  ────────────────────────────────  │
│  ▸ Apakah pesanan bisa di-         │
│    reschedule atau di-upgrade? ▼   │
│  ────────────────────────────────  │
│  ▸ Apakah tersedia rekaman... ▼    │
│  ────────────────────────────────  │
│                                    │
│  [ 💬 Hubungi Admin ]              │
└────────────────────────────────────┘
```

### Sesudah (FAQ bisa di-collapse)
```text
┌────────────────────────────────────┐
│  [ Bayar Sekarang ]                │
│  QRIS  Virtual Account  E-Wallet   │
│                                    │
│  ❓ Pertanyaan Umum            ▼   │  ← Klik untuk expand
└────────────────────────────────────┘

Ketika di-expand:

┌────────────────────────────────────┐
│  ❓ Pertanyaan Umum            ▲   │
│                                    │
│  ▸ Berapa lama durasi...?     ▼    │
│  ▸ Apakah berkali-kali...     ▼    │
│  ▸ Bagaimana prosesnya?       ▼    │
│  ▸ Reschedule/upgrade?        ▼    │
│  ▸ Rekaman cloud?             ▼    │
│                                    │
│  [ 💬 Hubungi Admin ]              │
└────────────────────────────────────┘
```

---

## Ringkasan Perubahan

| File | Aksi | Deskripsi |
|------|------|-----------|
| `src/components/quick-order/QuickOrderFAQ.tsx` | Ubah | Wrap dengan Collapsible, perkecil padding accordion trigger |

---

## Benefit

1. **Lebih compact di mobile** - User tidak melihat daftar panjang langsung
2. **User bisa hide/show** - Jika tidak butuh FAQ, bisa disembunyikan
3. **Padding lebih kecil** - py-3 instead of py-4 untuk accordion trigger
4. **UX lebih baik** - Fokus pada tombol "Bayar Sekarang", FAQ sebagai optional info
