# Ganti hitungan Churn ke SQL dari Anif

## Apa yang berubah
1. **Sumber data**: aktivitas diambil dari pemotongan saldo untuk jadwal (`balance_logs`, event `reduce`, tipe `schedule` dan `schedule_from_liability`), bukan dari tabel jadwal. Nominal = `ABS(usage)`. Batas bulan pakai `created_at` mentah tanpa konversi zona waktu.
2. **Kartu Ringkasan** (query 1): User aktif bulan lalu, Retained, Churn + churn rate, Retention rate, Revenue jadwal bulan lalu, Potensi revenue hilang (revenue at risk), Revenue user retained (bulan lalu dan bulan ini).
3. **Asal user aktif bulan ini** (query 3): kartu kecil Retained / Reactivated (+revenue) / New, dengan total.
4. **Tab Follow Up** (query 2): tabel user churn dengan kolom nama, email, telepon, jumlah jadwal, pemakaian saldo, jadwal terakhir, segmen (Loyal / Bulan pertama / Sekali lainnya), tanda Nilai tinggi (≥ Rp100.000), sisa saldo dari `users.balance`. Ringkasan per segmen di atas tabel, filter segmen, paginasi 20 per baris.
5. Tabel churn di tab Ringkasan tetap ada (versi ringkas), atau dipindah sepenuhnya ke Follow Up — default: dipindah ke Follow Up.

## Verifikasi
Jalankan untuk Oktober 2026 dan cocokkan dengan angka Anif: 343 · 190 · 153 · 44,6% · 55,4% · Rp31.122.500 · Rp6.822.500 · Rp24.300.000 · Rp23.997.500; segmen 65/59/29, nilai tinggi 15 user Rp2.397.500; asal 190/85 (Rp4.738.000)/118 = 393.

## Teknis
- `stats-churn`: ganti query; MySQL kita mungkin tidak dukung `WITH`/`SET @var` — bila begitu, tulis ulang jadi subquery dengan parameter `?` (logika identik). Segmen "loyal" = aktif ≥2 bulan dalam 3 bulan sebelum bulan evaluasi (mengikuti laporan Oktober).
- Kolom `users.name/email/phone/balance` sudah terverifikasi ada.
- Aturan AGENTS.md soal definisi user aktif diperbarui ke `balance_logs`.
- `StatistikChurn.tsx`: kartu baru, blok asal user, tab Follow Up.
