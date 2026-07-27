## Masalah

Untuk order `INV-260727-0003`:
- Customer WA template `akses` sukses terkirim (dari `send-whatsapp-notification`).
- Admin WA template `order_new` (saat order dibuat) dan `order_paid` (saat pembayaran sukses) tidak pernah keluar — di tabel `kirimchat_webhook_events` tidak ada event apa pun ke nomor admin `6282133579061` di rentang 07:03–07:06.

Order lain sebelumnya (06:19, 06:26) berhasil sampai ke admin, jadi template & kredensial Kirimdev sendiri sehat. Yang terjadi bersifat intermiten.

## Penyebab

`create-guest-order` (line 349) dan `xendit-webhook` (line 666) memanggil `notify-admin-order` dengan pola fire-and-forget:

```ts
fetch(`${fnUrl}/functions/v1/notify-admin-order`, { ... })
  .then(res => console.log(...))
  .catch(err => console.error(...));
```

Fetch ini tidak di-`await` dan tidak dibungkus `EdgeRuntime.waitUntil`. Di Deno Edge Runtime, saat parent function mengembalikan Response, runtime bebas menghentikan promise yang masih berjalan sebelum request HTTP ke fungsi child selesai dikirim. Ini kenapa `notify-admin-order` sama sekali tidak ada log dan tidak ada event WA untuk order 07:03/07:05 — panggilannya dibunuh sebelum sampai.

`send-whatsapp-notification` tidak terpengaruh karena dipanggil dari alur foreground yang menunggu response.

## Yang akan diubah

1. `supabase/functions/create-guest-order/index.ts` (~line 347–360)
   - Bungkus `fetch("notify-admin-order", {event_type: "new_order"})` dengan `EdgeRuntime.waitUntil(...)` supaya runtime menahan proses hingga request selesai, tanpa memblokir response ke client.

2. `supabase/functions/xendit-webhook/index.ts` (~line 652–674)
   - Bungkus kedua fire-and-forget (`kledo-sync` dan `notify-admin-order` untuk `event_type: "payment_success"`) dengan `EdgeRuntime.waitUntil(...)` dengan alasan sama.

3. Tambahkan sedikit logging return status body di dalam `.then(async res => { console.log(res.status, await res.text()) })` supaya ke depan kalau gagal 4xx/5xx kita punya jejak yang bisa dibaca.

Tidak ada perubahan tabel, kontrak fungsi, atau UI. Nama fungsi/tabel tetap.

## Verifikasi setelah build mode

- Trigger satu order test → cek `kirimchat_webhook_events` muncul `message.sent` ke `6282133579061` untuk template `order_new`.
- Bayar order test tersebut → cek `message.sent` ke admin untuk template `order_paid`.
- Kalau admin tetap tidak terima, cek log `notify-admin-order` untuk error dari Kirimdev (mis. template belum approved atau parameter mismatch); dengan `waitUntil` log akan muncul.
