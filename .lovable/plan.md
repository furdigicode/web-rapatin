

# Rencana: Sticky Summary pada Desktop

## Analisis

Saat ini layout menggunakan grid 2 kolom pada desktop (`lg:grid-cols-2`):
- **Kolom Kiri**: Form (Data Pemesan + Detail Meeting)
- **Kolom Kanan**: PricingSummary + Button + PaymentMethods

User ingin kolom kanan tetap terlihat (sticky) saat scroll di desktop, sehingga ringkasan order selalu visible ketika mengisi form.

---

## Solusi

Menambahkan CSS `sticky` dan `top-*` pada wrapper kolom kanan, hanya aktif di layar desktop (`lg:`).

---

## Perubahan

**File:** `src/components/quick-order/QuickOrderForm.tsx`

### Sebelum (line 432-434)
```tsx
{/* Right Column - Summary */}
<div className="space-y-4">
  <PricingSummary
```

### Sesudah
```tsx
{/* Right Column - Summary (Sticky on Desktop) */}
<div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
  <PricingSummary
```

---

## Penjelasan CSS

| Class | Fungsi |
|-------|--------|
| `lg:sticky` | Membuat elemen sticky hanya di layar desktop (≥1024px) |
| `lg:top-24` | Jarak 6rem dari atas viewport (memberi ruang untuk navbar) |
| `lg:self-start` | Menjaga elemen tetap di posisi atas grid cell, tidak stretch |

---

## Visual Perubahan

```text
SEBELUM (Scroll ke bawah):
┌──────────────────┐  ┌──────────────────┐
│ Data Pemesan     │  │ (Tidak terlihat) │
│                  │  │                  │
│ Detail Meeting   │  │                  │
│ (visible)        │  │                  │
│                  │  │                  │
└──────────────────┘  └──────────────────┘

SESUDAH (Scroll ke bawah):
┌──────────────────┐  ┌──────────────────┐
│ Data Pemesan     │  │ Ringkasan Order  │ ← STICKY
│                  │  │ [Bayar Sekarang] │
│ Detail Meeting   │  │ Payment Methods  │
│ (visible)        │  │                  │
│                  │  │                  │
└──────────────────┘  └──────────────────┘
```

---

## Catatan

- **Mobile**: Tidak ada perubahan - kolom summary tetap di bawah form seperti biasa
- **Desktop**: Summary akan "mengikuti" scroll hingga user selesai mengisi form
- `top-24` (6rem ≈ 96px) memberikan jarak yang cukup untuk navbar

