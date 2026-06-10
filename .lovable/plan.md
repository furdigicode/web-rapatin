# Rencana perbaikan jadwal recurring Quick Order

## Temuan utama

- Data Supabase untuk `INV-260608-0002` sudah benar untuk kasus yang dimaksud:
  - `recurrence_type = 2` mingguan
  - `repeat_interval = 1`
  - `end_type = end_after_type`
  - `recurrence_count = 3`
  - `weekly_days = [3,4,5]`
- Jadi tidak perlu mengubah isi data order tersebut atau struktur database.
- Masalahnya ada di beberapa tempat UI/fungsi yang masih menghitung recurring dengan cara lama: tambah 1 minggu per sesi, sehingga jadinya `9, 16, 23`, bukan mengikuti `weekly_days`.

## Perubahan yang akan dilakukan

1. Samakan perhitungan di halaman detail order publik
   - File: `src/pages/QuickOrderDetail.tsx`
   - Ganti fungsi `generateRecurringDates` agar memakai helper `calculateRecurringDays` yang sudah dipakai di form preview.
   - Invitation text di halaman detail publik otomatis ikut benar karena memakai fungsi tanggal yang sama.

2. Pastikan dialog admin memakai perhitungan yang sama
   - File: `src/components/admin/OrderDetailDialog.tsx`
   - Pertahankan pemakaian `calculateRecurringDays`, dan rapikan fallback supaya hanya dipakai untuk order lama yang tidak punya metadata recurring lengkap.
   - Pastikan tampilan detail admin untuk order Benny menjadi `9, 10, 11 Juni`, bukan `9, 16, 23 Juni`.

3. Perbaiki invitation di email konfirmasi
   - File: `supabase/functions/send-order-email/index.ts`
   - Tambahkan perhitungan recurring di edge function ini karena saat ini invitation email hanya memakai tanggal pertama.
   - Untuk order recurring, bagian `Time:` akan berisi semua sesi sesuai `weekly_days`.

4. Perbaiki tanggal di WhatsApp akses
   - File: `supabase/functions/send-whatsapp-notification/index.ts`
   - Parameter tanggal template WhatsApp akan berisi daftar sesi recurring, bukan hanya tanggal pertama.

5. Validasi setelah implementasi
   - Cek ulang dengan order `INV-260608-0002`.
   - Pastikan hasil konsisten di:
     - admin order detail
     - halaman detail order publik
     - invitation text
     - email resend
     - WhatsApp resend

## Catatan database

Tidak perlu migrasi Supabase untuk kasus ini, karena kolom dan data recurring yang dibutuhkan sudah tersedia di `guest_orders`. Perubahan yang diperlukan adalah memperbaiki kode pembaca/perender jadwal agar memakai data tersebut dengan benar.