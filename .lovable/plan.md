

# Rencana: Tambahkan Riwayat Email dan WhatsApp ke Timeline

## Analisis

Screenshot menunjukkan kartu "Riwayat" di halaman detail order yang menampilkan timeline:
1. Order dibuat
2. Pembayaran diterima
3. Zoom meeting dibuat

User ingin menambahkan 2 item baru ke timeline:
- **Email terkirim** - ditampilkan jika `email_sent_at` ada
- **WhatsApp terkirim** - ditampilkan jika `whatsapp_sent_at` ada

## Perubahan yang Diperlukan

### 1. Edge Function: `check-order-status`

**File:** `supabase/functions/check-order-status/index.ts`

Tambahkan `email_sent_at` dan `whatsapp_sent_at` ke:
- Query select
- Response object

```typescript
// Pada query select (line 35):
.select('..., email_sent_at, whatsapp_sent_at')

// Pada response object:
order: {
  ...
  email_sent_at: order.email_sent_at,
  whatsapp_sent_at: order.whatsapp_sent_at,
}
```

---

### 2. Frontend: Interface OrderDetails

**File:** `src/pages/QuickOrderDetail.tsx`

Tambahkan field baru di interface OrderDetails:

```typescript
interface OrderDetails {
  // ... existing fields ...
  whatsapp_sent_at: string | null;
  email_sent_at: string | null;  // Tambah baru
}
```

---

### 3. Frontend: Timeline Section

**File:** `src/pages/QuickOrderDetail.tsx`

Tambahkan 2 item baru setelah "Zoom meeting dibuat":

**Layout Timeline Baru:**

```text
┌─────────────────────────────────────┐
│ Riwayat                             │
│                                     │
│ ● Order dibuat                      │
│ │ Minggu, 1 Februari 2026 pukul...  │
│                                     │
│ ● Pembayaran diterima               │
│ │ Minggu, 1 Februari 2026 pukul...  │
│                                     │
│ ● Zoom meeting dibuat               │
│ │ Meeting siap digunakan            │
│                                     │
│ ● Email terkirim          ← BARU    │
│ │ Minggu, 1 Februari 2026 pukul...  │
│                                     │
│ ● WhatsApp terkirim       ← BARU    │
│   Minggu, 1 Februari 2026 pukul...  │
│                                     │
└─────────────────────────────────────┘
```

**Kondisi tampil:**
- Email terkirim: hanya tampil jika `order.email_sent_at` ada (tidak null)
- WhatsApp terkirim: hanya tampil jika `order.whatsapp_sent_at` ada (tidak null)

**Warna:**
- Dot dan teks menggunakan warna biru untuk Email (sesuai ikon Email)
- Dot dan teks menggunakan warna hijau untuk WhatsApp (sesuai brand WhatsApp)

---

## Kode Timeline Item Baru

```tsx
{/* Timeline Item 4: Email Terkirim (conditional) */}
{order.email_sent_at && (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="w-3 h-3 bg-blue-500 rounded-full" />
      <div className="w-0.5 h-full bg-border min-h-[40px]" />
    </div>
    <div className="pb-6">
      <p className="font-medium text-sm text-blue-600">Email terkirim</p>
      <p className="text-sm text-muted-foreground">
        {formatDateTime(order.email_sent_at)}
      </p>
    </div>
  </div>
)}

{/* Timeline Item 5: WhatsApp Terkirim (conditional) */}
{order.whatsapp_sent_at && (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="w-3 h-3 bg-green-500 rounded-full" />
      {/* No line after last item */}
    </div>
    <div>
      <p className="font-medium text-sm text-green-600">WhatsApp terkirim</p>
      <p className="text-sm text-muted-foreground">
        {formatDateTime(order.whatsapp_sent_at)}
      </p>
    </div>
  </div>
)}
```

---

## Logika Garis Timeline

Timeline connector line perlu disesuaikan:
- Item Zoom meeting: tampilkan garis jika ada Email atau WhatsApp setelahnya
- Item Email: tampilkan garis jika ada WhatsApp setelahnya
- Item WhatsApp: tidak ada garis (item terakhir)

---

## Ringkasan File yang Diubah

| File | Perubahan |
|------|-----------|
| `supabase/functions/check-order-status/index.ts` | Tambah `email_sent_at` dan `whatsapp_sent_at` ke query & response |
| `src/pages/QuickOrderDetail.tsx` | Tambah field di interface + 2 timeline items baru |

---

## Hasil yang Diharapkan

Timeline akan menampilkan riwayat lengkap order:
1. Order dibuat (selalu tampil)
2. Pembayaran diterima (selalu tampil untuk paid orders)
3. Zoom meeting dibuat (selalu tampil untuk paid orders)
4. Email terkirim (tampil jika email pernah dikirim)
5. WhatsApp terkirim (tampil jika WhatsApp pernah dikirim)

