## Status webhook

URL webhook `https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1/kirimchat-webhook` tetap aman dan tidak berubah — rotasi `KIRIMCHAT_API_KEY` sebelumnya tidak memengaruhi endpoint webhook maupun signature verification-nya. Fungsi `kirimchat-webhook` memverifikasi HMAC-SHA256 memakai `KIRIMCHAT_WEBHOOK_SECRET`, terpisah dari API key.

## Update webhook secret

1. Panggil `update_secret` untuk `KIRIMCHAT_WEBHOOK_SECRET` — form aman akan terbuka untuk memasukkan nilai baru.
2. Nilai baru harus identik dengan yang di-set di dashboard KirimChat (shared secret). Sarankan pakai string acak kuat (mis. `openssl rand -hex 32`) dan paste nilai yang sama di kedua sisi.
3. Setelah tersimpan, edge function otomatis membaca nilai baru pada request berikutnya — tanpa redeploy.
4. Verifikasi: kirim event uji dari KirimChat, lalu cek di `/admin/kirimchat-webhooks` bahwa event tercatat dengan status `received` (bukan `invalid_signature`).