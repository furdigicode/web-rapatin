

# Rencana: Animasi Loading pada Tombol Quick Order

## Ringkasan

Menambahkan animasi loading (spinner + teks "Memuat...") pada tombol "Pilih Quick Order" saat diklik untuk memberikan feedback visual kepada user bahwa aksi sedang diproses.

---

## Desain

```text
Sebelum klik:
┌─────────────────────────────┐
│     Pilih Quick Order       │
└─────────────────────────────┘

Setelah klik (loading):
┌─────────────────────────────┐
│   [⟳ spinner]  Memuat...    │
└─────────────────────────────┘
```

---

## Implementasi

### Perubahan pada `src/components/ui/order-option-modal.tsx`

**1. Tambah import dan state:**
```typescript
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react'; // Spinner icon
```

**2. Tambah state loading:**
```typescript
const [isLoading, setIsLoading] = useState(false);
```

**3. Update handleQuickOrder:**
```typescript
const handleQuickOrder = () => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'QuickOrderSelected');
  }
  setIsLoading(true);
  // Langsung navigasi - modal akan unmount bersama parent component
  navigate('/quick-order');
};
```

**4. Update Button Quick Order:**
```typescript
<Button 
  onClick={handleQuickOrder} 
  variant="outline" 
  className="w-full"
  disabled={isLoading}
>
  {isLoading ? (
    <>
      <Loader2 className="w-4 h-4 animate-spin" />
      Memuat...
    </>
  ) : (
    'Pilih Quick Order'
  )}
</Button>
```

---

## Perubahan File

| File | Aksi | Deskripsi |
|------|------|-----------|
| `src/components/ui/order-option-modal.tsx` | Ubah | Tambah state loading + spinner pada tombol Quick Order |

---

## Detail Perubahan Kode

| Baris | Perubahan |
|-------|-----------|
| 2 | Tambah `useState` ke import React |
| 5 | Tambah `Loader2` ke import lucide-react |
| 15 | Tambah state `const [isLoading, setIsLoading] = useState(false);` |
| 18-24 | Tambah `setIsLoading(true)` di handleQuickOrder |
| 157-163 | Ganti Button dengan conditional render (spinner + "Memuat..." atau "Pilih Quick Order") |

---

## Hasil

| Aksi | Sebelum | Sesudah |
|------|---------|---------|
| Klik Quick Order | Langsung navigasi tanpa feedback | Tombol berubah ke loading state dengan spinner dan teks "Memuat...", lalu navigasi |
| Visual feedback | Tidak ada | User tahu bahwa aksi sedang diproses |

