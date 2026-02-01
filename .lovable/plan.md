

# Rencana: Pertegas Perbedaan Rekaman & Laporan di Modal Pilihan Order

## Masalah

Teks saat ini di modal menyesatkan:
- **Quick Order**: "Tidak ada akses rekaman" dan "Tidak ada laporan peserta" (dengan X merah) 

Ini memberi kesan bahwa Quick Order sama sekali tidak bisa mendapatkan rekaman dan laporan, padahal sebenarnya **bisa**, tapi harus request ke admin terlebih dahulu.

---

## Perubahan yang Dibutuhkan

### Via Aplikasi (Kolom Kiri)
Pertegas bahwa user bisa **akses mandiri** dan lihat **status progress**:

| Sebelum | Sesudah |
|---------|---------|
| ✅ Akses rekaman cloud | ✅ Akses rekaman mandiri |
| ✅ Laporan peserta | ✅ Laporan peserta otomatis |
| - | ✅ Lihat status progress rekaman |

### Quick Order (Kolom Kanan)
Ubah dari "tidak ada" menjadi "harus request admin":

| Sebelum | Sesudah |
|---------|---------|
| ❌ Tidak ada akses rekaman | ⚠️ Rekaman via request admin |
| ❌ Tidak ada laporan peserta | ⚠️ Laporan via request admin |

---

## Detail Implementasi

### File: `src/components/ui/order-option-modal.tsx`

#### Via Aplikasi - Lines 86-93
```tsx
// Sebelum
<span className="text-foreground">Akses rekaman cloud</span>
<span className="text-foreground">Laporan peserta</span>

// Sesudah
<span className="text-foreground">Akses rekaman mandiri</span>
<span className="text-foreground">Lihat status progress rekaman</span>
<span className="text-foreground">Laporan peserta otomatis</span>
```

#### Quick Order - Lines 153-160
Ganti ikon dari X merah menjadi ikon yang menunjukkan "bisa tapi dengan syarat" (menggunakan `MessageCircle` atau ikon warning dengan warna amber/orange):

```tsx
// Sebelum
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  <X className="w-4 h-4 text-red-400 flex-shrink-0" />
  <span>Tidak ada akses rekaman</span>
</div>
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  <X className="w-4 h-4 text-red-400 flex-shrink-0" />
  <span>Tidak ada laporan peserta</span>
</div>

// Sesudah - menggunakan ikon MessageCircle dengan warna amber
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  <MessageCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
  <span>Rekaman via request admin</span>
</div>
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  <MessageCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
  <span>Laporan via request admin</span>
</div>
```

---

## Visual Comparison

```text
┌─────────────────────────────────────────────────────────────────┐
│                    Via Aplikasi                                 │
│                    (Rekomendasi)                                │
├─────────────────────────────────────────────────────────────────┤
│ ✅ Edit jadwal kapan saja                                       │
│ ✅ Akses rekaman mandiri          ← Lebih jelas                 │
│ ✅ Lihat status progress rekaman  ← BARU                        │
│ ✅ Laporan peserta otomatis       ← Lebih jelas                 │
│ ✅ Ringkasan rapat (AI)                                         │
│ ✅ Riwayat semua meeting                                        │
│ ❌ Perlu daftar akun                                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Quick Order                                  │
│                    (Praktis & Cepat)                            │
├─────────────────────────────────────────────────────────────────┤
│ ✅ Bayar langsung                                               │
│ ✅ Link Zoom instan                                             │
│ ✅ Tanpa registrasi                                             │
│ ❌ Tidak bisa edit jadwal                                       │
│ 💬 Rekaman via request admin      ← Bukan "tidak ada"           │
│ 💬 Laporan via request admin      ← Bukan "tidak ada"           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Ringkasan Perubahan

| File | Perubahan |
|------|-----------|
| `src/components/ui/order-option-modal.tsx` | Update teks dan ikon untuk fitur rekaman & laporan |

---

## Hasil yang Diharapkan

User akan memahami perbedaan yang lebih jelas:
- **Via Aplikasi**: Akses mandiri, bisa lihat progress, otomatis tersedia
- **Quick Order**: Tetap bisa dapat rekaman & laporan, tapi perlu chat admin untuk request

