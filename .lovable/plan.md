## Log Eksekusi Pengiriman Template (Rule → KirimChat API)

Saat ini webhook hanya menyimpan `rule_action` (`sent`/`failed`/`skipped_no_phone`/`no_match`/`error`) pada baris `kirimchat_webhook_events`. Detail hit ke API KirimChat (status code, response body, payload yang dikirim, durasi) hanya muncul di console log edge function — tidak terlihat di dialog "Lihat Log".

### Perubahan

**1. Migration — perluas `kirimchat_webhook_events`**
Tambah kolom (semua nullable, agar backward-compatible):
- `dispatch_request jsonb` — payload yang dikirim ke KirimChat (phone, template, language, components, resolved variables, header image).
- `dispatch_response jsonb` — body respons KirimChat (parsed JSON jika bisa, fallback `{ raw: "..." }`).
- `dispatch_status_code int` — HTTP status dari KirimChat.
- `dispatch_duration_ms int` — durasi fetch.
- `dispatched_at timestamptz` — waktu request dikirim.

**2. `supabase/functions/kirimchat-webhook/index.ts`**
- `sendTemplate` mengembalikan juga `request` (object yang dikirim) dan `durationMs`, plus mencoba `JSON.parse(body)` untuk `dispatch_response`.
- Setelah `sendTemplate`, update baris event dengan kolom-kolom baru di atas selain `rule_action` / `matched_rule_id`.
- Tetap log skip cases (`skipped_no_phone`, `no_match`, `error`) tanpa kolom dispatch.

**3. `src/pages/admin/KirimchatRules.tsx` (dialog Lihat Log)**
- Tambah ke interface `WebhookEvent`: `dispatch_status_code`, `dispatch_duration_ms`, `dispatched_at`, `dispatch_request`, `dispatch_response`.
- Tambah kolom "API" di tabel: tampilkan `dispatch_status_code` dengan badge (2xx hijau, 4xx/5xx merah, kosong abu "—") + durasi `(123ms)`.
- Saat baris di-expand, selain payload webhook, tampilkan dua blok tambahan bila ada:
  - "Request ke KirimChat" → pretty JSON `dispatch_request`.
  - "Response KirimChat" → pretty JSON `dispatch_response` + status code.

### Verifikasi
- Trigger rule "Testing" via webhook tester KirimChat.
- Buka Lihat Log → kolom API menampilkan `200` hijau + durasi.
- Expand baris → terlihat payload webhook, request body yang dikirim ke KirimChat (dengan variabel ter-resolve), dan response API.
- Untuk kasus gagal (mis. template tidak approved), status `4xx`/`5xx` muncul merah dan response body berisi pesan error dari KirimChat.
