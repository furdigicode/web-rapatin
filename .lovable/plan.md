
# Rencana: Fix Field Mapping untuk Xendit Sessions API Response

## Masalah yang Ditemukan

Dari response Xendit Sessions API yang Anda berikan:
```json
{
  "payment_session_id": "ps-6978810524bd52c791bb51fe",
  "payment_link_url": "https://xen.to/ER9eZwcQ",
  "expires_at": "2026-01-27T09:40:29.305Z"
}
```

**Root Cause**: Kode saat ini menggunakan `xenditSession.id` yang **tidak ada** di response. Field yang benar adalah `payment_session_id`.

## Perbandingan Field

| Field yang Digunakan (Salah) | Field yang Benar |
|------------------------------|------------------|
| `xenditSession.id` | `xenditSession.payment_session_id` |
| `xenditSession.expires_at` | `xenditSession.expires_at` ✓ (sudah benar) |
| `xenditSession.payment_link_url` | `xenditSession.payment_link_url` ✓ (sudah benar) |

## File yang Diubah

### `supabase/functions/create-guest-order/index.ts`

## Perubahan Kode

### 1. Tambah Logging Response Lengkap (Line ~135)

```typescript
const xenditSession = await xenditResponse.json();
console.log("Xendit full response:", JSON.stringify(xenditSession));
```

### 2. Fix Session ID Extraction (Line ~136-145)

**Sebelum:**
```typescript
console.log("Xendit session created:", xenditSession.id, "URL:", xenditSession.payment_link_url);
```

**Sesudah:**
```typescript
// Xendit Sessions API returns payment_session_id, not id
const sessionId = xenditSession.payment_session_id;

if (!sessionId) {
  console.error("No payment_session_id in Xendit response:", xenditSession);
  return new Response(JSON.stringify({ error: "Invalid payment session response" }), {
    status: 500,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

console.log("Xendit session created:", sessionId, "URL:", xenditSession.payment_link_url);
```

### 3. Update Database Insert (Line ~160)

**Sebelum:**
```typescript
xendit_invoice_id: xenditSession.id,
```

**Sesudah:**
```typescript
xendit_invoice_id: sessionId,
```

### 4. Update Response (Line ~185)

**Sebelum:**
```typescript
session_id: xenditSession.id,
```

**Sesudah:**
```typescript
session_id: sessionId,
```

## Ringkasan Perubahan

| Lokasi | Perubahan |
|--------|-----------|
| Line ~135 | Tambah full response logging |
| Line ~136-145 | Extract `payment_session_id` dengan validasi |
| Line ~160 | Gunakan `sessionId` untuk database insert |
| Line ~185 | Gunakan `sessionId` untuk response |

## Alur Setelah Fix

```text
1. User submit Quick Order form
   ↓
2. create-guest-order calls Xendit Sessions API
   ↓
3. Response: { payment_session_id: "ps-xxx", payment_link_url: "..." }
   ↓
4. Extract: sessionId = response.payment_session_id ✓
   ↓
5. Save to DB: guest_orders.xendit_invoice_id = "ps-xxx" ✓
   ↓
6. Webhook receives: data.payment_session_id = "ps-xxx"
   ↓
7. Query: WHERE xendit_invoice_id = "ps-xxx" → MATCH! ✓
   ↓
8. Update order status to 'paid', create Rapatin meeting
```

## Testing Setelah Deploy

1. Buat Quick Order baru
2. Cek log: pastikan `payment_session_id` ter-log dengan benar
3. Cek database: pastikan `xendit_invoice_id` tidak null
4. Lakukan pembayaran test
5. Verifikasi webhook berhasil update status order
