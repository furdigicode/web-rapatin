## Diagnosis

Webhook `cmqjbbumv5cvfrubbtlyqw53a` (event `message.received`, content `"123#"`) tidak memicu rule (`rule_action: no_match`). Dua bug di `supabase/functions/kirimchat-webhook/index.ts`:

1. **Event type tidak konsisten** — payload KirimChat memakai dot (`message.received`), tapi UI Rules menyimpan underscore (`message_received`), sehingga filter `.in("event_type", [event_type, "*"])` tidak pernah cocok.
2. **`message_text` kosong** — pick paths tidak menyertakan `data.content` (lokasi sebenarnya isi pesan pada payload KirimChat). Akibatnya keyword `"123#"` tidak akan match meski event sudah benar.

## Perubahan

### 1. Gunakan format titik (`message.received`) di semua tempat

Sesuai permintaan: pakai titik, jangan ubah ke underscore.

**Edge function `supabase/functions/kirimchat-webhook/index.ts`:**
- Hapus normalisasi titik. `normalizeEventType` cukup trim + lowercase (tetap rapikan spasi/dash, tapi **biarkan titik apa adanya**).
- Hasil: event tersimpan sebagai `message.received`, `message.sent`, dll.
- Tambah `"data.content"` dan `"data.message.content"` ke pick paths `message_text`.

**UI Rules `src/pages/admin/KirimchatRules.tsx`:**
- Ubah daftar `EVENT_TYPES` value menjadi dotted:
  - `message.received`, `message.sent`, `message.delivered`, `message.read`, `message.failed`
- Default form `event_type: "message.received"`.
- Label tetap (Bahasa Indonesia).

### 2. Migrasi data rule existing

Rule yang sudah ada (`c21ce536-...`) bernilai `message_received`. Migrasi konversi underscore → dot untuk semua row di `kirimchat_rules`:

```sql
UPDATE public.kirimchat_rules
SET event_type = REPLACE(event_type, '_', '.')
WHERE event_type LIKE 'message\_%' ESCAPE '\';
```

Event lama di `kirimchat_webhook_events` dibiarkan apa adanya (riwayat audit).

## Verifikasi

1. Trigger ulang (atau balas `123#` dari WA `6282133579061`).
2. Cek row baru `kirimchat_webhook_events`: `event_type = message.received`, `matched_rule_id = c21ce536-...`, `rule_action = sent`.
3. UI Rules menampilkan event `Pesan Masuk` (value `message.received`).
