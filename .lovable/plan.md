## Tujuan
Tambahkan verifikasi signature HMAC-SHA256 pada edge function `kirimchat-webhook` menggunakan secret yang baru saja dibuat di KirimChat.

## Langkah

1. **Simpan secret** sebagai `KIRIMCHAT_WEBHOOK_SECRET` lewat tool `secrets--add_secret` (user akan paste nilainya di form aman — jangan paste di chat).

2. **Update `supabase/functions/kirimchat-webhook/index.ts`**:
   - Baca raw body sebagai text dulu (bukan `req.json()` langsung) supaya bisa dihitung HMAC-nya.
   - Hitung HMAC-SHA256 dari raw body pakai `KIRIMCHAT_WEBHOOK_SECRET` (Web Crypto API).
   - Bandingkan dengan header signature dari KirimChat (kemungkinan `X-Webhook-Signature` / `X-KirimChat-Signature` — function akan memeriksa beberapa nama header umum dan menerima format `sha256=...` maupun hex polos).
   - Constant-time compare; reject 401 jika tidak cocok.
   - Jika `KIRIMCHAT_WEBHOOK_SECRET` tidak diset, function tetap menerima request (mode kompatibel) dan mencatat warning di log — supaya tidak putus saat rotasi.
   - Setelah valid, parse JSON dan lanjutkan logika insert seperti sekarang.

3. **Tidak ada perubahan database / UI.** URL endpoint sama.

## Catatan
- Nama header signature KirimChat tidak terdokumentasi di project ini, jadi function akan cek daftar header umum (`x-webhook-signature`, `x-kirimchat-signature`, `x-signature`). Setelah test pertama dari KirimChat, log akan menunjukkan header mana yang dipakai dan kita bisa pertajam.

## Verifikasi
- Test via `supabase--curl_edge_functions` tanpa signature → 401.
- Test dengan signature valid yang dihitung dari secret → 200, baris masuk ke tabel.
