# Perbaiki Tampilan Jadwal Recurring di Dialog Admin

## Masalah

Dialog detail order di admin (`src/components/admin/OrderDetailDialog.tsx`) menampilkan jadwal recurring yang **salah** untuk tipe weekly dengan banyak hari. Contoh order Benny (INV-260608-0002):

- DB: `weekly_days=[3,4,5]` (Sel, Rab, Kam), `count=3`, mulai 9 Juni
- Admin menampilkan: **9, 16, 23 Juni** (salah — semua Selasa)
- Yang sebenarnya dikirim ke Rapatin: **9, 10, 11 Juni** (benar — Sel, Rab, Kam)

Penyebab: fungsi lokal `generateRecurringDates` (baris 198-212) hanya melakukan `addWeeks(startDate, i * interval)` dan mengabaikan `weekly_days`, `monthly_day`, `monthly_week`, dan `end_type`.

## Perubahan

**File:** `src/components/admin/OrderDetailDialog.tsx`

1. Import `calculateRecurringDays` dari `@/utils/recurringCalculation` (helper yang sudah dipakai customer dan terbukti benar).
2. Ganti isi fungsi `generateRecurringDates` agar memanggil `calculateRecurringDays` dengan parameter dari order:
   - `startDate`, `startTime` dari `meeting_date` + `meeting_time`
   - `recurrenceType`, `repeatInterval`
   - `endType` dari `order.end_type`
   - `endDate` dari `recurrence_end_date`, `endAfterCount` dari `recurrence_count`
   - `weeklyDays`, `monthlyDay`, `monthlyWeek` dari kolom DB terkait
3. Fallback: kalau order belum punya `end_type` (data lama), pakai logika lama berbasis `total_days` agar tidak break order historis.
4. Hapus import `addDays/addWeeks/addMonths` jika tidak dipakai di tempat lain di file ini.

## Catatan

- **Tidak menyentuh** logika pengiriman ke Rapatin (`xendit-webhook`) — payload sudah benar.
- **Tidak menyentuh** customer preview — sudah benar.
- Khusus order Benny: jadwal aktual di Rapatin (9/10/11 Juni) adalah yang dipesan customer; setelah fix ini, dialog admin akan menampilkan tanggal yang sama dan konsisten dengan dashboard Rapatin.
