# Perbaikan Jarak Header Halaman Survei

## Masalah
Navbar pada halaman `/survei/:slug` bersifat fixed di atas layar, tetapi konten utama halaman survei hanya memakai padding vertikal biasa (`py-12`). Akibatnya kartu judul survei menempel/terlalu dekat dengan logo navbar, terlihat jelas di tampilan mobile dan sedikit "naik" di desktop.

## Perubahan
- Di `src/pages/SurveyDetail.tsx`, tambahkan offset atas pada `<main>` supaya konten mulai di bawah navbar fixed: gunakan padding atas responsif (mis. `pt-24 md:pt-32`) dan pertahankan padding bawah (`pb-12 md:pb-16`).
- Rapikan kartu judul: ukuran judul responsif (lebih kecil di mobile, besar di desktop) dan jarak antar elemen header kartu agar tidak terasa berdesakan.

Hanya perubahan tampilan; logika survei, validasi, dan submit tidak diubah.

## Verifikasi
Cek halaman survei publik lewat browser di viewport mobile dan desktop, pastikan judul tidak lagi tertutup/terlalu dekat navbar.
