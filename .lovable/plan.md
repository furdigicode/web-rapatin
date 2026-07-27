
## Masalah

Order INV-260727-0005: Kirimdev tolak `order_new` dengan `invalid_field_value / Invalid input`. Struktur payload (6 var body + 1 var button URL = 7 variabel) sudah cocok dengan template Kirimdev (screenshot dashboard). Bedanya: kita kirim `language.code = "id"`, sedangkan template terdaftar sebagai `id_ID`. Meta WhatsApp API menolak template kalau language code tidak persis sama.

## Perubahan

1. `supabase/functions/_shared/kirimdev.ts` — ubah default `languageCode` dari `"id"` menjadi `"id_ID"`.
2. `supabase/functions/notify-admin-order/index.ts` — set eksplisit `languageCode: "id_ID"` untuk `order_new` dan `order_paid`.
3. `supabase/functions/send-whatsapp-notification/index.ts` — set `languageCode: "id_ID"` (template `akses` juga terdaftar dengan locale ID).
4. `supabase/functions/kirimchat-webhook/index.ts` — fallback `template_language` diubah dari `"id"` ke `"id_ID"` agar rules yang tidak mengisi language tetap valid.

Tidak menyentuh UI, tabel, atau logika lain.

## Verifikasi

- Buat order guest baru → log `notify-admin-order` harus menunjukkan response Kirimdev berisi `messages[].id` (200 OK), bukan `invalid_field_value`. Admin (0821-3357-9061) menerima WA `order_new`.
- Bayar order tersebut → admin menerima `order_paid`.
