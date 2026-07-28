## Masalah

`supabase/functions/notify-admin-order/index.ts` saat ini "fail and forget": kalau request ke KirimChat gagal (5xx, timeout, quota), fungsi hanya `console.error` lalu balas 500. Tidak ada jejak di DB — admin tidak tahu order yang gagal dikirimi notifikasi (`order_new` / `order_paid`).

## Solusi

### 1. Tabel log baru: `admin_notification_log`
Rekam setiap upaya kirim notifikasi admin.

```
id uuid pk
order_id uuid (nullable, fk logical ke guest_orders.id)
event_type text        -- 'new_order' | 'payment_success'
template_name text     -- 'order_new' | 'order_paid'
phone_number text      -- nomor admin tujuan
attempt integer        -- 1..N
status text            -- 'success' | 'failed'
status_code integer
request jsonb
response jsonb
error_message text
duration_ms integer
created_at timestamptz default now()
```
RLS: hanya `service_role` (edge function) + admin via `is_custom_admin_user()` untuk SELECT. Grant untuk `service_role`.

### 2. Update `notify-admin-order`
- Retry sampai 3x dengan exponential backoff (500ms → 1500ms → 3000ms) untuk status 5xx/network error. Status 4xx tidak di-retry (bad payload).
- Setiap percobaan (sukses maupun gagal) di-`insert` ke `admin_notification_log` dengan `attempt` yang benar dan payload request/response mentah.
- Kalau setelah retry terakhir masih gagal, fungsi tetap balas 200 ke pemanggil (webhook Xendit / caller lain) supaya tidak menghambat pipeline — kegagalan sudah tercatat di log.

### 3. Halaman admin: `/admin/notification-log` (opsional, cepat)
Halaman read-only sederhana yang menampilkan 200 entri terakhir dari `admin_notification_log`: waktu, event, order_number (join ke `guest_orders`), status, status_code, tombol "Lihat payload" (dialog dengan request/response JSON). Tambahkan submenu di sidebar admin di bawah grup Pesanan.

### 4. Perilaku "notifikasi WA admin"
Karena KirimChat itu sendiri yang gagal, tidak masuk akal mengirim WA lewat channel yang sama. Notifikasi admin dilakukan lewat **log yang terlihat di dashboard admin** (poin 3). Kalau ke depan ingin channel fallback (Telegram/email), tinggal tambah dispatcher lain — di luar scope sekarang.

## Teknis singkat

- Migrasi: buat tabel + RLS + GRANT.
- Edit `supabase/functions/notify-admin-order/index.ts`: extract fungsi `sendWithRetry` yang mengembalikan `{ ok, status, response, durationMs, attempts }`; loop insert log per attempt; jangan lempar 500 saat semua retry gagal (return 200 dengan `logged: true`).
- Frontend: `src/pages/admin/NotificationLog.tsx` + route di `src/App.tsx` + item sidebar di `AdminLayout`.

## Yang tidak berubah
Template name (`order_new` / `order_paid`), struktur payload KirimChat, nomor admin hardcoded, dan flow di `send-whatsapp-notification` (untuk customer) tetap seperti sekarang.