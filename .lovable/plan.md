

# Rencana: Tambah Konten Panduan Menjadi Host

## Ringkasan

Mengupdate dialog "Panduan Menjadi Host" dengan:
1. Informasi penting yang di-highlight di atas video
2. Embed video YouTube tutorial

---

## Perubahan yang Diperlukan

### File: `src/pages/QuickOrderDetail.tsx`

**Lokasi:** Line 740-744 (konten dialog Panduan Menjadi Host)

**Sebelum:**
```tsx
<div className="prose prose-sm dark:prose-invert">
  <p className="text-muted-foreground">
    Panduan menjadi host akan ditambahkan di sini.
  </p>
</div>
```

**Sesudah:**
```tsx
<div className="space-y-4">
  {/* Highlighted Important Notice */}
  <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
          Penting!
        </p>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Untuk mengaktivasi semua fitur premium di Zoom, Anda harus menjadi host terlebih dahulu. Ikuti panduan video di bawah ini.
        </p>
      </div>
    </div>
  </div>
  
  {/* YouTube Embed */}
  <div className="aspect-video rounded-lg overflow-hidden">
    <iframe
      src="https://www.youtube.com/embed/8QX8u43_JE?si=mR9aX2BiDqohjuqW"
      title="Panduan Menjadi Host Zoom"
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
</div>
```

---

## Tampilan yang Diharapkan

```text
┌─────────────────────────────────────────┐
│  Panduan Menjadi Host               [X] │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐│
│  │ ⚠️ Penting!                         ││
│  │                                     ││
│  │ Untuk mengaktivasi semua fitur      ││
│  │ premium di Zoom, Anda harus menjadi ││
│  │ host terlebih dahulu. Ikuti panduan ││
│  │ video di bawah ini.                 ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │         [YouTube Video]             ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

---

## Import Tambahan

Perlu menambahkan icon `AlertCircle` dari lucide-react:

```typescript
import { 
  // ... existing imports
  AlertCircle
} from "lucide-react";
```

---

## Catatan Teknis

- YouTube embed menggunakan format URL `youtube.com/embed/VIDEO_ID`
- Menggunakan `aspect-video` dari Tailwind untuk rasio 16:9
- Highlighted box menggunakan warna amber untuk menarik perhatian
- Responsive dan mendukung dark mode

---

## File yang Diubah

| File | Perubahan |
|------|-----------|
| `src/pages/QuickOrderDetail.tsx` | Tambah import AlertCircle, update konten dialog dengan notice dan YouTube embed |

