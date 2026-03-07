

# Migrasi WhatsApp: BalesOtomatis → KirimChat

## Pre-requisite: Secret
- `KIRIMCHAT_API_KEY` belum dikonfigurasi. **Anda perlu menambahkan secret ini di Supabase dashboard** sebelum edge function bisa berfungsi.

## Perubahan: `supabase/functions/send-whatsapp-notification/index.ts`

Rewrite seluruh file untuk:

1. **Ganti credential**: `BALESOTOMATIS_API_KEY` + `BALESOTOMATIS_NUMBER_ID` → `KIRIMCHAT_API_KEY`
2. **Format nomor telepon**: KirimChat butuh format `628xxx` (dengan country code), bukan tanpa
3. **Ganti API endpoint**: `https://api-prod.kirim.chat/api/v1/public/messages/send`
4. **Auth header**: `Authorization: Bearer {apiKey}` + `Content-Type: application/json`
5. **Template message "akses"** dengan 6 parameter body:
   - `{{1}}` = nama customer (`order.name`)
   - `{{2}}` = meeting topic (`order.meeting_topic || "Zoom Meeting"`)
   - `{{3}}` = tanggal + waktu (`"4 Maret 2026 - 13:00 WIB"`)
   - `{{4}}` = zoom link
   - `{{5}}` = meeting ID
   - `{{6}}` = passcode
6. **Hapus** manual message builder dan interface `BalesOtomatisResponse`
7. **Pertahankan** cooldown logic, order validation, dan `whatsapp_sent_at` update

| File | Perubahan |
|------|-----------|
| `send-whatsapp-notification/index.ts` | Full rewrite ke KirimChat API |

