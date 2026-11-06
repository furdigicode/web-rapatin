# Grafik Asal User Aktif (Bulan & Tahun)

Ganti kotak "Asal User Aktif" jadi dua grafik berdampingan:

- **Kiri – Bulan terpilih:** grafik batang terkelompok Retained / Reactivated / Baru (mis. 190 – 85 – 118), angka tampil di atas batang, tooltip berisi jumlah user + revenue.
- **Kanan – Tahun 2026:** grafik batang terkelompok per bulan (Jan s/d bulan terakhir yang sudah selesai), tiap bulan berisi 3 batang Retained / Reactivated / Baru. Bulan berjalan tidak ditampilkan.

Warna konsisten di kedua grafik, dengan keterangan (legend). Di layar kecil, grafik tersusun atas-bawah.

## Detail teknis
- `stats-churn`: tambah mode `{ year: 2026 }` yang mengembalikan `origin` per bulan. Satu scan `balance_logs` untuk rentang (Des tahun sebelumnya – akhir bulan selesai terakhir) + pencarian aktivitas pertama per user, dihitung di kode (definisi sama dengan mode bulanan: retained = aktif bulan sebelumnya, reactivated = pernah aktif sebelumnya tapi tidak bulan lalu, baru = aktivitas pertama).
- `StatistikChurn.tsx`: pakai Recharts (`BarChart`) lewat komponen chart shadcn yang sudah ada; data tahunan dimuat sekali dan di-refresh lewat tombol Segarkan.
- Verifikasi: angka Oktober di grafik tahunan harus sama dengan 190 / 85 / 118.
