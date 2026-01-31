

# Rencana: Fix Flickering Modal saat Navigasi ke Quick Order

## Masalah

Modal tidak langsung tertutup saat klik "Quick Order". Urutan yang terjadi:
1. Modal mulai animasi close (fade-out + zoom-out)
2. Setelah 100ms, navigasi terjadi
3. Selama transisi route, komponen re-render dan modal sempat muncul kembali sebelum akhirnya hilang

## Penyebab

Radix UI Dialog memiliki animasi CSS pada `DialogContent` dan `DialogOverlay`:
- `data-[state=closed]:fade-out-0`
- `data-[state=closed]:zoom-out-95`

Animasi ini memerlukan waktu untuk selesai (~200ms berdasarkan `duration-200`). Ketika navigasi terjadi di tengah animasi, React Router melakukan re-render yang menyebabkan state tidak konsisten.

## Solusi

Gunakan pendekatan **navigate dulu, baru close** - karena saat navigasi ke halaman baru, komponen `SewaZoomHarianSection` akan unmount sehingga modal otomatis hilang tanpa perlu close animation.

```typescript
const handleQuickOrder = () => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'QuickOrderSelected');
  }
  // Navigasi langsung tanpa close - komponen akan unmount
  navigate('/quick-order');
};
```

Pendekatan ini lebih bersih karena:
1. Tidak ada race condition antara close dan navigate
2. Modal akan langsung hilang saat halaman baru dimuat
3. Tidak perlu setTimeout

---

## Perubahan Kode

### File: `src/components/ui/order-option-modal.tsx`

**Sebelum (line 18-26):**
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

**Sesudah:**
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
| `src/components/ui/order-option-modal.tsx` | Ubah | Hapus onClose() dan setTimeout, navigasi langsung |

---

## Hasil

| Sebelum | Sesudah |
|---------|---------|
| Modal flickering (hilang-muncul-hilang) | Modal langsung hilang saat pindah halaman |
| Delay 100ms sebelum navigasi | Navigasi instan |

