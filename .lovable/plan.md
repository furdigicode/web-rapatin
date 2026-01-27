
# Rencana: Format Payment Method ke Title Case

## Ringkasan

Membuat helper function untuk mengubah format payment method dari `SNAKE_CASE_UPPERCASE` (contoh: `MANDIRI_VIRTUAL_ACCOUNT`) menjadi `Title Case` yang rapi (contoh: `Mandiri Virtual Account`).

## File yang Diubah

1. `src/pages/QuickOrderDetail.tsx`
2. `src/components/admin/OrderDetailDialog.tsx`

---

## Detail Perubahan

### 1. Tambah Helper Function

Lokasi: `src/pages/QuickOrderDetail.tsx` (di area helper functions, sekitar line 55-96)

```typescript
// Format payment method dari SNAKE_CASE ke Title Case
// Contoh: "MANDIRI_VIRTUAL_ACCOUNT" -> "Mandiri Virtual Account"
const formatPaymentMethod = (method: string): string => {
  return method
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
```

### 2. Update Tampilan di QuickOrderDetail.tsx

**Lokasi**: Line 493-497

**Sebelum:**
```tsx
{order.payment_method && (
  <p className="text-sm text-muted-foreground mt-1">
    via <span className="font-medium text-foreground">{order.payment_method}</span>
  </p>
)}
```

**Sesudah:**
```tsx
{order.payment_method && (
  <p className="text-sm text-muted-foreground mt-1">
    via <span className="font-medium text-foreground">{formatPaymentMethod(order.payment_method)}</span>
  </p>
)}
```

### 3. Update Tampilan di OrderDetailDialog.tsx (Admin)

**Lokasi**: Line 263-268

Tambah helper function yang sama di file admin dialog:

```typescript
// Format payment method dari SNAKE_CASE ke Title Case
const formatPaymentMethod = (method: string): string => {
  return method
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
```

**Sebelum:**
```tsx
{order.payment_method && (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">Metode</span>
    <span>{order.payment_method}</span>
  </div>
)}
```

**Sesudah:**
```tsx
{order.payment_method && (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">Metode</span>
    <span>{formatPaymentMethod(order.payment_method)}</span>
  </div>
)}
```

---

## Contoh Transformasi

| Sebelum (Raw) | Sesudah (Formatted) |
|---------------|---------------------|
| `MANDIRI_VIRTUAL_ACCOUNT` | `Mandiri Virtual Account` |
| `BCA_VIRTUAL_ACCOUNT` | `Bca Virtual Account` |
| `QRIS` | `Qris` |
| `EWALLET_DANA` | `Ewallet Dana` |
| `CREDIT_CARD` | `Credit Card` |

---

## Catatan Teknis

- Helper function `formatPaymentMethod` akan:
  1. Mengubah ke lowercase
  2. Split berdasarkan underscore (`_`)
  3. Capitalize huruf pertama setiap kata
  4. Join kembali dengan spasi

- Function ini diterapkan di 2 lokasi:
  - Halaman detail order untuk customer (`QuickOrderDetail.tsx`)
  - Dialog detail order untuk admin (`OrderDetailDialog.tsx`)
