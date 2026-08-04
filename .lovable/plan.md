# Fix: Email konfirmasi tidak terkirim otomatis setelah pembayaran

## Hasil pemeriksaan INV-260804-0004

Data order (id `7263d9db…`):
- `paid_at` 08:52:18 UTC, status `paid`
- `rapatin_order_id` 13159 + `zoom_link` terisi (jadwal Zoom berhasil dibuat)
- `email_sent_at` 09:03:00 UTC → ini pengiriman manual Anda (log `send-order-email` sukses ke ibudberry@gmail.com pada 09:03)
- Notifikasi admin WA sukses otomatis: `admin_notification_log` mencatat `payment_success` status success pada 08:52:26

Artinya webhook Xendit memang masuk dan diproses; hanya langkah email otomatis yang gagal, dan tidak ada log otomatis pada 08:52 untuk `send-order-email`.

## Penyebab

Di `supabase/functions/xendit-webhook/index.ts`, pemanggilan `send-order-email` (baris ~601) dilakukan **sebelum** `supabase.from('guest_orders').update(updateData)` (baris ~624). `zoom_link`, `meeting_id`, dan `zoom_passcode` saat itu masih hanya ada di variabel `updateData`, belum tersimpan di database.

`send-order-email` membaca order dari database dan langsung berhenti jika `zoom_link` kosong:

```
if (!order.zoom_link) → return { error: "Meeting not created yet" }
```

Karena itu email selalu berisiko gagal (race condition). Notifikasi WA admin lolos karena dipanggil setelah update. Ditambah lagi, `fetch` fire-and-forget tanpa `EdgeRuntime.waitUntil` bisa terputus saat isolate berhenti.

## Perbaikan

1. **Pindahkan pemicu email setelah update database berhasil.** Hapus blok trigger email di dalam `if (scheduleResult)`, dan panggil `send-order-email` di blok `if (paymentStatus === 'paid')` yang sudah ada setelah update (bersama Kledo sync dan notifikasi admin), hanya jika `updateData.zoom_link` terisi.
2. **Amankan eksekusi background** dengan `EdgeRuntime.waitUntil(...)` untuk ketiga pemanggilan (email, Kledo, notifikasi admin) supaya tidak terpotong sebelum selesai.
3. **Tambahkan retry ringan pada email**: jika respons `send-order-email` bukan 200, coba ulang maksimal 2x dengan jeda 3 detik dan 8 detik, lalu catat hasil akhirnya di log function.
4. **Jaring pengaman**: pada `check-order-status` (yang dipanggil halaman order saat polling), jika order sudah `paid`, punya `zoom_link`, dan `email_sent_at` masih null lebih dari 2 menit setelah `paid_at`, panggil `send-order-email` sekali (fire-and-forget). Ini menutup kasus webhook/isolate gagal tanpa perlu tindakan manual.

Tidak ada perubahan skema database dan tidak ada perubahan UI.

## File yang disentuh

- `supabase/functions/xendit-webhook/index.ts` — urutan trigger, waitUntil, retry email
- `supabase/functions/check-order-status/index.ts` — jaring pengaman email

Order INV-260804-0004 sendiri sudah beres (email terkirim manual, jadwal Zoom ada), jadi tidak perlu tindakan data.
