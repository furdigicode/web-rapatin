## Masalah

Rule "Tanya admin" sudah benar di DB (`action_type = 'text'`, `text_content = 'Halo kak, ada yang bisa Damar bantu?'`, `template_name = null`), tapi dispatch terakhir (11:19:43) tetap memakai:

```json
{ "message_type": "template", "template": { "name": null, "language": { "code": "id" } } }
```

→ KirimChat balas `400 VALIDATION_ERROR: template.name expected string, received null`.

Artinya cabang `action_type === "text"` di `kirimchat-webhook/index.ts` tidak tereksekusi pada versi yang sedang berjalan, meski kode sumber sudah punya branching tersebut. Kemungkinan terbesar: edge function belum re-deploy setelah edit terakhir, atau ada bug pada pembacaan field.

## Rencana Perbaikan

### 1. Pastikan edge function ter-deploy ulang
Trigger redeploy `kirimchat-webhook` dengan menyentuh file (tambah komentar versi `// v2 text-action`) supaya runtime memuat ulang kode yang sudah berisi cabang `sendText`.

### 2. Hardening cabang text di webhook
Di `supabase/functions/kirimchat-webhook/index.ts`:
- Tambah log eksplisit di awal evaluasi: `console.log("Matched rule", matched.id, "action_type=", matched.action_type)` agar mudah diverifikasi dari log.
- Normalisasi: `const actionType = String(matched.action_type ?? "template").toLowerCase();` agar aman jika kolom dikembalikan sebagai non-string.
- Guard tambahan: jika `actionType === "template"` tapi `!matched.template_name`, hentikan dengan `rule_action = "skipped_invalid_config"` + `error_message` jelas (mencegah request `template.name: null` ke KirimChat di masa depan).

### 3. Verifikasi
1. Buka log `kirimchat-webhook` setelah redeploy → kirim "tanya admin" via WA.
2. Expect log: `Matched rule ... action_type= text` dan `Rule text sent to 62...`.
3. Cek tabel `kirimchat_webhook_events`:
   - `dispatch_request.message_type = "text"`
   - `dispatch_request.content = "Halo kak, ada yang bisa Damar bantu?"`
   - `dispatch_status_code = 200`, `rule_action = "sent"`.
4. Rule template lama ("Testing", "Follow Up Quick Order") harus tetap jalan normal saat keyword cocok.

## File yang diubah
- `supabase/functions/kirimchat-webhook/index.ts` (log + normalisasi actionType + guard template kosong)

Tidak ada perubahan UI dan tidak ada migration baru.
