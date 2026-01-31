

# Rencana: Fix Flickering Modal - Navigate Langsung Tanpa Close

## Masalah

Urutan event saat ini yang menyebabkan flickering:

```text
Klik "Pilih Quick Order"
    │
    ▼
onClose() dipanggil
    │
    ▼
Dialog state = closed, animasi CSS mulai (duration: 200ms)
    │  ├── fade-out-0
    │  └── zoom-out-95  
    │
    ▼ (setelah 100ms - animasi belum selesai)
navigate('/quick-order') dipanggil
    │
    ▼
React Router mulai render halaman baru
    │
    ▼
Komponen SewaZoomHarianSection momentarily remount
    │
    ▼
Modal sempat muncul kembali (state inconsistent)
    │
    ▼
Akhirnya halaman /quick-order fully rendered
    │
    ▼
Modal hilang (komponen unmount)
```

## Solusi

**Navigate langsung tanpa memanggil onClose()** - ketika navigasi terjadi, komponen parent (`SewaZoomHarianSection`) akan unmount, sehingga modal juga otomatis hilang tanpa perlu animasi close.

```text
Klik "Pilih Quick Order"
    │
    ▼
navigate('/quick-order') dipanggil langsung
    │
    ▼
React Router unmount SewaZoomHarianSection
    │
    ▼
Modal otomatis hilang (komponen destroyed)
    │
    ▼
Halaman /quick-order rendered
```

Keuntungan:
- Tidak ada race condition antara animasi dan navigasi
- Transisi lebih cepat dan bersih
- Tidak perlu setTimeout

---

## Perubahan Kode

### File: `src/components/ui/order-option-modal.tsx`

**Baris 18-26 (sebelum):**
```typescript
const handleQuickOrder = () => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'QuickOrderSelected');
  }
  onClose();
  setTimeout(() => {
    navigate('/quick-order');
  }, 100);
};
```

**Baris 18-24 (sesudah):**
```typescript
const handleQuickOrder = () => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'QuickOrderSelected');
  }
  // Langsung navigasi - modal akan unmount bersama parent component
  navigate('/quick-order');
};
```

---

## Perubahan File

| File | Aksi | Deskripsi |
|------|------|-----------|
| `src/components/ui/order-option-modal.tsx` | Ubah | Hapus `onClose()` dan `setTimeout`, panggil `navigate()` langsung |

---

## Hasil

| Aspek | Sebelum | Sesudah |
|-------|---------|---------|
| Animasi | Close animation + navigate → flickering | Langsung navigate → clean |
| Delay | 100ms sebelum navigasi | 0ms (instan) |
| UX | Modal hilang-muncul-hilang | Modal langsung hilang |

