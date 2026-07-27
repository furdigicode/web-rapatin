Migrasi semua integrasi WhatsApp dari KirimChat ke Kirimdev. Referensi: proyek **BengkelApp** (`supabase/functions/send-whatsapp/index.ts`). Kirimdev "drop-in compatible" dengan Meta WhatsApp Cloud API, jadi struktur payload `template` yang sudah dipakai (`{ name, language:{code}, components:[...] }`) langsung kompatibel.

## 1. Secret baru

Tambah dua secret Supabase via `add_secret`:
- `KIRIMDEV_API_KEY` (Bearer `kdv_live_...`)
- `KIRIMDEV_PHONE_NUMBER_ID` (mis. `106540352242922`)

Secret lama `KIRIMCHAT_API_KEY` & `KIRIMCHAT_WEBHOOK_SECRET` **dibiarkan** (tidak dihapus) untuk rollback aman; tidak dipakai lagi oleh kode setelah migrasi.

## 2. Fungsi kirim pesan (customer & admin)

Refactor tiga edge function agar memanggil endpoint Kirimdev, bukan `api-prod.kirim.chat`:

- `supabase/functions/send-whatsapp-notification/index.ts` — template `akses` ke customer.
- `supabase/functions/notify-admin-order/index.ts` — template `order_new` / `order_paid` ke admin.
- `supabase/functions/kirimchat-webhook/index.ts` — bagian dispatch rules (kirim template atau teks balasan).

Perubahan umum di ketiganya:
- Endpoint: `POST https://api.kirimdev.com/v1/${KIRIMDEV_PHONE_NUMBER_ID}/messages`
- Header: `Authorization: Bearer ${KIRIMDEV_API_KEY}`
- Format nomor: E.164 `+62…` (bukan `62…` telanjang).
- Payload text: `{ messaging_product:"whatsapp", to, type:"text", text:{ body } }`
- Payload template: `{ messaging_product:"whatsapp", to, type:"template", template:{...} }` — struktur `template` lama diteruskan apa adanya.
- Header image tetap disisipkan sebagai `components[0]` type `header` dengan `image.link` (sama seperti sebelumnya, sesuai Meta).
- Log request/response, kolom `dispatch_*` di `kirimchat_webhook_events`, dan cooldown WA tetap.

## 3. Sinkronisasi daftar template

`supabase/functions/kirimchat-templates-sync/index.ts` — repoint ke API list template Kirimdev.
Karena endpoint list template Kirimdev tidak setara persis dengan KirimChat, saya akan gunakan Meta-style endpoint yang lazim dipakai Kirimdev (`GET https://api.kirimdev.com/v1/${KIRIMDEV_PHONE_NUMBER_ID}/message_templates`). Jika struktur respons berbeda, saya akan menyesuaikan pemetaan kolom ke tabel `kirimchat_templates` (nama, bahasa, kategori, status, komponen header/body/footer/buttons, jumlah variabel).

Catatan: tabel & halaman admin **tidak diganti nama** (tetap `kirimchat_templates`, `/admin/kirimchat-templates`) agar tidak menyentuh UI/DB — hanya label di halaman yang saya ubah jadi "WhatsApp Templates (Kirimdev)".

## 4. Webhook penerima

`supabase/functions/kirimchat-webhook/index.ts` — endpoint penerima event.
- Verifikasi signature: Kirimdev/Meta mengirim `X-Hub-Signature-256` (HMAC-SHA256 dengan `KIRIMDEV_WEBHOOK_SECRET`). Saya akan tambah support header ini di samping header lama, sehingga bisa menerima payload Meta-style.
- Pemetaan payload Meta (`entry[].changes[].value.messages[]`, `statuses[]`) ke kolom yang sudah ada di `kirimchat_webhook_events` (event_type, message_id, phone_number, message_text, raw payload). Event type Meta di-normalize ke bentuk lama (`message.received`, `message.delivered`, dll.) supaya rules yang sudah ada tetap match.

Jika Anda ingin memakai secret webhook baru, saya akan minta `KIRIMDEV_WEBHOOK_SECRET` juga saat langkah 1.

## 5. Verifikasi

- Deploy semua function.
- `curl_edge_functions` kirim template ke nomor uji → cek 200 dari Kirimdev.
- `edge_function_logs` untuk `send-whatsapp-notification`, `notify-admin-order`, `kirimchat-webhook`.
- Uji satu order paid end-to-end (WA ke customer + notif admin).
- Uji sinkron template.

## 6. Yang TIDAK berubah

- Tabel database & RLS.
- UI admin (Rules, Webhooks, Templates) — hanya label kecil.
- Flow Xendit, Kledo, email Mailjet.
- Tombol admin resend WhatsApp.

## Pertanyaan terbuka (akan saya konfirmasi saat implementasi)

1. Apakah Kirimdev juga memberi `KIRIMDEV_WEBHOOK_SECRET` terpisah? (Jika ya, saya tambahkan di langkah 1.)
2. URL webhook baru: apakah Anda ingin URL yang sama (`/functions/v1/kirimchat-webhook`) — praktis, atau rename ke `/kirimdev-webhook`? Saya default **pakai URL lama** agar tidak perlu update konfigurasi provider dua kali.
