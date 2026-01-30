
# Rencana: Perbaikan Format Payment Method

## Ringkasan Perubahan

Menyederhanakan tampilan metode pembayaran agar hanya menampilkan **nama utama** tanpa detail channel/issuer dalam kurung.

| Sebelum | Sesudah |
|---------|---------|
| Qris (Dana) | QRIS |
| Qris (Ovo) | QRIS |
| Va (Bca) | BCA Virtual Account |
| Mandiri Virtual Account | Mandiri Virtual Account |
| Dana | DANA |
| Shopeepay | ShopeePay |

---

## Logika Perubahan

Fungsi `formatPaymentMethod` akan diubah untuk:

1. **Mendeteksi dan menyederhanakan format** - Jika ada kurung `()`, ambil hanya bagian di luar kurung
2. **Normalisasi nama payment method** - Menggunakan mapping untuk tampilan yang konsisten:
   - `QRIS*` → "QRIS"
   - `*VA*` atau `*VIRTUAL_ACCOUNT*` → "BankName Virtual Account"  
   - `DANA` → "DANA"
   - `OVO` → "OVO"
   - `SHOPEEPAY` → "ShopeePay"

---

## File yang Diubah

| File | Perubahan |
|------|-----------|
| `src/pages/QuickOrderDetail.tsx` | Update fungsi `formatPaymentMethod` |
| `src/components/admin/OrderDetailDialog.tsx` | Update fungsi `formatPaymentMethod` |

---

## Implementasi

Contoh fungsi baru:

```typescript
const formatPaymentMethod = (method: string): string => {
  if (!method) return 'Unknown';
  
  const upperMethod = method.toUpperCase();
  
  // Jika ada kurung, ambil bagian sebelum kurung saja
  const cleanMethod = upperMethod.split('(')[0].trim();
  
  // QRIS - tampilkan sebagai QRIS saja
  if (cleanMethod.includes('QRIS')) {
    return 'QRIS';
  }
  
  // ShopeePay
  if (cleanMethod.includes('SHOPEEPAY')) {
    return 'ShopeePay';
  }
  
  // E-Wallet
  if (cleanMethod.includes('DANA')) return 'DANA';
  if (cleanMethod.includes('OVO')) return 'OVO';
  
  // Virtual Account - format: "BankName Virtual Account"
  if (cleanMethod.includes('VA') || cleanMethod.includes('VIRTUAL_ACCOUNT')) {
    const banks = ['MANDIRI', 'BCA', 'BNI', 'BRI', 'PERMATA', 'CIMB', 'BSI', 'BJB'];
    for (const bank of banks) {
      if (cleanMethod.includes(bank)) {
        return `${bank} Virtual Account`;
      }
    }
    return 'Virtual Account';
  }
  
  // Default: title case
  return method
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
```

---

## Catatan: Tentang ID Transaksi Kledo

ID Transaksi **4986** adalah ID dari Bank Transaction yang dibuat di Kledo. Ini berasal dari response API Kledo saat edge function berhasil membuat penerimaan bank:

```
POST https://rapatin.api.kledo.com/api/v1/finance/bankTrans
Response: { "data": { "id": 4986 } }
```

ID ini adalah referensi unik di sistem Kledo. Anda bisa menggunakannya untuk:
- Mencari transaksi di dashboard Kledo
- Verifikasi bahwa transaksi sudah tercatat
