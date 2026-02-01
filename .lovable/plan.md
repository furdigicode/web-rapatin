

# Rencana: Perbaiki Titik Timeline yang Oval

## Masalah

Beberapa titik (dot) pada timeline "Riwayat" terlihat oval (lonjong) padahal seharusnya lingkaran sempurna. Ini terjadi karena flex container dengan `h-full` pada connector line menyebabkan dot ter-stretch secara vertikal.

---

## Penyebab

Struktur saat ini:
```tsx
<div className="flex flex-col items-center">
  <div className="w-3 h-3 bg-green-500 rounded-full" />  <!-- Bisa terstretch -->
  <div className="w-0.5 h-full bg-border min-h-[40px]" />
</div>
```

Ketika menggunakan flexbox dengan `flex-col`, elemen anak bisa terpengaruh oleh sizing dari sibling-nya. Dot yang seharusnya `w-3 h-3` (12x12 pixels) bisa ter-stretch karena flex behavior.

---

## Solusi

Tambahkan class `shrink-0` pada setiap elemen dot agar tidak terkompresi atau terstretch oleh flex container:

```tsx
<div className="w-3 h-3 bg-green-500 rounded-full shrink-0" />
```

---

## File yang Diubah

| File | Perubahan |
|------|-----------|
| `src/pages/QuickOrderDetail.tsx` | Tambah `shrink-0` pada 5 elemen dot timeline |

---

## Detail Perubahan

### Line ~1142 - Order dibuat
```tsx
// Sebelum
<div className="w-3 h-3 bg-primary rounded-full" />

// Sesudah
<div className="w-3 h-3 bg-primary rounded-full shrink-0" />
```

### Line ~1154 - Pembayaran diterima
```tsx
// Sebelum
<div className="w-3 h-3 bg-green-500 rounded-full" />

// Sesudah
<div className="w-3 h-3 bg-green-500 rounded-full shrink-0" />
```

### Line ~1166-1173 - Zoom meeting dibuat
```tsx
// Sebelum
<div className={`w-3 h-3 rounded-full ${...}`} />

// Sesudah
<div className={`w-3 h-3 rounded-full shrink-0 ${...}`} />
```

### Line ~1207 - Email terkirim
```tsx
// Sebelum
<div className="w-3 h-3 bg-blue-500 rounded-full" />

// Sesudah
<div className="w-3 h-3 bg-blue-500 rounded-full shrink-0" />
```

### Line ~1224 - WhatsApp terkirim
```tsx
// Sebelum
<div className="w-3 h-3 bg-green-500 rounded-full" />

// Sesudah
<div className="w-3 h-3 bg-green-500 rounded-full shrink-0" />
```

---

## Hasil yang Diharapkan

Semua titik timeline akan tampil sebagai lingkaran sempurna (12x12 pixels) tanpa terpengaruh oleh height dari connector line.

