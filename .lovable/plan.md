

# Rencana: Perbaiki Modal Pilihan Order

## Ringkasan

Memperbaiki 3 hal pada modal pilihan order:
1. Tukar posisi kartu (Via Aplikasi di kiri, Quick Order di kanan)
2. Fix bug modal tidak tertutup saat klik Quick Order
3. Pastikan Via Aplikasi membuka tab baru (sudah benar, tapi akan diverifikasi)

---

## Perubahan yang Akan Dilakukan

### 1. Tukar Posisi Kartu

| Sebelum | Sesudah |
|---------|---------|
| Kiri: Quick Order | Kiri: Via Aplikasi (Rekomendasi) |
| Kanan: Via Aplikasi | Kanan: Quick Order |

### 2. Fix Modal Tidak Tertutup

**Masalah**: `navigate()` mungkin terpanggil sebelum `onClose()` selesai mengupdate state, menyebabkan race condition.

**Solusi**: Gunakan `setTimeout` untuk memastikan modal tertutup dulu sebelum navigasi, atau pindahkan urutan eksekusi.

```typescript
const handleQuickOrder = () => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'QuickOrderSelected');
  }
  onClose(); // Tutup modal dulu
  // Gunakan setTimeout untuk delay navigasi sedikit
  setTimeout(() => {
    navigate('/quick-order');
  }, 100);
};
```

### 3. Via Aplikasi Tab Baru

Kode sudah benar menggunakan `window.open(url, '_blank')`. Ini akan membuka tab baru. Tidak perlu perubahan.

---

## Layout Modal Setelah Update

```text
┌─────────────────────────────────────────────────────────────────────┐
│                     🎯 Pilih Cara Order Anda                        │
│                                                                     │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐  │
│  │    [Rekomendasi]            │  │                              │  │
│  │ 📱 Via Aplikasi             │  │ ⚡ Quick Order               │  │
│  │                              │  │                              │  │
│  │  Fitur Lengkap               │  │  Praktis & Cepat             │  │
│  │  ✓ Edit jadwal               │  │  ✓ Bayar langsung            │  │
│  │  ✓ Rekaman cloud             │  │  ✓ Link Zoom instan          │  │
│  │  ✓ Laporan peserta           │  │  ✓ Tanpa registrasi          │  │
│  │  ✓ Ringkasan AI              │  │  ✗ Tidak bisa edit jadwal    │  │
│  │  ✗ Perlu daftar akun         │  │  ✗ Tidak ada rekaman         │  │
│  │                              │  │                              │  │
│  │  [  Daftar & Mulai   ]       │  │  [  Pilih Quick Order  ]     │  │
│  └──────────────────────────────┘  └──────────────────────────────┘  │
│              KIRI                            KANAN                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Detail Perubahan Kode

### File: `src/components/ui/order-option-modal.tsx`

**1. Fix handleQuickOrder (line 18-24):**
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

**2. Tukar posisi kartu dalam grid (line 52-168):**

Pindahkan blok "Via Aplikasi Option" (line 109-168) ke posisi pertama (sebelum "Quick Order Option").

---

## Perubahan File

| File | Aksi | Deskripsi |
|------|------|-----------|
| `src/components/ui/order-option-modal.tsx` | Ubah | Tukar posisi kartu + fix navigasi |

---

## Hasil Akhir

| Aksi User | Hasil |
|-----------|-------|
| Klik "Daftar & Mulai" | Membuka tab baru ke app.rapatin.id/register |
| Klik "Pilih Quick Order" | Modal tertutup, lalu navigasi ke /quick-order |

