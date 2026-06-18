## Tambah dukungan kirim Pesan Teks (bukan hanya Template) di Rules

Saat ini setiap rule selalu mengirim WhatsApp **template**. Kita tambahkan opsi "Tipe Aksi" agar rule bisa juga mengirim **pesan teks biasa** via endpoint yang sama (`message_type: "text"`, field `content`).

### 1. Migration — `kirimchat_rules`
Tambah kolom (nullable, backward-compatible):
- `action_type text not null default 'template'` — `'template'` atau `'text'`.
- `text_content text` — isi pesan teks; mendukung placeholder `{{customer_name}}`, `{{message_text}}`, dst seperti `body_variables`.

Kolom lama (`template_name`, `template_language`, `header_image_url`, `body_variables`) jadi opsional secara logika — hanya wajib bila `action_type = 'template'`.

### 2. Form Rule (`KirimchatRules.tsx`)
- Tambah Select **Tipe Aksi**: "Kirim Template" / "Kirim Pesan Teks".
- Jika `template`: tampilkan UI template seperti sekarang (pilih template, bahasa, header image, variabel).
- Jika `text`: sembunyikan UI template, tampilkan `Textarea` "Isi Pesan" + helper placeholder yang tersedia (`{{customer_name}}`, `{{customer_phone}}`, `{{message_text}}`, `{{channel}}`, `{{event_type}}`).
- Validasi Zod: `text` → `text_content` wajib & ≤ 4096 char; `template` → `template_name` wajib (seperti sekarang).
- Tabel daftar rule: kolom "Template" jadi "Aksi" → tampilkan badge `Teks` + preview 40 char, atau `Template: nama_template`.

### 3. Edge function `kirimchat-webhook/index.ts`
- Saat rule cocok, baca `matched.action_type`.
- Tambah fungsi `sendText(phone, content)` yang POST body:
  ```json
  { "phone_number": "...", "channel": "whatsapp", "message_type": "text", "content": "..." }
  ```
  Return shape sama dgn `sendTemplate` (`ok, status, body, request, durationMs`) supaya logging dispatch tidak berubah.
- Untuk `action_type = 'text'`: resolve placeholder `text_content` dengan `substitutePlaceholders(..., ctx)` lalu panggil `sendText`.
- Untuk `action_type = 'template'`: jalur lama tidak berubah.
- Dialog "Lihat Log" tetap menampilkan `dispatch_request`/`dispatch_response` (otomatis berisi payload teks).

### 4. Verifikasi
- Buat rule baru `Tipe Aksi = Teks`, isi `"Halo {{customer_name}}, pesan kamu diterima."`, trigger event `message.received` keyword `tes`.
- Kirim "tes" via WA → Lihat Log: kolom API `200`, expand → `dispatch_request` menunjukkan `message_type: "text"` + content ter-resolve.
- Rule template lama tetap berjalan tanpa perubahan.
