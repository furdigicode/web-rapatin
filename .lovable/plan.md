

# Rencana: Ganti Tombol "Buka Zoom Meeting" dengan Panduan

## Ringkasan

Mengganti tombol "Buka Zoom Meeting" di bawah invitation dengan dua tombol panduan:
1. **Panduan Menjadi Host** - link langsung
2. **Panduan Lainnya** - membuka dialog dengan daftar panduan

Layout:
- Desktop: dua tombol dalam satu baris (side by side)
- Mobile: dua tombol bertumpuk (stacked)

---

## Perubahan yang Diperlukan

### 1. Tambah Import Dialog Components

File: `src/pages/QuickOrderDetail.tsx`

```typescript
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
```

Tambah icon baru:
```typescript
import { BookOpen } from "lucide-react";
```

### 2. Ganti Tombol "Buka Zoom Meeting"

**Lokasi:** Line 682-687

**Sebelum:**
```tsx
<Button asChild className="w-full mt-4">
  <a href={order.zoom_link} target="_blank" rel="noopener noreferrer">
    <ExternalLink className="w-4 h-4 mr-2" />
    Buka Zoom Meeting
  </a>
</Button>
```

**Sesudah:**
```tsx
{/* Panduan Buttons */}
<div className="flex flex-col sm:flex-row gap-3 mt-4">
  <Button asChild variant="outline" className="flex-1">
    <a 
      href="https://example.com/panduan-host" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <BookOpen className="w-4 h-4 mr-2" />
      Panduan Menjadi Host
    </a>
  </Button>
  
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className="flex-1">
        <BookOpen className="w-4 h-4 mr-2" />
        Panduan Lainnya
      </Button>
    </DialogTrigger>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Panduan Lainnya</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <a 
          href="https://example.com/panduan-1"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
        >
          <BookOpen className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium">Panduan Mengundang Peserta</p>
            <p className="text-sm text-muted-foreground">
              Cara mengundang peserta ke meeting
            </p>
          </div>
          <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
        </a>
        
        <a 
          href="https://example.com/panduan-2"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
        >
          <BookOpen className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium">Panduan Recording</p>
            <p className="text-sm text-muted-foreground">
              Cara merekam meeting Zoom
            </p>
          </div>
          <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
        </a>
        
        <a 
          href="https://example.com/panduan-3"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
        >
          <BookOpen className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium">Panduan Fitur Lainnya</p>
            <p className="text-sm text-muted-foreground">
              Breakout room, polling, dan lainnya
            </p>
          </div>
          <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
        </a>
      </div>
    </DialogContent>
  </Dialog>
</div>
```

---

## Tampilan yang Diharapkan

### Desktop (side by side)
```text
┌──────────────────────────┐  ┌──────────────────────────┐
│  📖 Panduan Menjadi Host │  │  📖 Panduan Lainnya      │
└──────────────────────────┘  └──────────────────────────┘
```

### Mobile (stacked)
```text
┌──────────────────────────────────┐
│  📖 Panduan Menjadi Host         │
└──────────────────────────────────┘
┌──────────────────────────────────┐
│  📖 Panduan Lainnya              │
└──────────────────────────────────┘
```

### Dialog "Panduan Lainnya"
```text
┌─────────────────────────────────────────┐
│  Panduan Lainnya                    [X] │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │ 📖 Panduan Mengundang Peserta   ↗ │  │
│  │     Cara mengundang peserta...    │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ 📖 Panduan Recording            ↗ │  │
│  │     Cara merekam meeting Zoom     │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ 📖 Panduan Fitur Lainnya        ↗ │  │
│  │     Breakout room, polling...     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## Catatan

- Semua link saat ini menggunakan placeholder `https://example.com/...`
- User akan mengirimkan link panduan yang sebenarnya untuk menggantikan placeholder
- Styling menggunakan Tailwind CSS yang sudah ada di project

---

## File yang Diubah

| File | Perubahan |
|------|-----------|
| `src/pages/QuickOrderDetail.tsx` | Tambah import Dialog, ganti tombol Zoom dengan dua tombol panduan |

