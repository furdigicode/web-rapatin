

# Rencana: Tambah Timestamp Email & Perbaiki Label Timeline

## Ringkasan

Menambahkan field `email_sent_at` untuk mencatat waktu pengiriman email konfirmasi, dan memperjelas label "Kadaluarsa" menjadi "Pembayaran Kadaluarsa" di timeline.

---

## Penjelasan: Apa itu "Kadaluarsa"?

Field `expired_at` mencatat waktu ketika **pembayaran** pelanggan kadaluarsa, bukan meeting-nya. Alur:

1. Pelanggan submit Quick Order → mendapat link pembayaran Xendit
2. Jika tidak dibayar dalam ~24 jam → Xendit mengirim webhook `payment_request.expiry`
3. Order ditandai `payment_status: 'expired'` dan `expired_at` diisi timestamp

Jadi **timeline kadaluarsa hanya relevan untuk order dengan status 'expired'**.

---

## Perubahan Detail

### 1. Database Migration - Tambah Field `email_sent_at`

```sql
ALTER TABLE public.guest_orders 
ADD COLUMN email_sent_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

COMMENT ON COLUMN public.guest_orders.email_sent_at IS 
  'Timestamp when confirmation email was sent';
```

### 2. Update Type Definition

**File:** `src/types/OrderTypes.ts`

```typescript
export interface GuestOrder {
  // ... existing fields ...
  email_sent_at: string | null;  // NEW
}
```

### 3. Update Edge Function - Catat Waktu Kirim Email

**File:** `supabase/functions/send-order-email/index.ts`

Setelah email berhasil terkirim, update `email_sent_at`:

```typescript
// After successful email send...
await supabase
  .from('guest_orders')
  .update({ email_sent_at: new Date().toISOString() })
  .eq('id', order.id);
```

### 4. Update OrderDetailDialog Timeline

**File:** `src/components/admin/OrderDetailDialog.tsx`

Perubahan pada bagian Timeline (baris 760-789):

| Sebelum | Sesudah |
|---------|---------|
| "Kadaluarsa" | "Pembayaran Kadaluarsa" |
| (tidak ada) | "Email Terkirim" + timestamp |

```tsx
{/* Timeline */}
<div className="space-y-3">
  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
    Timeline
  </h3>
  <div className="grid gap-2 text-sm">
    <div className="flex justify-between">
      <span className="text-muted-foreground">Dibuat</span>
      <span>{formatDateTime(order.created_at)}</span>
    </div>
    {order.paid_at && (
      <div className="flex justify-between">
        <span className="text-muted-foreground">Dibayar</span>
        <span>{formatDateTime(order.paid_at)}</span>
      </div>
    )}
    {order.expired_at && (
      <div className="flex justify-between">
        <span className="text-muted-foreground">Pembayaran Kadaluarsa</span>
        <span>{formatDateTime(order.expired_at)}</span>
      </div>
    )}
    {order.email_sent_at && (
      <div className="flex justify-between">
        <span className="text-muted-foreground">Email Terkirim</span>
        <span>{formatDateTime(order.email_sent_at)}</span>
      </div>
    )}
    {order.kledo_synced_at && (
      <div className="flex justify-between">
        <span className="text-muted-foreground">Sync Kledo</span>
        <span>{formatDateTime(order.kledo_synced_at)}</span>
      </div>
    )}
  </div>
</div>
```

---

## Preview Timeline

```text
┌─────────────────────────────────────────────────────┐
│  Timeline                                           │
│  ───────────────────────────────────────           │
│                                                     │
│  Dibuat              Jumat, 31 Jan 2026 pukul 10:00│
│  Dibayar             Jumat, 31 Jan 2026 pukul 10:15│
│  Email Terkirim      Jumat, 31 Jan 2026 pukul 10:16│  ← NEW
│  Sync Kledo          Jumat, 31 Jan 2026 pukul 10:17│
│                                                     │
└─────────────────────────────────────────────────────┘

Atau untuk order kadaluarsa:

┌─────────────────────────────────────────────────────┐
│  Timeline                                           │
│  ───────────────────────────────────────           │
│                                                     │
│  Dibuat                    Jumat, 31 Jan pukul 10:00│
│  Pembayaran Kadaluarsa     Sabtu, 1 Feb pukul 10:00│  ← Label lebih jelas
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Ringkasan Perubahan

| File | Aksi | Deskripsi |
|------|------|-----------|
| Database | Migration | Tambah kolom `email_sent_at` |
| `src/types/OrderTypes.ts` | Ubah | Tambah field `email_sent_at` |
| `supabase/functions/send-order-email/index.ts` | Ubah | Simpan timestamp setelah email terkirim |
| `src/components/admin/OrderDetailDialog.tsx` | Ubah | Tambah "Email Terkirim" dan ubah label "Kadaluarsa" |

