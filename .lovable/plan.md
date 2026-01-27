
# Rencana: Tangkap & Tampilkan Metode Pembayaran dari Webhook

## Analisis Webhook

### Perbandingan 2 Event Webhook

| Aspek | `payment_session.completed` | `payment.capture` |
|-------|---------------------------|-------------------|
| Payment Session ID | `data.payment_session_id` | ❌ Tidak ada |
| Status | `data.status` (COMPLETED) | `data.status` (SUCCEEDED) |
| Reference ID | ❌ Tidak ada | `data.reference_id` |
| **Metode Pembayaran** | ❌ Tidak ada | ✅ `data.channel_code` (QRIS) |
| **Provider** | ❌ Tidak ada | ✅ `data.payment_details.issuer_name` (DANA) |

### Kesimpulan
Event `payment.capture` mengandung informasi metode pembayaran yang lebih detail:
- `channel_code`: QRIS, BANK_TRANSFER, EWALLET, CARD, dll
- `payment_details.issuer_name`: DANA, OVO, GOPAY, BCA, BNI, dll

## File yang Diubah

1. `supabase/functions/xendit-webhook/index.ts` - Handle event `payment.capture`
2. `supabase/functions/check-order-status/index.ts` - Return `payment_method`
3. `src/pages/QuickOrderDetail.tsx` - Tampilkan metode pembayaran

## Detail Perubahan

### 1. Webhook Handler: Tangani `payment.capture`

Menambahkan handler untuk event `payment.capture`:

```typescript
// Detect event type
if (payload.event === 'payment.capture') {
  console.log("Processing payment.capture event");
  
  const { data } = payload;
  const referenceId = data.reference_id; // "RAPATIN-1769507023320-nbyrwg"
  
  // Build payment method string
  let paymentMethod = data.channel_code || 'Unknown';
  if (data.payment_details?.issuer_name) {
    paymentMethod = `${data.channel_code} (${data.payment_details.issuer_name})`;
  }
  
  // Find order by reference_id pattern in xendit_invoice_id or other identifier
  // Update payment_method field only (order already processed by payment_session.completed)
  
  const { error } = await supabase
    .from('guest_orders')
    .update({ payment_method: paymentMethod })
    .ilike('xendit_invoice_id', `%${referenceId.split('-')[1]}%`);
  
  return new Response(JSON.stringify({ success: true }), ...);
}
```

**Catatan**: Karena `payment.capture` tidak memiliki `payment_session_id`, kita perlu menggunakan `reference_id` yang sebelumnya kita generate saat membuat order (format: `RAPATIN-timestamp-random`).

#### Update Database Insert (create-guest-order)
Perlu menyimpan `reference_id` ke database agar bisa di-match saat webhook `payment.capture`:

```typescript
// Di create-guest-order
const sessionReferenceId = `RAPATIN-${Date.now()}-${Math.random().toString(36).substring(7)}`;

// Simpan ke database
xendit_reference_id: sessionReferenceId, // Perlu kolom baru
```

**Alternatif lebih sederhana**: Parse timestamp dari `reference_id` dan match dengan `created_at`.

### 2. Check Order Status: Return `payment_method`

Update query dan response di `check-order-status`:

```typescript
// Update select
.select('..., payment_method, ...')

// Update response
order: {
  // ... existing fields
  payment_method: order.payment_method,
}
```

### 3. Detail Order Page: Tampilkan Metode Pembayaran

Update interface `OrderDetails`:
```typescript
interface OrderDetails {
  // ... existing fields
  payment_method: string | null;
}
```

Tambah display di section "Riwayat" atau di bawah "Total Bayar":
```tsx
{order.payment_method && (
  <div className="flex justify-between">
    <span className="text-muted-foreground">Metode Pembayaran</span>
    <span className="font-medium">{order.payment_method}</span>
  </div>
)}
```

## Alternatif Strategi Matching Order

Karena `payment.capture` tidak memiliki `payment_session_id`, ada beberapa opsi:

### Opsi A: Tambah kolom `xendit_reference_id`
- Simpan `reference_id` saat create order
- Match webhook dengan kolom ini
- **Pro**: Paling reliable
- **Con**: Perlu migrasi database

### Opsi B: Match by timestamp (Sederhana)
- Parse timestamp dari `reference_id` (contoh: `RAPATIN-1769507023320-nbyrwg`)
- Match dengan `created_at` yang mendekati timestamp tersebut
- **Pro**: Tidak perlu migrasi
- **Con**: Kurang presisi jika ada banyak order bersamaan

### Opsi C: Skip payment.capture, gunakan data session
- Ignore `payment.capture` event
- Karena info payment method tidak critical untuk fungsionalitas
- **Pro**: Paling sederhana
- **Con**: Tidak bisa tampilkan metode pembayaran

### Rekomendasi: Opsi A (Tambah kolom reference_id)

## Urutan Implementasi

1. **Database**: Tambah kolom `xendit_reference_id` ke `guest_orders`
2. **create-guest-order**: Simpan `reference_id` ke kolom baru
3. **xendit-webhook**: Handle `payment.capture` event
4. **check-order-status**: Return `payment_method`
5. **QuickOrderDetail**: Tampilkan metode pembayaran

## Contoh Tampilan UI

```text
┌─────────────────────────────────────────┐
│ Riwayat                                 │
├─────────────────────────────────────────┤
│ Order dibuat      26 Jan 2026, 16:43    │
│ Pembayaran        26 Jan 2026, 16:50    │
│ Metode Pembayaran      QRIS (DANA)      │ ← Baru
└─────────────────────────────────────────┘
```

## Format Payment Method

Kombinasi `channel_code` + `issuer_name`:
- QRIS → `QRIS (DANA)`, `QRIS (OVO)`, `QRIS (GoPay)`
- EWALLET → `EWALLET (OVO)`, `EWALLET (DANA)`
- BANK_TRANSFER → `VA (BCA)`, `VA (BNI)`, `VA (Mandiri)`
- CARD → `Card (Visa)`, `Card (Mastercard)`
