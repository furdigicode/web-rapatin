
# Rencana: Update Label dan Harga Package Selector

## Ringkasan Perubahan

1. **Ubah label** "Jumlah Peserta" → "Kapasitas Ruang Zoom"
2. **Hapus icon Users** dari setiap pilihan paket
3. **Update harga** sesuai permintaan baru:

| Kapasitas | Harga Normal (coret) | Harga Promo |
|-----------|---------------------|-------------|
| 100       | Rp40.000            | Rp20.000    |
| 300       | Rp100.000           | Rp45.000    |
| 500       | Rp180.000           | Rp75.000    |
| 1000      | Rp350.000           | Rp155.000   |

---

## Perubahan File

### 1. `src/components/quick-order/PackageSelector.tsx`

**Hapus import icon Users (baris 2):**
```typescript
// Sebelum
import { Users, Check } from "lucide-react";

// Sesudah
import { Check } from "lucide-react";
```

**Update data packages (baris 10-15):**
```typescript
// Sebelum
const packages: Package[] = [
  { participants: 100, promoPrice: 10000, normalPrice: 20000 },
  { participants: 300, promoPrice: 25000, normalPrice: 40000 },
  { participants: 500, promoPrice: 55000, normalPrice: 70000 },
  { participants: 1000, promoPrice: 100000, normalPrice: 130000 },
];

// Sesudah
const packages: Package[] = [
  { participants: 100, promoPrice: 20000, normalPrice: 40000 },
  { participants: 300, promoPrice: 45000, normalPrice: 100000 },
  { participants: 500, promoPrice: 75000, normalPrice: 180000 },
  { participants: 1000, promoPrice: 155000, normalPrice: 350000 },
];
```

**Hapus icon Users dari JSX (baris 61-64):**
```typescript
// Hapus baris ini:
<Users className={cn(
  "w-8 h-8 mb-2",
  isSelected ? "text-primary" : "text-muted-foreground"
)} />
```

---

### 2. `src/components/quick-order/QuickOrderForm.tsx`

**Update label FormField (baris 290):**
```typescript
// Sebelum
<FormLabel>Jumlah Peserta</FormLabel>

// Sesudah
<FormLabel>Kapasitas Ruang Zoom</FormLabel>
```

---

## Ringkasan Perubahan

| File | Baris | Perubahan |
|------|-------|-----------|
| PackageSelector.tsx | 2 | Hapus `Users` dari import |
| PackageSelector.tsx | 10-15 | Update harga packages |
| PackageSelector.tsx | 61-64 | Hapus element icon Users |
| QuickOrderForm.tsx | 290 | Ganti label "Jumlah Peserta" → "Kapasitas Ruang Zoom" |

---

## Hasil Visual

```text
Sebelum:
┌────────────────┐
│    👥 (icon)   │
│      100       │
│    Peserta     │
│   Rp 20.000    │ (coret)
│   Rp 10.000    │
└────────────────┘

Sesudah:
┌────────────────┐
│      100       │
│    Peserta     │
│   Rp 40.000    │ (coret)
│   Rp 20.000    │
└────────────────┘
```
