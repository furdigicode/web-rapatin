## Tujuan
Bangun endpoint webhook untuk menerima event dari KirimChat (Message Received/Sent/Delivered/Read/Failed) dan menampilkan riwayatnya di dashboard admin sebagai log saja (tidak otomatis update `guest_orders`).

## Arsitektur

```text
KirimChat ──POST──► Edge Function `kirimchat-webhook` (public, verify_jwt=false)
                          │
                          ▼
                    Tabel `kirimchat_webhook_events`
                          │
                          ▼
            Admin Dashboard: /admin/kirimchat-webhooks
```

## 1. Database (migration)

Tabel baru `kirimchat_webhook_events`:

| Kolom | Tipe | Catatan |
|---|---|---|
| `id` | uuid PK | default gen_random_uuid() |
| `event_type` | text | `message_received` / `message_sent` / `message_delivered` / `message_read` / `message_failed` / `unknown` |
| `channel` | text nullable | `whatsapp` / `instagram` / dll. |
| `message_id` | text nullable | id pesan dari KirimChat |
| `phone_number` | text nullable | nomor lawan bicara (E.164) |
| `template_name` | text nullable | jika berasal dari template |
| `status` | text nullable | raw status string |
| `error_message` | text nullable | jika failed |
| `payload` | jsonb not null | full body request untuk audit |
| `received_at` | timestamptz default now() |

Index: `event_type`, `phone_number`, `received_at desc`.

GRANT:
- `GRANT SELECT ON public.kirimchat_webhook_events TO authenticated;`
- `GRANT ALL ON public.kirimchat_webhook_events TO service_role;`
- TIDAK ada grant ke `anon` (admin only).

RLS:
- Enable RLS.
- Policy SELECT: hanya `public.is_admin_user()`.
- Insert/update/delete hanya via service_role (edge function) → tidak perlu policy.

## 2. Edge Function `kirimchat-webhook`

File: `supabase/functions/kirimchat-webhook/index.ts`
Config: tambahkan `[functions.kirimchat-webhook] verify_jwt = false` di `supabase/config.toml`.

Logika:
1. Handle CORS preflight + POST only.
2. Parse JSON body. Jangan tolak jika field tidak dikenal — selalu simpan `payload` mentah.
3. Mapping field umum KirimChat (best-effort dari struktur webhook KirimChat → fallback `unknown`):
   - `event` / `type` → `event_type` (normalisasi ke lowercase + underscore).
   - `channel` → `channel`.
   - `message.id` / `message_id` → `message_id`.
   - `from` / `phone_number` / `contact.phone` → `phone_number`.
   - `template.name` → `template_name`.
   - `status` → `status`.
   - `error.message` / `error` → `error_message`.
4. Insert ke `kirimchat_webhook_events` via service role client.
5. Return `200 { ok: true }` selalu (kecuali parsing error → 400) agar KirimChat tidak retry berlebihan.
6. Log ke console untuk debugging.
7. Keamanan: belum ada signature dari KirimChat — endpoint publik, hanya menyimpan data (tidak ada side effect). Catatan ditambahkan ke kode supaya nanti mudah ditambah verifikasi header bila tersedia.

URL endpoint yang akan dipasang di dashboard KirimChat:
`https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1/kirimchat-webhook`

## 3. Halaman Admin

Route baru: `/admin/kirimchat-webhooks` (lazy-loaded di `src/App.tsx`, dibungkus `ProtectedRoute`).

File baru:
- `src/pages/admin/KirimchatWebhooks.tsx` — halaman utama.
- (Opsional, jika perlu) `src/components/admin/KirimchatWebhookDetailDialog.tsx` — modal detail payload.

Konten halaman:
- Header pakai `AdminPageHeader` ("Riwayat Webhook KirimChat").
- Info box berisi URL endpoint webhook + tombol copy.
- Filter: select `event_type`, input pencarian `phone_number` / `message_id`, date range sederhana (opsional: hari ini / 7 hari / semua).
- Tabel (shadcn `Table`): kolom Waktu, Event, Channel, Phone, Message ID, Status, Aksi (Lihat payload).
- Pagination sederhana (limit 50, tombol Next/Prev pakai `range()`).
- Klik "Lihat" → buka Dialog menampilkan `payload` JSON (formatted `<pre>`).
- Query langsung ke Supabase via `supabase.from('kirimchat_webhook_events').select(...)` — RLS sudah membatasi ke admin.

Tambahkan link menu di `AdminLayout` (sidebar) ke route baru, ikon `Webhook` dari lucide-react.

## 4. Verifikasi
1. Setelah migration & deploy: kirim test request via `supabase--curl_edge_functions` ke `/kirimchat-webhook` dengan body contoh masing-masing event → cek baris muncul di tabel.
2. Login admin, buka `/admin/kirimchat-webhooks` → pastikan list, filter, dan modal detail berfungsi.
3. Cek RLS: query tanpa admin session harus kosong.

## Catatan
- Tidak mengubah `guest_orders` maupun fungsi `send-whatsapp-notification` (sesuai pilihan "Log saja").
- Signature verification bisa ditambahkan nanti tanpa migrasi data jika KirimChat menyediakan header tanda tangan.
