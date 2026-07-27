
## Diagnosa

Template `order_new` & `order_paid` di Kirimdev sebenarnya `language: "id"` (bukan `id_ID` — data DB `kirimchat_templates` yang otoritatif). Jadi perubahan sebelumnya justru bikin lebih salah, dan test barusan tetap gagal `invalid_field_value / Invalid input`.

Karena Kirimdev tidak mengembalikan `error.param`, kita tidak bisa pinpoint field. Kandidat masalah:
- `formatRupiah` via `Intl.NumberFormat("id-ID", currency IDR)` menghasilkan `Rp` + U+00A0 (non-breaking space) di variabel body. Meta/Kirimdev kadang menolak whitespace non-standar di parameter template.
- Payload request tidak pernah di-log, jadi kita menerka.

## Perubahan

1. `supabase/functions/_shared/kirimdev.ts` — kembalikan default `languageCode` ke `"id"`.
2. `supabase/functions/notify-admin-order/index.ts`:
   - `languageCode: "id"` (samakan dengan template terdaftar).
   - Ganti `formatRupiah` menjadi format manual `"Rp " + amount.toLocaleString("id-ID")` (spasi biasa, tanpa NBSP, tanpa desimal).
   - Sanitize semua body parameter: trim, ganti newline/tab dengan spasi, collapse whitespace berlebih.
   - Log payload request lengkap sebelum fetch, dan log `request_id` + `param` dari response error.
3. `supabase/functions/send-whatsapp-notification/index.ts` — balik ke `languageCode: "id"` (template `akses` juga `id` di DB), samakan sanitasi & pretty rupiah tidak dipakai di sini, cukup kembalikan language.
4. `supabase/functions/kirimchat-webhook/index.ts` — fallback `template_language` kembali ke `"id"`.

Tidak ubah UI, tabel, atau logika bisnis.

## Verifikasi

- Setelah deploy, klik "Kirim Notif Admin" di dialog order INV-260727-0005.
- Cek log `notify-admin-order`: baris "Request payload:" akan menampilkan JSON yang tepat kita kirim; jika Kirimdev masih tolak, error message + `request_id` diketahui persis untuk step berikutnya.
- Ekspektasi utama: request berhasil (200), admin menerima WA `order_new`.
