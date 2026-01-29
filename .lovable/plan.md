

# Rencana: Tambah Info Xendit di Detail Order & Handle Webhook Expiry

## Ringkasan

1. Menambahkan informasi Reference ID dan Payment Session ID di dialog detail order admin
2. Memperbaiki webhook handler untuk menangani event `payment_request.expiry` dari Xendit

---

## Analisis Masalah Webhook

Dari log webhook yang diterima:
```json
{
  "event": "payment_request.expiry",
  "data": {
    "reference_id": "test-1769502616",
    "payment_request_id": "pr-3165c617-70c2-41de-87c5-3433277604b5",
    "status": "EXPIRED"
    // TIDAK ADA: payment_session_id
  }
}
```

Handler saat ini mencari `data.payment_session_id` yang tidak ada di event `payment_request.expiry`. Harus diubah untuk menggunakan `xendit_reference_id` sebagai fallback matching.

---

## Perubahan yang Diperlukan

### 1. File: `src/types/OrderTypes.ts`

Tambahkan field `xendit_reference_id`:

```typescript
export interface GuestOrder {
  // ... existing fields
  xendit_reference_id: string | null; // NEW
}
```

### 2. File: `src/components/admin/OrderDetailDialog.tsx`

Tambah section "Informasi Xendit" di bagian Pembayaran:

```
┌─────────────────────────────────────────┐
│ Pembayaran                              │
├─────────────────────────────────────────┤
│ Harga                    Rp 65.000      │
│ Status                   [Lunas]        │
│ Metode                   QRIS (DANA)    │
│ Dibayar        Senin, 29 Jan 2026 10:30 │
├─────────────────────────────────────────┤
│ Integrasi Xendit                        │
├─────────────────────────────────────────┤
│ Reference ID   RAPATIN-1769502616-xxx   │
│ Session ID     ps-xxx-xxx-xxx        [📋] │
│ Invoice        [Lihat Invoice]          │
└─────────────────────────────────────────┘
```

Informasi ini hanya ditampilkan jika ada `xendit_invoice_id` atau `xendit_reference_id`.

### 3. File: `supabase/functions/xendit-webhook/index.ts`

Update handler untuk menangani `payment_request.expiry`:

```typescript
// Handle payment_request.expiry event
if (event === 'payment_request.expiry') {
  console.log("Processing payment_request.expiry event");
  
  const referenceId = data.reference_id;
  if (!referenceId) {
    console.error("No reference_id in payment_request.expiry");
    return new Response(
      JSON.stringify({ error: 'Missing reference_id' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  // Find order by xendit_reference_id instead of payment_session_id
  const { data: order, error: findError } = await supabase
    .from('guest_orders')
    .select('id, payment_status')
    .eq('xendit_reference_id', referenceId)
    .single();
  
  if (findError || !order) {
    console.log("Order not found for reference_id:", referenceId);
    return new Response(
      JSON.stringify({ success: true, message: 'Order not found - might be test' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  // Don't update if already paid
  if (order.payment_status === 'paid') {
    return new Response(
      JSON.stringify({ success: true, message: 'Already paid' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  // Update to expired
  const { error: updateError } = await supabase
    .from('guest_orders')
    .update({ 
      payment_status: 'expired',
      expired_at: data.updated || new Date().toISOString()
    })
    .eq('id', order.id);
  
  if (updateError) {
    console.error("Failed to update order:", updateError);
    return new Response(
      JSON.stringify({ error: 'Update failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  console.log("Order marked as expired:", order.id);
  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
```

---

## Alur Kerja Webhook

```text
┌─────────────────────────────────────┐
│         Xendit Webhook              │
│   event: payment_request.expiry     │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  Extract reference_id dari payload  │
│  (bukan payment_session_id)         │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  Cari order berdasarkan             │
│  xendit_reference_id                │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  Cek apakah sudah paid?             │
│  Ya → Skip (sudah bayar)            │
│  Tidak → Update ke expired          │
└─────────────────────────────────────┘
```

---

## Tampilan UI Detail Order (Section Xendit)

```tsx
{/* Integrasi Xendit */}
{(order.xendit_reference_id || order.xendit_invoice_id) && (
  <>
    <Separator className="my-2" />
    <div className="text-xs text-muted-foreground mt-2 mb-1">Integrasi Xendit</div>
    
    {order.xendit_reference_id && (
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Reference ID</span>
        <div className="flex items-center gap-2">
          <code className="text-xs bg-muted px-2 py-1 rounded">
            {order.xendit_reference_id}
          </code>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )}
    
    {order.xendit_invoice_id && (
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Session ID</span>
        <div className="flex items-center gap-2">
          <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[150px]">
            {order.xendit_invoice_id}
          </code>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )}
  </>
)}
```

---

## File yang Diubah

| File | Perubahan |
|------|-----------|
| `src/types/OrderTypes.ts` | Tambah field `xendit_reference_id` |
| `src/components/admin/OrderDetailDialog.tsx` | Tambah section Integrasi Xendit |
| `supabase/functions/xendit-webhook/index.ts` | Handle event `payment_request.expiry` |

---

## Event Xendit yang Didukung

| Event | Status Update | Matching Field |
|-------|---------------|----------------|
| `payment_session.completed` | paid | xendit_invoice_id |
| `payment_session.expired` | expired | xendit_invoice_id |
| `payment_session.failed` | failed | xendit_invoice_id |
| `payment.capture` | (payment method) | xendit_reference_id |
| `payment_request.expiry` | expired | xendit_reference_id |

---

## Catatan Keamanan

- Webhook tetap diverifikasi dengan `x-callback-token`
- Idempotency check: order yang sudah `paid` tidak akan di-update ke `expired`
- Logging lengkap untuk debugging

