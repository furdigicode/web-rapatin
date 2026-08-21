## Plan: Bedakan Elemen Pilihan Tunggal vs Pilihan Ganda pada Survei

### Goal
Membuat perbedaan visual yang jelas antara pertanyaan tipe **single choice** (pilihan tunggal) dan **multiple choice** (pilihan ganda) di halaman formulir survei, agar pengguna tidak bingung.

- **Single choice** tetap menggunakan elemen berbentuk lingkaran (radio button).
- **Multiple choice** menggunakan elemen berbentuk kotak centang (checkbox) yang lebih terlihat sebagai kotak.

### Scope
Perubahan hanya pada tampilan publik formulir survei: `src/pages/SurveyDetail.tsx`.

Tidak mengubah:
- Struktur data (`survey_questions.question_type` tetap `radio` dan `checkbox`).
- Logika penyimpanan jawaban.
- Admin builder.

### Implementation
1. Update `src/pages/SurveyDetail.tsx`:
   - Untuk `question_type === 'radio'`, gunakan `RadioGroup`/`RadioGroupItem` seperti sekarang, dan pastikan tampilannya membulat penuh (lingkaran).
   - Untuk `question_type === 'checkbox'`, ganti/gaya checkbox agar terlihat jelas sebagai **kotak**:
     - Bentuk sudut lebih tajam (`rounded-sm` atau `rounded-md`) sehingga tidak tampak seperti lingkaran.
     - Ukuran sedikit lebih besar agar bentuknya lebih mudah dibedakan.
     - Tetap menampilkan ikon centang saat dipilih.
2. Verifikasi visual dengan membuka halaman `/survei/:slug` yang memiliki pertanyaan radio dan checkbox, lalu periksa bentuk elemen masing-masing.

### Acceptance Criteria
- [ ] Radio item tampil sebagai lingkaran kosong dengan titik saat dipilih.
- [ ] Checkbox item tampil sebagai kotak dengan centang saat dipilih.
- [ ] Dari jauh/di layar kecil bentuk keduanya sudah tidak lagi terlihat sama.
- [ ] Tidak ada perubahan perilaku submit atau validasi.