

# Rencana: Update Identifikasi Kledo dengan ref_number dan order_number

## Ringkasan Perubahan

1. **Menyimpan `ref_number`** dari response Kledo bank transaction (format: `BANK/00XXX`) sebagai ID transaksi di database
2. **Menggunakan `order_number`** (INV-YYMMDD-XXXX) sebagai memo, bukan `access_slug`

---

## Perubahan Detail

### 1. Kolom Database

**Perubahan nama kolom** untuk clarity:

| Sebelum | Sesudah | Deskripsi |
|---------|---------|-----------|
| `kledo_invoice_id` | `kledo_ref_number` | Menyimpan ref_number dari Kledo (BANK/00XXX) |

Atau bisa tetap menggunakan `kledo_invoice_id` tapi isinya diganti ke `ref_number` dari response Kledo.

### 2. Edge Function `kledo-sync/index.ts`

**Perubahan pada memo:**

```typescript
// SEBELUM
const memo = order.access_slug || orderId;

// SESUDAH
const memo = order.order_number || order.access_slug || orderId;
```

**Perubahan pada penyimpanan ID:**

```typescript
// SEBELUM - menyimpan result.data.id
if (result.data?.id) {
  return { success: true, id: result.data.id.toString() };
}

// SESUDAH - menyimpan result.data.ref_number
if (result.data?.ref_number) {
  return { success: true, refNumber: result.data.ref_number };
}
```

---

## Arsitektur

```text
┌─────────────────────────────────────────────────────────────────┐
│                       kledo-sync                                │
├─────────────────────────────────────────────────────────────────┤
│  Order Data:                                                    │
│  - order_number: INV-260130-0001                                │
│  - price: 150000                                                │
│  - payment_method: QRIS                                         │
│                                                                 │
│  Kledo Bank Transaction:                                        │
│  - memo: "INV-260130-0001" ← dari order_number                  │
│  - amount: 150000                                               │
│  - Response → ref_number: "BANK/00902"                          │
│                                                                 │
│  Kledo Expense:                                                 │
│  - memo: "INV-260130-0001" ← dari order_number                  │
│  - amount: 1049 (MDR fee)                                       │
│                                                                 │
│  Simpan ke DB:                                                  │
│  - kledo_invoice_id: "BANK/00902" ← dari ref_number             │
└─────────────────────────────────────────────────────────────────┘
```

---

## File yang Diubah

| File | Aksi | Deskripsi |
|------|------|-----------|
| `supabase/functions/kledo-sync/index.ts` | Ubah | Gunakan order_number untuk memo, simpan ref_number |

---

## Kode Perubahan

### `createBankTransaction` function

```typescript
async function createBankTransaction(
  token: string,
  transDate: string,
  memo: string,
  amount: number
): Promise<{ success: boolean; refNumber?: string; error?: string }> {
  // ... existing code ...
  
  const result = await response.json();
  
  if (!response.ok) {
    return { success: false, error: result.message || `HTTP ${response.status}` };
  }

  // Simpan ref_number bukan id
  if (result.data?.ref_number) {
    return { success: true, refNumber: result.data.ref_number };
  }

  // Fallback ke id jika ref_number tidak ada
  if (result.data?.id) {
    return { success: true, refNumber: `BANK/${result.data.id}` };
  }

  return { success: false, error: 'No ref_number in response' };
}
```

### Main flow

```typescript
// Prepare data - gunakan order_number untuk memo
const transDate = formatDateForKledo(order.paid_at || order.created_at);
const memo = order.order_number || order.access_slug || orderId;
const amount = order.price;

// ... create transactions ...

// Update order dengan ref_number
await supabase
  .from('guest_orders')
  .update({ 
    kledo_invoice_id: bankTransResult.refNumber, // BANK/00XXX
    kledo_synced_at: new Date().toISOString(),
    kledo_sync_error: null
  })
  .eq('id', orderId);
```

---

## Contoh Data

| Field | Sebelum | Sesudah |
|-------|---------|---------|
| Memo (Bank Trans) | `abc123xyz456...` (slug) | `INV-260130-0001` |
| Memo (Expense) | `abc123xyz456...` (slug) | `INV-260130-0001` |
| kledo_invoice_id | `12345` (ID) | `BANK/00902` (ref_number) |

---

## Keuntungan

1. **Konsistensi**: Memo menggunakan nomor order yang sama dengan sistem internal
2. **Mudah tracking**: CS bisa langsung cari di Kledo dengan nomor order
3. **Format standar**: ref_number (BANK/00XXX) adalah format standar Kledo untuk bank transaction

