# Riwayat Response API Rapatin untuk Quick Order

## Jawaban singkat untuk INV-260718-0002

Saat ini **tidak ada riwayat tersimpan** dari request/response API Rapatin.

Data order tersebut:
- `payment_status = paid`, `paid_at = 18 Jul 2026 08:01 WIB`
- `rapatin_order_id = NULL` → panggilan ke `POST https://api.rapatin.id/schedules` gagal saat webhook pembayaran berjalan
- `zoom_link` dan `meeting_id` terisi, `updated_at` 10 menit setelah pembayaran → jadwal diisi belakangan (input manual/regenerate oleh admin)

Request dan response Rapatin hanya ditulis ke `console.log` di edge function `xendit-webhook`. Log edge function punya retensi pendek, dan query log untuk 18 Juli 2026 sudah kosong — jadi penyebab persis kegagalan hari itu tidak bisa lagi ditelusuri.

## Yang akan dibuat: log permanen API Rapatin

Mengikuti pola yang sudah dipakai `admin_notification_log`.

1. Tabel baru `rapatin_api_log` menyimpan setiap panggilan ke Rapatin: order terkait, jenis aksi (login / create schedule / regenerate), sumber pemanggil, request body, response body, HTTP status, durasi, pesan error, dan waktu.
2. `xendit-webhook` menulis log untuk login token maupun pembuatan jadwal — baik sukses maupun gagal — tanpa mengubah alur pembayaran yang ada.
3. `regenerate-rapatin-schedule` menulis log dengan cara yang sama, sehingga percobaan ulang admin ikut tercatat.
4. Di dialog detail order admin: bagian "Riwayat API Rapatin" berisi daftar percobaan (waktu, status, ringkasan error) dengan opsi lihat payload lengkap, mirip tombol "Lihat Log" di KirimChat Rules.

## Catatan teknis

- Migrasi: `CREATE TABLE public.rapatin_api_log` + `GRANT` (`SELECT` untuk `authenticated`, `ALL` untuk `service_role`), aktifkan RLS, policy baca via `is_custom_admin_user()`, tulis hanya lewat service role (edge function).
- Index pada `order_id` dan `created_at desc`.
- Password/token Rapatin di-redaksi sebelum disimpan; hanya `Bearer` yang dipotong, kredensial login tidak pernah ditulis.
- Penulisan log bersifat best-effort (dibungkus try/catch) supaya kegagalan log tidak pernah menggagalkan proses pembayaran.
- Data historis tidak bisa direkonstruksi; log akan berlaku untuk order mulai setelah perubahan ini aktif.
