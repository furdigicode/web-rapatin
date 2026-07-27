## Masalah

1. **Webhook Dead / 401 "Missing signature"** — Kirimdev mengirim header `x-kirim-signature` (juga `x-kirim-event`, `x-kirim-delivery-id`, dst — terlihat di log booted sebelumnya). Fungsi `kirimchat-webhook` saat ini hanya mencari header: `x-webhook-signature`, `x-kirimchat-signature`, `x-kirim-chat-signature`, `x-signature`, `x-hub-signature-256`. Karena tidak ada yang cocok, request ditolak 401 dan Kirimdev menandainya Dead.
2. **Wording "KirimChat" di UI** sudah tidak relevan setelah migrasi ke Kirimdev.

## Rencana

### 1) Perbaiki verifikasi signature webhook
Di `supabase/functions/kirimchat-webhook/index.ts`:
- Tambah `x-kirim-signature` (dan `x-kirim-event`, dsb. untuk metadata bila perlu) ke daftar `SIGNATURE_HEADERS` dan `Access-Control-Allow-Headers`.
- Tetap pertahankan header lama sebagai fallback (kompatibilitas).
- Deploy ulang fungsi, lalu klik **Replay** di dashboard Kirimdev untuk verifikasi 200 OK.

Jika format signature Kirimdev bukan HMAC hex mentah (mis. `t=...,v1=...` ala Stripe), akan ditambahkan parser sederhana untuk memisahkan value sebelum bandingkan HMAC — akan dicek dari payload replay pertama.

### 2) Rename wording UI dari "KirimChat" → "Kirimdev"
Ubah label yang tampil ke admin (tidak mengubah nama tabel/edge function agar tidak merusak data & endpoint):
- `AdminSidebar`: menu utama "KirimChat" → "Kirimdev"; submenu tetap (Webhook, Rules, Templates).
- Judul halaman & heading di:
  - `/admin/kirimchat-webhooks` → "Kirimdev Webhook"
  - `/admin/kirimchat-rules` → "Kirimdev Rules"
  - `/admin/kirimchat-templates` → "Kirimdev Templates"
- Deskripsi/teks bantu yang menyebut "KirimChat" diganti "Kirimdev".

**Tidak diubah** (agar tidak breaking):
- Nama tabel `kirimchat_*`, path edge function `kirimchat-webhook`, path route `/admin/kirimchat-*`, nama secret `KIRIMCHAT_*`.

### 3) Verifikasi
- Redeploy `kirimchat-webhook`.
- Minta user klik Replay pada delivery yang Dead → cek response 200 dan row baru di tabel `kirimchat_webhook_events`.
