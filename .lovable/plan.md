
# Rencana: Update Harga Pricing Section & Quick Order

## Ringkasan Perubahan

1. **Harga Via Aplikasi** = harga yang ditampilkan saat ini di screenshot
2. **Harga Quick Order** = Harga Aplikasi + Rp 5.000
3. **Harga Coret** = 2x Harga Aplikasi (diskon 50%)
4. **Tampilkan dua harga** dalam satu card pricing
5. **Tombol "Daftar Sekarang"** memunculkan OrderOptionModal

---

## Tabel Harga Baru

| Peserta | Via Aplikasi | Quick Order (+5rb) | Harga Coret (2x App) |
|---------|--------------|--------------------|-----------------------|
| 100     | Rp 20.000    | Rp 25.000          | Rp 40.000             |
| 300     | Rp 40.000    | Rp 45.000          | Rp 80.000             |
| 500     | Rp 70.000    | Rp 75.000          | Rp 140.000            |
| 1000    | Rp 130.000   | Rp 135.000         | Rp 260.000            |

---

## File yang Diubah

### 1. `src/components/PricingSection.tsx`

**Update data plans:**
```typescript
const plans = [
  { 
    participants: "100 Peserta", 
    originalPrice: 40000,    // Harga coret (2x appPrice)
    appPrice: 20000,         // Harga Via Aplikasi
    quickOrderPrice: 25000,  // Harga Quick Order (+5rb)
    popular: true 
  },
  { 
    participants: "300 Peserta", 
    originalPrice: 80000, 
    appPrice: 40000, 
    quickOrderPrice: 45000 
  },
  { 
    participants: "500 Peserta", 
    originalPrice: 140000, 
    appPrice: 70000, 
    quickOrderPrice: 75000 
  },
  { 
    participants: "1000 Peserta", 
    originalPrice: 260000, 
    appPrice: 130000, 
    quickOrderPrice: 135000 
  }
];
```

**Ganti import FreeTrialModal → OrderOptionModal:**
```typescript
import OrderOptionModal from '@/components/ui/order-option-modal';
```

**Update handler untuk selalu buka modal:**
```typescript
const handleRegistration = () => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'CTAClick');
  }
  setModalOpen(true);  // Selalu buka modal
};
```

**Update tampilan harga card (dua baris):**
```tsx
<div className="text-right">
  {/* Harga coret */}
  <p className="text-xs text-muted-foreground line-through mb-1">
    {formatRupiah(plan.originalPrice)}
  </p>
  
  {/* Dua harga */}
  <div className="space-y-0.5">
    <div className="flex items-center justify-end gap-2">
      <span className="text-xs text-muted-foreground">Via Aplikasi</span>
      <span className="font-bold text-sm text-green-600">
        {formatRupiah(plan.appPrice)}
      </span>
    </div>
    <div className="flex items-center justify-end gap-2">
      <span className="text-xs text-muted-foreground">Quick Order</span>
      <span className="font-bold text-sm text-orange-500">
        {formatRupiah(plan.quickOrderPrice)}
      </span>
    </div>
  </div>
</div>
```

**Ganti FreeTrialModal → OrderOptionModal di render:**
```tsx
<OrderOptionModal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
/>
```

---

### 2. `src/components/quick-order/PackageSelector.tsx`

**Update harga untuk Quick Order:**
```typescript
const packages: Package[] = [
  { participants: 100, promoPrice: 25000, normalPrice: 40000 },   // QO: 25rb
  { participants: 300, promoPrice: 45000, normalPrice: 80000 },   // QO: 45rb
  { participants: 500, promoPrice: 75000, normalPrice: 140000 },  // QO: 75rb
  { participants: 1000, promoPrice: 135000, normalPrice: 260000 },// QO: 135rb
];
```

---

## Visual Preview Card Harga

```text
┌──────────────────────────────────────────────────────────────┐
│ 100 Peserta                              [Best Seller]       │
│ /rapat/tanggal                                               │
│                                                              │
│                                      ̶R̶p̶ ̶4̶0̶.̶0̶0̶0̶  (coret)      │
│                                                              │
│                      Via Aplikasi    Rp 20.000  (hijau)      │
│                      Quick Order     Rp 25.000  (orange)     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ 300 Peserta                                                  │
│ /rapat/tanggal                                               │
│                                                              │
│                                      ̶R̶p̶ ̶8̶0̶.̶0̶0̶0̶  (coret)      │
│                                                              │
│                      Via Aplikasi    Rp 40.000  (hijau)      │
│                      Quick Order     Rp 45.000  (orange)     │
└──────────────────────────────────────────────────────────────┘
```

---

## Ringkasan

| File | Perubahan |
|------|-----------|
| `src/components/PricingSection.tsx` | Update data harga, tampilan 2 harga, ganti ke OrderOptionModal |
| `src/components/quick-order/PackageSelector.tsx` | Update promoPrice (+5rb) dan normalPrice (2x app price) |

---

## Hasil yang Diharapkan

1. Card harga menampilkan **dua harga** sekaligus (Via Aplikasi & Quick Order)
2. Harga Via Aplikasi lebih murah Rp 5.000 → **insentif daftar aplikasi**
3. Harga coret menunjukkan **diskon 50%** dari harga aplikasi
4. Tombol "Daftar Sekarang" memunculkan **OrderOptionModal** untuk memilih metode order
