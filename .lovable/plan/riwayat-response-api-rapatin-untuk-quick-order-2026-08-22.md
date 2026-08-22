# Riwayat Response API Rapatin untuk Quick Order

## Jawaban singkat untuk INV-260718-0002

Saat ini **tidak ada riwayat tersimpan** dari request/response API Rapatin.

Data order tersebut:
- `payment_status = paid`, `paid_at = 18 Jul 2026 08:01 WIB`
- `rapatin_order_id = NULL` → panggilan ke `POST https://api.rapatin.id/schedules` gagal saat webhook pembayaran berjalan
- `zoom_link` dan `meeting_id` terisi, `updated_at` 10 menit setelah pembayaran → jadwal diisi belakangan (input manual/regenerate oleh admin)

Request dan response Rapatin hanya ditulis ke `console.log` di edge function `xendit-webhook`. Log edge function punya retensi pendek, dan query log untuk 18 Juli 2026 sudah kosong — jadi penyebab persis kegagalan hari itu tidak bisa lagi ditelusuri.

## Yang akan dibuat: simpan raw JSON di tabel order

Tanpa tabel baru — cukup satu kolom baru di `guest_orders`.

1. Kolom `rapatin_api_log` (JSONB, default array kosong) di `guest_orders`. Setiap panggilan ke Rapatin menambah satu entri raw JSON berisi: waktu, aksi (login / create_schedule / regenerate), sumber pemanggil, HTTP status, request body, response mentah, dan pesan error bila ada.
2. `xendit-webhook` menambahkan entri saat pembayaran diterima — baik jadwal berhasil dibuat maupun gagal — tanpa mengubah alur pembayaran.
3. `regenerate-rapatin-schedule` menambahkan entri dengan format yang sama, jadi percobaan ulang admin ikut tercatat berurutan.
4. Di dialog detail order admin: bagian "Response API Rapatin" menampilkan raw JSON (blok kode yang bisa di-scroll dan di-copy), sehingga langsung terlihat apakah Rapatin membalas error, timeout, atau sukses.

## Catatan teknis

- Migrasi: `ALTER TABLE public.guest_orders ADD COLUMN rapatin_api_log jsonb NOT NULL DEFAULT '[]'::jsonb`. Tidak ada tabel baru, RLS dan grant `guest_orders` yang ada tetap berlaku.
- Penambahan entri dilakukan dengan menggabungkan array yang sudah ada di dalam edge function (service role), append di akhir; entri terlama dipangkas jika melebihi 20 agar baris tidak membengkak.
- Kredensial di-redaksi: password login dan nilai `Authorization` tidak pernah ditulis ke JSON.
- Penulisan log best-effort (try/catch) supaya kegagalan log tidak pernah menggagalkan proses pembayaran.
- Data historis tidak bisa direkonstruksi; log berlaku untuk order setelah perubahan ini aktif.
