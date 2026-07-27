Rencana perbaikan webhook Kirimdev 401 `Invalid signature`:

1. Perbaiki parser signature Kirimdev di `supabase/functions/kirimchat-webhook/index.ts`.
   - Header Kirimdev berbentuk `X-Kirim-Signature: t=<timestamp>,v1=<hex>`.
   - Payload yang harus di-HMAC adalah `"<timestamp>.<raw_body>"`, bukan hanya `raw_body`.
   - Bandingkan terhadap semua nilai `v1=` agar tetap kompatibel saat secret rotation.

2. Tetap pertahankan kompatibilitas lama.
   - Header legacy seperti `x-webhook-signature`, `x-kirimchat-signature`, `x-signature`, dan `x-hub-signature-256` tetap diverifikasi dengan pola lama.
   - `x-kirim-signature` akan memakai pola resmi Kirimdev.

3. Tambahkan proteksi timestamp Kirimdev.
   - Tolak signature yang terlalu lama/terlalu jauh dari waktu server, misalnya toleransi 5 menit, agar replay attack lebih aman.
   - Log error cukup prefix/jenis error saja, tanpa membocorkan secret.

4. Deploy ulang edge function `kirimchat-webhook`.

5. Verifikasi setelah deploy.
   - Replay webhook dari dashboard Kirimdev.
   - Target hasil: response status berubah dari `401` menjadi `200`, event tersimpan di riwayat webhook admin sebagai `received`, dan rules bisa dievaluasi lagi untuk `message.sent` / event lain.