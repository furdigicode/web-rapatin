
# Rencana: Update Webhook Handler untuk Sessions API v3

## Masalah yang Ditemukan

Dari log, webhook menerima payload dengan benar tapi gagal memprosesnya:
```
ERROR Missing invoice id in webhook payload
```

### Perbedaan Struktur Payload

| Aspek | Invoice API v2 (Lama) | Sessions API v3 (Baru) |
|-------|----------------------|------------------------|
| Event Type | Tidak ada (implicit) | `payload.event` |
| ID | `payload.id` | `payload.data.payment_session_id` |
| Status | `payload.status` | `payload.data.status` |
| Timestamp | `payload.paid_at` | `payload.data.updated` |
| Reference | Tidak ada | `payload.data.reference_id` |

### Contoh Payload Sessions API v3

```json
{
  "event": "payment_session.completed",
  "data": {
    "payment_session_id": "ps-697885f20a1f5b668283874b",
    "reference_id": "RAPATIN-1769506290119-l1cd5f",
    "status": "COMPLETED",
    "updated": "2026-01-27T09:33:13.945Z"
  }
}
```

## File yang Diubah

### `supabase/functions/xendit-webhook/index.ts`

## Perubahan Utama

### 1. Deteksi Format Payload (v2 vs v3)

Menambahkan logika untuk mendeteksi apakah payload dari Invoice API atau Sessions API:

```typescript
// Detect if this is Sessions API v3 (has 'event' and 'data' fields)
const isSessionsApi = payload.event && payload.data;
```

### 2. Ekstrak Data Berdasarkan Format

**Untuk Sessions API v3:**
```typescript
if (isSessionsApi) {
  const { event, data } = payload;
  
  // Handle different session events
  if (event === 'payment_session.completed') {
    sessionId = data.payment_session_id;
    status = data.status; // COMPLETED
    paidAt = data.updated;
  } else if (event === 'payment_session.expired') {
    sessionId = data.payment_session_id;
    status = 'EXPIRED';
  }
}
```

**Fallback untuk Invoice API v2 (backward compatible):**
```typescript
else {
  // Legacy Invoice API format
  sessionId = payload.id;
  status = payload.status;
  paidAt = payload.paid_at;
}
```

### 3. Update Mapping Status

Sessions API v3 menggunakan status yang berbeda:

| Sessions API v3 | Mapping ke Database |
|-----------------|---------------------|
| `COMPLETED` | `paid` |
| `EXPIRED` | `expired` |
| `FAILED` | `failed` |
| Lainnya | `pending` |

```typescript
let paymentStatus = 'pending';
if (status === 'COMPLETED') {
  paymentStatus = 'paid';
} else if (status === 'EXPIRED') {
  paymentStatus = 'expired';
} else if (status === 'FAILED') {
  paymentStatus = 'failed';
}
```

### 4. Update Query Database

Karena kita menyimpan `payment_session_id` di kolom `xendit_invoice_id`:

```typescript
const { data: order, error: findError } = await supabase
  .from('guest_orders')
  .select('*')
  .eq('xendit_invoice_id', sessionId)
  .single();
```

### 5. Handle paid_at

Sessions API v3 tidak memiliki `paid_at` field, tapi ada `updated`:

```typescript
if (paymentStatus === 'paid') {
  updateData.paid_at = paidAt || new Date().toISOString();
}
```

## Alur Lengkap Setelah Update

```text
1. Xendit mengirim webhook dengan event "payment_session.completed"
   ↓
2. Webhook handler menerima dan log payload
   ↓
3. Deteksi: payload.event exists → Sessions API v3
   ↓
4. Ekstrak: payment_session_id, status, updated dari payload.data
   ↓
5. Query database: WHERE xendit_invoice_id = payment_session_id
   ↓
6. Update order status: payment_status = 'paid'
   ↓
7. Jika paid → Call Rapatin API untuk buat meeting
   ↓
8. Return success response
```

## Event Types yang Di-handle

| Event | Action |
|-------|--------|
| `payment_session.completed` | Update status ke `paid`, buat meeting Rapatin |
| `payment_session.expired` | Update status ke `expired` |
| `payment_session.failed` | Update status ke `failed` |

## Backward Compatibility

Handler tetap mendukung format Invoice API v2 jika masih ada webhook lama yang terkirim. Ini dilakukan dengan pengecekan keberadaan field `event`:

```typescript
if (payload.event && payload.data) {
  // Sessions API v3
} else {
  // Invoice API v2 (legacy)
}
```

## Urutan Implementasi

1. Update parsing payload untuk detect Sessions API v3
2. Ekstrak `payment_session_id` dan `status` dari `payload.data`
3. Update status mapping (COMPLETED → paid)
4. Keep backward compatibility untuk Invoice API v2
5. Deploy dan test dengan simulasi webhook

## Testing

Setelah deploy, simulasi pembayaran lagi untuk memastikan:
- Webhook diterima dan diproses dengan benar
- Order status terupdate ke `paid`
- Meeting Rapatin berhasil dibuat
- Zoom link tersimpan di database
