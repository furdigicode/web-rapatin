# Tambah Badge PSE Komdigi di Footer

## Tujuan
Menampilkan informasi terdaftar PSE (Penyelenggara Sistem Elektronik) Komdigi milik Rapatin di footer, dengan deskripsi singkat. Saat badge diklik, sertifikat PSE dibuka di dialog internal website (bukan tab baru), memakai file PDF yang diupload.

## Yang akan dibuat
- Badge/logo PSE dipasang di footer, pada kolom pertama (di bawah deskripsi Rapatin dan ikon sosial media), lebar maks ~220px agar proporsional.
- Deskripsi singkat di bawah badge:
  "Rapatin terdaftar sebagai Penyelenggara Sistem Elektronik (PSE) Lingkup Privat pada Kementerian Komunikasi dan Digital RI — No. 028726.01/DJAI.PSE/07/2026."
- Badge menjadi tombol yang membuka dialog (modal) berisi tampilan sertifikat PSE (PDF) di dalam website, dengan judul dialog dan tombol tutup.
- Di dalam dialog juga tersedia tautan "Buka di tab baru / Unduh PDF" sebagai fallback untuk perangkat yang tidak bisa menampilkan PDF inline (umumnya mobile).
- Dialog responsif: tinggi tetap (~85vh) dengan area PDF yang bisa di-scroll.

## Catatan teknis
- File yang diubah: `src/components/Footer.tsx`; komponen baru `src/components/PseBadge.tsx` (badge + dialog) memakai `Dialog` dari shadcn yang sudah ada.
- Gambar badge dan file `pse-rapatin.pdf` didaftarkan sebagai Lovable Asset (pointer `.asset.json`), lalu URL-nya dipakai di komponen — binary tidak masuk repo.
- PDF ditampilkan dengan `<iframe>` (atau `<object>`) yang menunjuk ke URL asset.
- Warna dan tipografi memakai token desain yang ada (`text-muted-foreground`), tanpa warna hardcoded.
