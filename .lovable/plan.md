

# Rencana: Nomor Order dengan Format INV-YYMMDD-XXXX

## Ringkasan

Menambahkan kolom `order_number` pada tabel `guest_orders` dengan format **INV-[YYMMDD]-[4 digit sequence]**.

**Contoh**: 
- `INV-260130-0001` (Order pertama tanggal 30 Jan 2026)
- `INV-260130-0002` (Order kedua tanggal yang sama)
- `INV-260131-0001` (Order pertama tanggal 31 Jan 2026)

---

## Arsitektur

```text
┌─────────────────────────────────────────────────────────────────┐
│                    create-guest-order                           │
├─────────────────────────────────────────────────────────────────┤
│  1. Terima data order                                           │
│     ↓                                                           │
│  2. Generate order_number:                                      │
│     - Query max sequence untuk tanggal ini                      │
│     - Format: INV-YYMMDD-XXXX                                   │
│     ↓                                                           │
│  3. Simpan order dengan order_number                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Changes

### Kolom Baru: `order_number`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| `order_number` | text | Nomor order dengan format INV-YYMMDD-XXXX |

### Constraint

- **UNIQUE**: Mencegah duplikasi nomor order
- **NOT NULL** (untuk order baru)

### Migration SQL

```sql
-- Tambah kolom order_number
ALTER TABLE public.guest_orders 
ADD COLUMN order_number TEXT UNIQUE;

-- Create function untuk generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  date_part TEXT;
  max_seq INTEGER;
  new_seq INTEGER;
BEGIN
  -- Format: YYMMDD
  date_part := TO_CHAR(NOW(), 'YYMMDD');
  
  -- Cari sequence tertinggi untuk tanggal ini
  SELECT COALESCE(MAX(
    CAST(RIGHT(order_number, 4) AS INTEGER)
  ), 0) INTO max_seq
  FROM public.guest_orders
  WHERE order_number LIKE 'INV-' || date_part || '-%';
  
  new_seq := max_seq + 1;
  
  RETURN 'INV-' || date_part || '-' || LPAD(new_seq::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Index untuk performa query
CREATE INDEX idx_guest_orders_order_number 
ON public.guest_orders(order_number);
```

---

## Perubahan Edge Function

### `create-guest-order/index.ts`

```typescript
// Generate order number
const { data: orderNumberData, error: seqError } = await supabase
  .rpc('generate_order_number');

if (seqError) {
  console.error("Failed to generate order number:", seqError);
  // Fallback: gunakan timestamp-based
  const fallbackNumber = `INV-${new Date().toISOString().slice(2,10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`;
}

const orderData = {
  // ...existing fields
  order_number: orderNumberData || fallbackNumber,
};
```

---

## Perubahan UI

### 1. Admin Order Table (`OrderManagement.tsx`)

Menambahkan kolom "No. Order" di tabel:

| No. Order | Tanggal Order | Customer | ... |
|-----------|---------------|----------|-----|
| INV-260130-0001 | 30 Jan 2026 | John Doe | ... |

### 2. Order Detail Dialog (`OrderDetailDialog.tsx`)

Menampilkan nomor order di header:

```
Detail Order: INV-260130-0001
```

### 3. Customer Order Page (`QuickOrderDetail.tsx`)

Menampilkan nomor order setelah pembayaran sukses:

```
No. Order: INV-260130-0001
(dengan tombol copy)
```

### 4. Search

Menambahkan kemampuan search berdasarkan order number.

---

## File yang Diubah

| File | Aksi | Deskripsi |
|------|------|-----------|
| Database migration | Baru | Tambah kolom + function + index |
| `create-guest-order/index.ts` | Ubah | Generate order_number saat create |
| `check-order-status/index.ts` | Ubah | Return order_number di response |
| `src/types/OrderTypes.ts` | Ubah | Tambah field order_number |
| `src/pages/admin/OrderManagement.tsx` | Ubah | Tambah kolom + search |
| `src/components/admin/OrderDetailDialog.tsx` | Ubah | Tampilkan nomor order |
| `src/pages/QuickOrderDetail.tsx` | Ubah | Tampilkan nomor order |

---

## Handling Order Lama

Order yang sudah ada sebelum implementasi tidak akan memiliki `order_number`. UI akan menampilkan fallback:
- Admin: Tampilkan "-" atau ID singkat
- Customer: Tidak menampilkan jika null

---

## Flow Lengkap

```text
┌──────────────────────────────────────────────────────────────────┐
│                        Customer Order                             │
└─────────────────────────────┬────────────────────────────────────┘
                              ▼
              ┌──────────────────────────────┐
              │ create-guest-order dipanggil │
              └──────────────────┬───────────┘
                                 ▼
            ┌────────────────────────────────────┐
            │ SELECT MAX(sequence) WHERE         │
            │ order_number LIKE 'INV-260130-%'   │
            └────────────────────┬───────────────┘
                                 ▼
              ┌──────────────────────────────────┐
              │ max_seq = 0003                   │
              │ new_seq = 0004                   │
              │ order_number = INV-260130-0004   │
              └────────────────────┬─────────────┘
                                   ▼
              ┌──────────────────────────────────┐
              │ INSERT INTO guest_orders         │
              │ WITH order_number                │
              └────────────────────┬─────────────┘
                                   ▼
              ┌──────────────────────────────────┐
              │ Return order_number ke frontend  │
              └──────────────────────────────────┘
```

---

## Keuntungan Format INV-YYMMDD-XXXX

1. **Mudah dibaca**: Customer dan CS langsung tahu tanggal order
2. **Unik per hari**: 4 digit = max 9999 order/hari (sangat cukup)
3. **Sortable**: Bisa diurutkan berdasarkan tanggal
4. **Compact**: Hanya 15 karakter

