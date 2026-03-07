

# Fix: Ganti Pesan Teks Biasa ke Template `notif_admin` KirimChat

## Masalah
Pesan teks biasa gagal karena 24-hour window expired. User sudah membuat template **`notif_admin`** (Approved) di KirimChat.

## Template `notif_admin` (dari screenshot)

- **Header**: text `{{1}}` → judul event ("Order Baru" atau "Pembayaran Berhasil")
- **Body** 6 parameter:
  - `{{1}}` = No. Order (INV-260306-0004)
  - `{{2}}` = Pembeli (nama)
  - `{{3}}` = Jumlah harga (Rp 25.000)
  - `{{4}}` = Topik meeting
  - `{{5}}` = Waktu (Jumat, 6 Maret 2026 • 22:00 WIB)
  - `{{6}}` = Kapasitas peserta
- **Button** (index 0): dynamic URL suffix `{{1}}` → access_slug order

## Perubahan: `supabase/functions/notify-admin-order/index.ts`

Ganti payload dari `message_type: "text"` + `content` ke `message_type: "template"` + `template` object:

```typescript
body: JSON.stringify({
  phone_number: ADMIN_PHONE,
  channel: "whatsapp",
  message_type: "template",
  template: {
    name: "notif_admin",
    language: { code: "id" },
    components: [
      {
        type: "header",
        parameters: [
          { type: "text", text: headerText } // "Order Baru" atau "Pembayaran Berhasil"
        ]
      },
      {
        type: "body",
        parameters: [
          { type: "text", text: orderNumber },
          { type: "text", text: order.name },
          { type: "text", text: formatRupiah(order.price) },
          { type: "text", text: order.meeting_topic || "-" },
          { type: "text", text: dateTimeStr },
          { type: "text", text: `${order.participant_count}` },
        ]
      },
      {
        type: "button",
        index: 0,
        parameters: [
          { type: "text", text: order.access_slug || "" }
        ]
      }
    ]
  }
})
```

- Hapus manual message builder (plain text strings)
- Tentukan `headerText` berdasarkan `event_type`: `"Order Baru"` vs `"Pembayaran Berhasil"`
- Pertahankan semua validasi, error handling, dan logging yang ada

| File | Perubahan |
|------|-----------|
| `notify-admin-order/index.ts` | Ganti payload text → template `notif_admin` |

