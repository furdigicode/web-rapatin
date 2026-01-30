
# Rencana: Integrasi Kledo - Penerimaan Bank & Pencatatan Biaya

## Ringkasan

Mengintegrasikan sistem dengan Kledo untuk mencatat:
1. **Penerimaan Bank** (`/finance/bankTrans`) - Pencatatan dana masuk dari pembayaran
2. **Biaya/Expense** (`/finance/expenses`) - Pencatatan MDR payment gateway

Integrasi berjalan:
- **Otomatis**: Saat webhook Xendit menerima pembayaran sukses
- **Manual**: Admin dapat memicu sinkronisasi untuk order yang terlewat

---

## Perhitungan Biaya Payment Gateway

Semua perhitungan menggunakan **floor (truncate)**, bukan pembulatan:

| Metode | Fee | VAT | Rumus |
|--------|-----|-----|-------|
| QRIS | 0.63% | 11% dari fee | `floor(price * 0.0063) + floor(fee * 0.11)` |
| ShopeePay | 0.63% | 11% dari fee | Sama dengan QRIS |
| DANA | 1.5% | 11% dari fee | `floor(price * 0.015) + floor(fee * 0.11)` |
| OVO | 1.5% | 11% dari fee | Sama dengan DANA |
| Virtual Account | Flat | - | `4440` (semua bank) |

**Contoh Perhitungan:**
- QRIS Rp 25.000: fee = floor(25000 × 0.0063) = 157, VAT = floor(157 × 0.11) = 17 → **Total: 174**
- DANA Rp 50.000: fee = floor(50000 × 0.015) = 750, VAT = floor(750 × 0.11) = 82 → **Total: 832**
- VA Rp 50.000: **Total: 4.440** (flat)

---

## API Kledo

### 1. Autentikasi
```
POST https://rapatin.api.kledo.com/api/v1/authentication/singleLogin

Headers:
  Content-Type: application/json
  app-client: web
  X-App: finance

Body:
{
  "email": "{KLEDO_EMAIL}",
  "password": "{KLEDO_PASSWORD}",
  "remember_me": 1,
  "is_otp": 0,
  "apple_identity_token": null
}
```

### 2. Penerimaan Bank (Bank Transaction)
```
POST https://rapatin.api.kledo.com/api/v1/finance/bankTrans

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json
  app-client: web
  X-App: finance

Body:
{
  "trans_date": "2026-01-29",        // Dinamis: tanggal paid_at
  "trans_type_id": 12,                // Statis
  "bank_account_id": 1,               // Statis
  "contact_id": 36,                   // Statis
  "memo": "REpQTFH8lqzBZGykwZ4svJdL", // Dinamis: access_slug
  "items": [
    {
      "finance_account_id": 121,      // Statis: akun pendapatan
      "desc": "Quick Order",
      "amount": 50000                 // Dinamis: price order
    }
  ]
}
```

### 3. Pencatatan Biaya (Expense)
```
POST https://rapatin.api.kledo.com/api/v1/finance/expenses

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json
  app-client: web
  X-App: finance

Body:
{
  "trans_date": "2026-01-29",          // Dinamis: tanggal paid_at
  "pay_from_finance_account_id": 1,    // Statis
  "contact_id": 3,                     // Statis
  "status_id": 3,                      // Statis
  "memo": "REpQTFH8lqzBZGykwZ4svJdL",  // Dinamis: access_slug
  "items": [
    {
      "finance_account_id": 1459,      // Statis: akun beban MDR
      "desc": "Biaya QRIS",            // Dinamis: nama payment method
      "amount": 174                    // Dinamis: fee + VAT (truncated)
    }
  ]
}
```

---

## Konstanta Statis

```typescript
// Bank Transaction
const KLEDO_BANK_TRANS = {
  trans_type_id: 12,
  bank_account_id: 1,
  contact_id: 36,
  finance_account_id: 121,  // Akun pendapatan
};

// Expense
const KLEDO_EXPENSE = {
  pay_from_finance_account_id: 1,
  contact_id: 3,
  status_id: 3,
  finance_account_id: 1459,  // Akun beban MDR
};

// Fee Rates
const PAYMENT_FEES = {
  QRIS: { rate: 0.0063, vatRate: 0.11, type: 'percentage' },
  SHOPEEPAY: { rate: 0.0063, vatRate: 0.11, type: 'percentage' },
  DANA: { rate: 0.015, vatRate: 0.11, type: 'percentage' },
  OVO: { rate: 0.015, vatRate: 0.11, type: 'percentage' },
  VIRTUAL_ACCOUNT: { amount: 4440, type: 'flat' },
};
```

---

## Database Changes

Menambahkan kolom tracking di tabel `guest_orders`:

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| `kledo_invoice_id` | text | ID transaksi bank di Kledo |
| `kledo_synced_at` | timestamptz | Waktu sinkronisasi berhasil |
| `kledo_sync_error` | text | Pesan error jika gagal |

---

## Arsitektur

```text
┌─────────────────┐
│ Xendit Webhook  │
│ (payment.capture│
│  + completed)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌─────────────────┐
│ xendit-webhook  │─────►│   kledo-sync    │
│ (existing)      │      │ (new function)  │
└────────┬────────┘      └────────┬────────┘
         │                        │
         │                        ▼
         │               ┌─────────────────┐
         │               │   Kledo API     │
         │               │ 1. Login        │
         │               │ 2. Bank Trans   │
         │               │ 3. Expense      │
         │               └────────┬────────┘
         │                        │
         ▼                        ▼
┌─────────────────────────────────────────┐
│              guest_orders               │
│  kledo_invoice_id | kledo_synced_at     │
└─────────────────────────────────────────┘
```

---

## Alur Sinkronisasi

### Otomatis (Webhook)
```text
1. Xendit → payment_session.completed (status: paid)
2. Update order + Create Rapatin meeting (existing)
3. Panggil kledo-sync edge function
4. Login ke Kledo API
5. POST /finance/bankTrans (penerimaan)
6. POST /finance/expenses (biaya MDR)
7. Update guest_orders dengan kledo_invoice_id
```

### Manual (Admin)
```text
1. Admin buka detail order yang belum sync
2. Klik tombol "Sync ke Kledo"
3. Panggil kledo-sync edge function
4. Proses sama seperti otomatis
```

---

## Logika Perhitungan Fee

```typescript
function calculatePaymentFee(price: number, paymentMethod: string): number {
  // Normalize payment method
  const method = paymentMethod.toUpperCase();
  
  // Virtual Account - semua flat 4440
  if (method.includes('VA') || method.includes('VIRTUAL_ACCOUNT') || 
      method.includes('MANDIRI') || method.includes('BCA') || 
      method.includes('BNI') || method.includes('BRI') ||
      method.includes('PERMATA') || method.includes('CIMB')) {
    return 4440;
  }
  
  // QRIS atau ShopeePay - 0.63% + VAT 11%
  if (method.includes('QRIS') || method.includes('SHOPEEPAY')) {
    const fee = Math.floor(price * 0.0063);
    const vat = Math.floor(fee * 0.11);
    return fee + vat;
  }
  
  // DANA atau OVO - 1.5% + VAT 11%
  if (method.includes('DANA') || method.includes('OVO')) {
    const fee = Math.floor(price * 0.015);
    const vat = Math.floor(fee * 0.11);
    return fee + vat;
  }
  
  // Default: treat as QRIS rate
  const fee = Math.floor(price * 0.0063);
  const vat = Math.floor(fee * 0.11);
  return fee + vat;
}
```

---

## File yang Akan Dibuat/Diubah

| File | Aksi | Deskripsi |
|------|------|-----------|
| `supabase/functions/kledo-sync/index.ts` | **Baru** | Edge function untuk integrasi Kledo |
| `supabase/functions/xendit-webhook/index.ts` | Ubah | Panggil kledo-sync setelah payment sukses |
| `supabase/config.toml` | Ubah | Tambah konfigurasi kledo-sync |
| `src/components/admin/OrderDetailDialog.tsx` | Ubah | Tambah section status Kledo + tombol sync |
| `src/types/OrderTypes.ts` | Ubah | Tambah field kledo_* |
| Database migration | **Baru** | Tambah kolom kledo_invoice_id, kledo_synced_at, kledo_sync_error |

---

## Secrets yang Dibutuhkan

| Secret | Deskripsi |
|--------|-----------|
| `KLEDO_EMAIL` | Email login Kledo (rapatinapp@gmail.com) |
| `KLEDO_PASSWORD` | Password login Kledo |

---

## UI Admin - Section Kledo

**Jika sudah sync:**
```
┌─────────────────────────────────────────┐
│ 📊 Sinkronisasi Kledo                   │
├─────────────────────────────────────────┤
│ Status      ✓ Tersinkronisasi           │
│ ID Transaksi  12345                  📋 │
│ Waktu Sync    29 Jan 2026, 10:30        │
└─────────────────────────────────────────┘
```

**Jika belum sync atau error:**
```
┌─────────────────────────────────────────┐
│ 📊 Sinkronisasi Kledo                   │
├─────────────────────────────────────────┤
│ Status      ⚠ Belum Tersinkronisasi     │
│ Error       Connection timeout          │
│                                         │
│ [🔄 Sync ke Kledo]                      │
└─────────────────────────────────────────┘
```

---

## Handling Error & Idempotency

1. **Idempotency**: Cek `kledo_invoice_id` sebelum sync - jika sudah ada, skip
2. **Error Handling**: Simpan error message ke `kledo_sync_error` untuk debugging
3. **Retry**: Admin dapat retry manual via tombol di UI
4. **Logging**: Detailed logs di edge function untuk debugging

---

## Catatan Teknis

1. **Format Tanggal**: Kledo menggunakan format `YYYY-MM-DD`
2. **Tidak Ada Desimal**: Semua amount harus integer (gunakan Math.floor)
3. **Payment Method Detection**: Menggunakan pattern matching dari field `payment_method`
4. **Token Caching**: Token Kledo valid ~30 hari, bisa di-cache jika perlu optimasi
