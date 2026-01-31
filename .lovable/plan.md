

# Rencana: Fix Spinner Tidak Terlihat pada Tombol Quick Order

## Masalah

Spinner tidak muncul karena navigasi terjadi **terlalu cepat** - React belum sempat re-render dengan state `isLoading = true` sebelum komponen unmount.

```text
Timeline saat ini:
─────────────────────────────────────────────────►
│ setIsLoading(true) │ navigate() │ unmount │
                      ↑
              Belum ada re-render!
              Spinner tidak terlihat
```

## Solusi

Gunakan `flushSync` dari React untuk **memaksa re-render sinkron** sebelum navigasi, atau tambahkan sedikit delay agar spinner sempat terlihat.

**Opsi yang dipilih: `flushSync`** - karena ini memastikan UI update terlebih dahulu tanpa menambah delay artifisial.

```text
Timeline dengan flushSync:
─────────────────────────────────────────────────►
│ setIsLoading(true) │ re-render │ navigate() │ unmount │
                      ↑
              Spinner terlihat!
```

---

## Perubahan Kode

### File: `src/components/ui/order-option-modal.tsx`

**1. Tambah import flushSync:**
```typescript
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
```

**2. Update handleQuickOrder:**
```typescript
const handleQuickOrder = () => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'QuickOrderSelected');
  }
  
  // Force synchronous re-render agar spinner terlihat
  flushSync(() => {
    setIsLoading(true);
  });
  
  // Navigasi setelah UI update
  navigate('/quick-order');
};
```

---

## Perubahan File

| File | Aksi | Deskripsi |
|------|------|-----------|
| `src/components/ui/order-option-modal.tsx` | Ubah | Import `flushSync` dari react-dom dan wrap `setIsLoading` |

---

## Detail Perubahan

| Baris | Perubahan |
|-------|-----------|
| 2-3 | Tambah import `flushSync` dari `react-dom` |
| 19-27 | Wrap `setIsLoading(true)` dengan `flushSync()` |

---

## Hasil

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Spinner | Tidak terlihat | Terlihat sebelum navigasi |
| Delay | 0ms | 0ms (tetap instan) |
| Teknik | React batching skip render | flushSync memaksa render sinkron |

