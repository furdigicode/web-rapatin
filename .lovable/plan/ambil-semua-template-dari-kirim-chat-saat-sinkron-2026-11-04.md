# Ambil semua template dari Kirim.Chat saat sinkron

## Temuan
- Tabel di halaman Templates sudah menampilkan semua isi database (tidak ada batas tampilan). Database memang hanya berisi 10 template.
- Penyebabnya ada di proses sinkron: Kirim.Chat mengirim template per halaman (10 per halaman), dan sinkron kita hanya membaca halaman pertama. Karena itu `activation_user` dan template lain tidak ikut masuk.

## Perubahan
1. Sinkron membaca semua halaman dari Kirim.Chat sampai habis, lalu menyimpan semuanya.
2. Notifikasi setelah sinkron menampilkan jumlah total, misalnya "24 template diperbarui".
3. Halaman Templates diberi kolom cari nama dan paginasi (20 per halaman) agar tetap rapi saat jumlahnya banyak.

## Detail teknis
- `kirimchat-templates-sync`: loop `page=1..n` (juga dukung `cursor`/`next` jika ada di respons), berhenti saat data kosong, kurang dari ukuran halaman, atau `pagination.has_more/total_pages` habis; batas aman 50 halaman. Bentuk respons dicek dulu dari log satu kali panggilan.
- `KirimchatTemplates.tsx`: filter pencarian di sisi klien + paginasi sederhana (Sebelumnya/Berikutnya).
