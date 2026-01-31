

# Rencana: Update Trust Signals di Bawah Total Bayar

## Ringkasan

Mengganti informasi di bawah "Total Bayar" dengan poin-poin yang lebih meyakinkan untuk pembayaran, karena informasi tentang pengiriman link Zoom sudah dipindahkan ke FAQ.

---

## Trust Signals yang Diusulkan

| No | Trust Signal | Ikon | Alasan |
|----|-------------|------|--------|
| 1 | **Pembayaran 100% Aman** | Shield | Kepercayaan keamanan transaksi |
| 2 | **Proses Instan** | Zap | Langsung dapat akses tanpa menunggu |
| 3 | **Tanpa Biaya Tersembunyi** | BadgeCheck | Harga yang ditampilkan adalah final |
| 4 | **7.000+ Meeting Terselenggara** | Users | Social proof - banyak yang sudah pakai |

---

## Perubahan Detail

**File:** `src/components/quick-order/PricingSummary.tsx`

### Sebelum (baris 226-232):
```tsx
<div className="mt-4 flex items-start gap-2 p-3 bg-background/50 rounded-lg">
  <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
  <p className="text-xs text-muted-foreground">
    Pembayaran aman dan terenkripsi. Link Zoom juga akan dikirim ke email dan WhatsApp (opsional) setelah
    pembayaran berhasil.
  </p>
</div>
```

### Sesudah:
```tsx
{/* Trust Signals */}
<div className="mt-4 grid grid-cols-2 gap-2">
  <div className="flex items-center gap-2 p-2 bg-background/50 rounded-lg">
    <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
    <span className="text-xs text-muted-foreground">Pembayaran 100% Aman</span>
  </div>
  <div className="flex items-center gap-2 p-2 bg-background/50 rounded-lg">
    <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
    <span className="text-xs text-muted-foreground">Proses Instan</span>
  </div>
  <div className="flex items-center gap-2 p-2 bg-background/50 rounded-lg">
    <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
    <span className="text-xs text-muted-foreground">Tanpa Biaya Tersembunyi</span>
  </div>
  <div className="flex items-center gap-2 p-2 bg-background/50 rounded-lg">
    <Users className="w-4 h-4 text-primary flex-shrink-0" />
    <span className="text-xs text-muted-foreground">7.000+ Meeting</span>
  </div>
</div>
```

---

## Preview Tampilan

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Biaya Payment Gateway        GRATIS               │
│                                                     │
│  Total Bayar                  Rp10.000             │
│                                                     │
│  ┌─────────────────┐  ┌─────────────────┐          │
│  │ 🛡️ Pembayaran   │  │ ⚡ Proses       │          │
│  │    100% Aman    │  │    Instan       │          │
│  └─────────────────┘  └─────────────────┘          │
│                                                     │
│  ┌─────────────────┐  ┌─────────────────┐          │
│  │ ✓ Tanpa Biaya   │  │ 👥 7.000+       │          │
│  │   Tersembunyi   │  │    Meeting      │          │
│  └─────────────────┘  └─────────────────┘          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Detail Teknis

### Import Tambahan
```tsx
import { Zap, BadgeCheck } from "lucide-react";
```

### Ringkasan Perubahan

| File | Baris | Aksi |
|------|-------|------|
| `src/components/quick-order/PricingSummary.tsx` | 1 | Tambah import `Zap`, `BadgeCheck` |
| `src/components/quick-order/PricingSummary.tsx` | 226-232 | Ganti dengan grid 2x2 trust signals |

---

## Catatan

- **"7.000+ Meeting"** adalah angka estimasi. Jika ada data aktual dari database, bisa diganti dengan angka real.
- Layout menggunakan `grid grid-cols-2` agar 4 poin tersusun rapi dalam 2 kolom.
- Setiap ikon memiliki warna berbeda untuk variasi visual.

