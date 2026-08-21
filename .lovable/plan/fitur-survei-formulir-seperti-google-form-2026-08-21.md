# Fitur Survei (Formulir seperti Google Form)

Membangun fitur survei baru: admin menempelkan markdown, sistem otomatis memecahnya jadi daftar pertanyaan yang bisa diedit, lalu survei dipublikasikan sebagai halaman formulir publik.

## Alur admin

1. Menu sidebar baru **Survei** dengan submenu: Semua Survei, Hasil Survei.
2. Buat survei baru: isi judul, deskripsi, slug (auto dari judul), status (draft/aktif/tutup), tanggal mulai/selesai (opsional).
3. Tab **Import Markdown**: tempel markdown → tombol "Parse" → muncul daftar pertanyaan hasil breakdown yang bisa diedit (ubah teks, tipe, opsi, wajib/tidak, urutan drag, hapus, tambah manual).
4. Simpan → survei + pertanyaan + opsi tersimpan.
5. Halaman hasil: ringkasan per pertanyaan (bar chart untuk pilihan, rata-rata untuk skala, daftar jawaban untuk teks), tabel responden, tombol **Export CSV**.

## Format markdown yang dikenali

```text
## Bagian A (opsional, jadi judul section)

1. Apa jabatan Anda? (text)
2. Seberapa puas Anda? (scale 1-5)
3. Fitur mana yang paling Anda pakai? (radio) *
   - Zoom harian
   - Recurring meeting
   - Webinar
4. Kendala apa yang Anda alami? (checkbox)
   - [ ] Koneksi
   - [ ] Harga
   - [ ] Fitur kurang
5. Saran Anda? (textarea)
```

Aturan parser:
- Baris bernomor (`1.`) atau `- ` di level atas = pertanyaan; `##` = judul section.
- Penanda tipe dalam tanda kurung: `text`, `textarea`, `radio`, `checkbox`, `scale 1-5`.
- Tanpa penanda: kalau ada anak opsi → `radio`; kalau tidak → `text`.
- Tanda `*` di akhir = wajib diisi.
- Baris indentasi `-`, `*`, atau `- [ ]` = opsi jawaban.
- Parser toleran: apapun hasilnya, admin bisa memperbaiki di daftar pertanyaan sebelum simpan.

## Halaman publik `/survei/:slug`

- Tampilan satu kolom bergaya formulir (kartu per pertanyaan) memakai token desain yang ada.
- Blok identitas di atas: **Nama** dan **Email wajib** (validasi zod).
- Render kontrol sesuai tipe: radio group, checkbox, input teks, textarea, skala 1-5.
- Validasi wajib sebelum submit, tampilkan pesan error per pertanyaan.
- Cegah pengisian ganda dengan fingerprint browser (pola yang sudah dipakai di fitur voting) + cek email per survei; kalau sudah mengisi tampilkan layar "terima kasih".
- Survei draft/tutup/di luar rentang tanggal menampilkan status yang jelas, bukan formulir.
- Setelah submit tampilkan halaman terima kasih (hasil tidak dibuka ke publik pada versi awal).

## Detail teknis

Tabel baru (dengan GRANT + RLS, mengikuti pola tabel voting):
- `surveys` — id, title, description, slug (unik), status, start_date, end_date, total_responses, timestamps.
- `survey_questions` — id, survey_id, section (nullable), question_text, question_type (`text` | `textarea` | `radio` | `checkbox` | `scale`), is_required, options (jsonb array untuk radio/checkbox), scale_min, scale_max, question_order.
- `survey_responses` — id, survey_id, respondent_name, respondent_email, user_identifier (fingerprint), submitted_at, metadata.
- `survey_answers` — id, response_id, question_id, answer_text (nullable), answer_options (jsonb, untuk checkbox/radio), answer_number (untuk scale).

RLS: baca publik untuk `surveys`/`survey_questions` hanya saat status aktif; tulis respons hanya lewat edge function; baca respons/jawaban dibatasi admin (`is_custom_admin_user()`), manajemen survei oleh admin.

Edge function `submit-survey` (service role): validasi survei aktif & rentang tanggal, validasi nama/email, cek duplikat via `user_identifier` + email, validasi pertanyaan wajib dan tipe jawaban, insert respons + jawaban, naikkan `total_responses`.

Frontend:
- `src/utils/markdownSurveyParser.ts` — parser markdown → daftar pertanyaan.
- `src/types/SurveyTypes.ts` — tipe data.
- Admin: `src/pages/admin/SurveyManagement.tsx`, `src/pages/admin/SurveyResults.tsx`, `src/components/admin/SurveyBuilder.tsx` (termasuk tab import markdown), item sidebar di `AdminLayout.tsx`.
- Publik: `src/pages/SurveyDetail.tsx` + rute `/survei/:slug` di `App.tsx` (lazy load).
- Export CSV dibuat di sisi klien dari data respons (satu baris per responden, satu kolom per pertanyaan).
