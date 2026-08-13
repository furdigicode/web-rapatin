# Export Event Webhook KirimChat (5 Agustus – 13 Agustus 2026)

## Yang akan dihasilkan

Satu file JSON berisi **1.413 event** webhook KirimChat, lengkap semua kolom termasuk `payload` mentah.

- Rentang data terverifikasi: 5 Agu 2026 02:06 UTC – 13 Agu 2026 02:21 UTC
- Sumber: tabel `kirimchat_webhook_events`
- Ukuran perkiraan: ~1,7 MB
- Format: JSON array, terurut dari paling lama ke paling baru
- Kolom: `id`, `event_type`, `channel`, `message_id`, `phone_number`, `template_name`, `status`, `error_message`, `payload`, `received_at`

## Cara pengambilan

Karena akses `psql` langsung tidak tersedia di sesi ini, data diambil bertahap lewat query database (dipecah per blok baris), lalu digabung menjadi satu file JSON utuh dan divalidasi (jumlah baris harus 1.413, JSON harus valid).

File akan tersedia untuk diunduh sebagai `kirimchat_webhook_events_2026-08-05_2026-08-13.json`.

## Catatan

Tidak ada perubahan pada kode aplikasi maupun database — ini murni ekspor data baca-saja.
