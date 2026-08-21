# Hadiah Voucher Setelah Isi Survei

Admin bisa mengaktifkan hadiah per survei. Jika aktif, layar setelah submit menampilkan kode voucher yang bisa disalin beserta ketentuannya; jika tidak aktif, tampilannya tetap seperti sekarang ("Terima kasih atas partisipasi Anda").

## Pengaturan di admin (Survey Builder)

Di kartu **Pengaturan Survei**, tambah blok **Hadiah**:
- Switch "Berikan hadiah setelah mengisi survei".
- Saat aktif, muncul:
  - **Kode voucher** (satu kode yang sama untuk semua responden).
  - **Judul hadiah** (opsional, mis. "Voucher diskon 20%").
  - **Ketentuan hadiah** — editor teks kaya dengan toolbar: bold, italic, underline, bullet list, numbered list.

## Halaman publik `/survei/:slug`

Setelah submit berhasil (dan juga saat responden membuka ulang survei yang sudah pernah diisi):
- Hadiah tidak aktif → kartu terima kasih seperti sekarang.
- Hadiah aktif → kartu terima kasih + blok voucher:
  - Kode voucher tampil besar dengan gaya monospace di dalam kotak, tombol **Salin** (ikon berubah jadi centang + toast "Kode disalin").
  - Ketentuan dirender sebagai HTML sanitized di bawah kode.

## Detail teknis

Database (migrasi):
- Tambah kolom di `surveys`: `has_reward` boolean default false, `reward_title` text null, `reward_code` text null, `reward_terms` text null.
- Kebijakan baca publik `surveys` yang ada sudah mencakup kolom baru (survei aktif), jadi tidak ada perubahan RLS.

Frontend:
- `src/types/SurveyTypes.ts` — tambah field hadiah ke `Survey`, `SurveyFormData`, dan `defaultSurveyFormData`.
- Editor teks kaya baru `src/components/admin/TiptapEditor.tsx` memakai `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-underline` (paket baru), toolbar tombol ikon dengan token desain yang ada; output HTML.
- `src/components/admin/SurveyBuilder.tsx` — field hadiah pada state form, simpan ke Supabase saat create/update.
- `src/pages/SurveyDetail.tsx` — komponen `RewardCard` untuk kode + tombol salin (`navigator.clipboard`) dan ketentuan; render HTML ketentuan lewat sanitasi (`DOMPurify`) agar aman.
- Halaman hasil survei tidak berubah.

Catatan: tidak ada perubahan pada edge function `submit-survey` karena kode voucher bersifat statis per survei.
