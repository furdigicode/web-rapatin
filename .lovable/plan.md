

# Rencana: Seragamkan Font Size di PricingSummary

## Analisis

Saat ini ukuran font di PricingSummary tidak konsisten:
- "Biaya Payment Gateway - GRATIS" menggunakan `text-sm`
- Item lainnya (Topik, Kapasitas, Tanggal, Jam, Durasi, Platform) menggunakan ukuran default (base)
- "Total Bayar" menggunakan `text-lg`

## Perubahan

Menambahkan `text-sm` pada semua item summary **kecuali** "Total Bayar" yang tetap `text-lg`.

---

## Detail Perubahan

**File:** `src/components/quick-order/PricingSummary.tsx`

| Bagian | Sebelum | Sesudah |
|--------|---------|---------|
| Topik row | tanpa text-sm | + `text-sm` |
| Kapasitas row | tanpa text-sm | + `text-sm` |
| Tanggal row | tanpa text-sm | + `text-sm` |
| Jam Mulai row | tanpa text-sm | + `text-sm` |
| Passcode row | tanpa text-sm | + `text-sm` |
| Durasi row | tanpa text-sm | + `text-sm` |
| Platform row | tanpa text-sm | + `text-sm` |
| Meeting Berulang row | tanpa text-sm | + `text-sm` |
| Payment Gateway | sudah `text-sm` | tetap |
| **Total Bayar** | `text-lg` | **tetap `text-lg`** |

---

## Kode Perubahan

```tsx
// Topik (line 92)
<div className="flex items-start justify-between gap-2 text-sm">

// Kapasitas (line 101)
<div className="flex items-center justify-between text-sm">

// Tanggal (line 109)
<div className="flex items-center justify-between text-sm">

// Jam Mulai (line 117)
<div className="flex items-center justify-between text-sm">

// Passcode (line 126)
<div className="flex items-center justify-between text-sm">

// Durasi per Tanggal (line 134)
<div className="flex items-center justify-between text-sm">

// Platform (line 139)
<div className="flex items-center justify-between text-sm">

// Meeting Berulang (line 149)
<div className="flex items-center justify-between text-sm">

// Total Bayar - TETAP text-lg (line 220)
<div className="flex items-center justify-between text-lg">
```

---

## Ringkasan

| File | Aksi |
|------|------|
| `src/components/quick-order/PricingSummary.tsx` | Tambahkan `text-sm` pada semua row kecuali Total Bayar |

