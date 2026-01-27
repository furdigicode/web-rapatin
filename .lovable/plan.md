
# Rencana: Migrasi dari Xendit Invoice API v2 ke Sessions API v3

## Ringkasan
Mengganti penggunaan Xendit Invoice API (`/v2/invoices`) dengan Sessions API (`/sessions`) untuk membuat payment link sesuai dengan format terbaru yang Anda berikan.

## Perbandingan API

| Aspek | Invoice API v2 (Lama) | Sessions API v3 (Baru) |
|-------|----------------------|------------------------|
| Endpoint | `api.xendit.co/v2/invoices` | `api.xendit.co/sessions` |
| ID Field | `external_id` | `reference_id` |
| Redirect Success | `success_redirect_url` | `success_return_url` |
| Redirect Failure | `failure_redirect_url` | `cancel_return_url` |
| Response URL | `invoice_url` | `payment_link_url` |
| Session Type | - | `session_type: "PAY"` |
| Mode | - | `mode: "PAYMENT_LINK"` |
| Country | - | `country: "ID"` (wajib) |

## Perubahan File

### File yang Diubah: `supabase/functions/create-guest-order/index.ts`

### Perubahan Request Body

**Sebelum (Invoice API v2):**
```typescript
const xenditResponse = await fetch("https://api.xendit.co/v2/invoices", {
  method: "POST",
  headers: {
    Authorization: `Basic ${btoa(xenditSecretKey + ":")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    external_id: invoiceExternalId,
    amount: price,
    payer_email: email,
    description: `Sewa Zoom Meeting - ${participant_count} Peserta - ${meeting_date}`,
    invoice_duration: 86400,
    customer: {
      given_names: name,
      email: email,
      mobile_number: cleanWhatsapp,
    },
    success_redirect_url: `https://rapatin.lovable.app/quick-order/${accessSlug}`,
    failure_redirect_url: `https://rapatin.lovable.app/quick-order/${accessSlug}`,
    currency: "IDR",
    items: [...],
  }),
});
```

**Sesudah (Sessions API v3):**
```typescript
const xenditResponse = await fetch("https://api.xendit.co/sessions", {
  method: "POST",
  headers: {
    Authorization: `Basic ${btoa(xenditSecretKey + ":")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    reference_id: sessionReferenceId,
    session_type: "PAY",
    mode: "PAYMENT_LINK",
    amount: price,
    currency: "IDR",
    country: "ID",
    customer: {
      reference_id: `cust_${Date.now()}`,
      type: "INDIVIDUAL",
      email: email,
      mobile_number: cleanWhatsapp,
      individual_detail: {
        given_names: name,
      },
    },
    items: [
      {
        reference_id: `item_zoom_${participant_count}`,
        name: `Sewa Zoom ${participant_count} Peserta`,
        description: `Meeting: ${meeting_topic} - ${meeting_date}`,
        type: "DIGITAL_PRODUCT",
        category: "SERVICE",
        net_unit_amount: price,
        quantity: 1,
        currency: "IDR",
        url: "https://rapatin.id/sewa-zoom-harian",
      },
    ],
    capture_method: "AUTOMATIC",
    locale: "id",
    description: `Sewa Zoom Meeting - ${participant_count} Peserta - ${meeting_date}`,
    success_return_url: `https://rapatin.lovable.app/quick-order/${accessSlug}`,
    cancel_return_url: `https://rapatin.lovable.app/quick-order/${accessSlug}`,
  }),
});
```

### Perubahan Response Handling

**Sebelum:**
```typescript
const xenditInvoice = await xenditResponse.json();
// Response: { id: "...", invoice_url: "https://checkout.xendit.co/..." }

xendit_invoice_id: xenditInvoice.id,
xendit_invoice_url: xenditInvoice.invoice_url,
```

**Sesudah:**
```typescript
const xenditSession = await xenditResponse.json();
// Response: { id: "...", payment_link_url: "https://checkout.xendit.co/..." }

xendit_invoice_id: xenditSession.id,
xendit_invoice_url: xenditSession.payment_link_url,
```

## Mapping Field Lengkap

| Field Lama | Field Baru | Keterangan |
|------------|-----------|------------|
| `external_id` | `reference_id` | ID unik transaksi |
| - | `session_type` | `"PAY"` untuk pembayaran |
| - | `mode` | `"PAYMENT_LINK"` untuk hosted checkout |
| `amount` | `amount` | Sama |
| `currency` | `currency` | Sama (`"IDR"`) |
| - | `country` | Wajib: `"ID"` untuk Indonesia |
| `payer_email` | `customer.email` | Dipindah ke customer object |
| `customer.given_names` | `customer.individual_detail.given_names` | Nested lebih dalam |
| `customer.email` | `customer.email` | Sama |
| `customer.mobile_number` | `customer.mobile_number` | Sama |
| - | `customer.reference_id` | ID unik customer (baru) |
| - | `customer.type` | `"INDIVIDUAL"` |
| `items[].name` | `items[].name` | Sama |
| `items[].quantity` | `items[].quantity` | Sama |
| `items[].price` | `items[].net_unit_amount` | Nama field berubah |
| - | `items[].reference_id` | ID unik item (baru) |
| - | `items[].type` | `"DIGITAL_PRODUCT"` |
| - | `items[].category` | `"SERVICE"` |
| - | `items[].description` | Deskripsi item |
| - | `items[].url` | URL produk |
| `invoice_duration` | - | Tidak ada di Sessions (default 24 jam) |
| `success_redirect_url` | `success_return_url` | Nama berubah |
| `failure_redirect_url` | `cancel_return_url` | Nama berubah |
| - | `capture_method` | `"AUTOMATIC"` |
| - | `locale` | `"id"` untuk bahasa Indonesia |

## Struktur Response Sessions API

```json
{
  "id": "ps-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "reference_id": "RAPATIN-1234567890-abc123",
  "session_type": "PAY",
  "status": "PENDING",
  "payment_link_url": "https://checkout.xendit.co/sessions/ps-xxx...",
  "created_at": "2026-01-27T06:00:00.000Z",
  "expires_at": "2026-01-28T06:00:00.000Z"
}
```

## Perubahan Database

Tidak ada perubahan schema database karena field yang disimpan tetap sama:
- `xendit_invoice_id` menyimpan `session.id`
- `xendit_invoice_url` menyimpan `session.payment_link_url`
- `expired_at` bisa diambil dari response `expires_at` atau tetap dihitung manual

## Urutan Implementasi

1. Update endpoint dari `/v2/invoices` ke `/sessions`
2. Ubah struktur request body sesuai format Sessions API
3. Update response handling untuk menggunakan `payment_link_url`
4. Deploy dan test edge function
5. Verifikasi webhook masih kompatibel (jika ada perubahan)

## Catatan Penting

- **Webhook**: Perlu dicek apakah webhook handler (`xendit-webhook`) perlu disesuaikan dengan format callback Sessions API
- **Locale**: Menggunakan `"id"` agar halaman checkout dalam bahasa Indonesia
- **Type Item**: Menggunakan `"DIGITAL_PRODUCT"` karena produk adalah layanan digital (Zoom meeting)
