# Tambah Badge PSE Komdigi di Footer

## Tujuan
Menampilkan informasi terdaftar PSE (Penyelenggara Sistem Elektronik) Komdigi milik Rapatin di footer, dengan deskripsi singkat dan tautan yang membuka tab baru.

## Yang akan dibuat
- Badge/logo PSE yang diupload dipasang di footer, pada kolom pertama (di bawah deskripsi Rapatin dan ikon sosial media).
- Deskripsi singkat di bawah badge, contoh:
  "Rapatin terdaftar sebagai Penyelenggara Sistem Elektronik (PSE) Lingkup Privat pada Kementerian Komunikasi dan Digital RI — No. 028726.01/DJAI.PSE/07/2026."
- Gambar badge dibungkus tautan ke URL tanda daftar dengan `target="_blank"` dan `rel="noopener noreferrer"`, plus `alt` deskriptif untuk SEO/aksesibilitas.
- Layout responsif: badge dibatasi lebarnya (maks ~220px) agar tidak mendominasi kolom footer.

## Catatan teknis
- File: `src/components/Footer.tsx` (satu-satunya file yang diubah).
- Gambar badge didaftarkan sebagai Lovable Asset dari file upload, lalu diimpor sebagai pointer JSON — binary tidak masuk repo.
- Warna teks memakai token `text-muted-foreground` yang sudah ada; tidak ada warna hardcoded.

## Perlu konfirmasi
URL yang diberikan berformat `blob:https://beranda.oss.go.id/...` — URL `blob:` hanya valid di sesi browser yang membuatnya, jadi tidak bisa dibuka oleh pengunjung lain. Rencana saat ini: tautkan badge ke `https://pse.komdigi.go.id/tdpse-detail` (halaman cek PSE) atau ke URL PDF publik jika Anda punya. Jika Anda ingin tetap memakai URL blob apa adanya, saya pakai itu — tinggal beri tahu.
