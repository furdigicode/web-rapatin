

# Fix: KirimChat Text Message Payload

## Masalah
KirimChat mengembalikan error `"content is required for text messages"`. Payload saat ini menggunakan `message: { body: ... }` yang salah untuk tipe pesan teks.

## Perbaikan: `supabase/functions/notify-admin-order/index.ts`

Ubah body request dari:
```json
{
  "phone_number": "628...",
  "channel": "whatsapp",
  "message_type": "text",
  "message": { "body": message }
}
```

Menjadi:
```json
{
  "phone_number": "628...",
  "channel": "whatsapp",
  "message_type": "text",
  "content": message
}
```

Hanya perubahan pada field payload, satu baris edit.

