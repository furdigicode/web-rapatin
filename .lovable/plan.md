

## Tujuan
Di halaman detail order `/quick-order/:slug`, untuk order recurring seperti `070a00d5-3f4f-41a5-ac88-515db6c78e82`, tampilkan:
1) Semua tanggal + waktu sesi pada bagian “Jadwal Meeting”
2) Semua tanggal sesi pada bagian “Invitation” (format seperti contoh)

Saat ini belum tampil karena data recurring tidak ikut terkirim dari Edge Function `check-order-status`, sehingga `order.is_recurring` dan `order.total_days` di frontend bernilai `undefined/null` dan UI jatuh ke mode single-date.

---

## Temuan (akar masalah)
- Di database, order tersebut **memiliki recurring fields**:
  - `is_recurring=true`, `recurrence_type=1`, `repeat_interval=7`, `total_days=3`, `meeting_date=2026-02-05`, `meeting_time=08:00`
- Tetapi Edge Function `supabase/functions/check-order-status/index.ts` hanya `.select(...)` field lama dan response juga hanya mengembalikan field lama, **tanpa**:
  - `is_recurring, recurrence_type, repeat_interval, weekly_days, monthly_day, monthly_week, end_type, recurrence_end_date, recurrence_count, total_days`
- Akibatnya, halaman detail order tetap menampilkan 1 tanggal (seperti screenshot).

---

## Perubahan yang akan dilakukan

### 1) Update Edge Function `check-order-status` agar mengirim field recurring
**File:** `supabase/functions/check-order-status/index.ts`

**A. Update query select**
Tambahkan kolom recurring ke `.select(...)`, contoh:
- `is_recurring`
- `recurrence_type`
- `repeat_interval`
- `weekly_days`
- `monthly_day`
- `monthly_week`
- `end_type`
- `recurrence_end_date`
- `recurrence_count`
- `total_days`

**B. Update response JSON**
Pastikan `order: { ... }` yang dikembalikan ke frontend juga mencantumkan semua field di atas.

**Hasil yang diharapkan**
Frontend akan menerima data recurring lengkap, sehingga:
- kondisi `order.is_recurring && order.total_days > 1` menjadi true
- UI otomatis merender list semua sesi
- `generateInvitationText(order)` otomatis memuat semua tanggal sesi

---

### 2) (Opsional tapi direkomendasikan) Hardening di `QuickOrderDetail.tsx`
**File:** `src/pages/QuickOrderDetail.tsx`

Agar lebih robust jika suatu hari ada order lama atau response belum lengkap:
- Jika `order.is_recurring === true` tetapi `total_days` kosong, tampilkan fallback:
  - label “Tanggal Meeting (Recurring)” + tanggal mulai
  - dan (opsional) small warning: “Detail jadwal lengkap belum tersedia, silakan refresh”
- Jika `total_days` ada tetapi `is_recurring` null (edge-case), treat as recurring jika `total_days > 1`.

Catatan: ini bukan wajib untuk memperbaiki kasus Anda sekarang, tapi mengurangi kejadian “belum ada” jika ada data yang parsial.

---

## Cara verifikasi (testing)
1. Deploy Edge Function `check-order-status` setelah perubahan.
2. Buka halaman: `/quick-order/VFBi6YtFq8qQvp4j9yIVrFMA`
3. Pastikan:
   - Bagian yang sebelumnya “Tanggal Meeting” berubah menjadi “Jadwal Meeting”
   - Menampilkan 3 baris:
     - Kamis, 5 Februari 2026 • 08:00 WIB
     - Kamis, 12 Februari 2026 • 08:00 WIB
     - Kamis, 19 Februari 2026 • 08:00 WIB
4. Scroll ke “Invitation”:
   - Baris `Time:` mencantumkan semua tanggal sesi (format sesuai implementasi sekarang: `Time: ...` lalu baris-baris berikutnya).

---

## Dampak & risiko
- Dampak positif: semua client (customer) yang membuka order recurring akan langsung melihat jadwal lengkap dan invitation lengkap.
- Risiko rendah: hanya menambah field di response; tidak mengubah logic pembayaran/meeting creation.

---

## File yang akan diubah
1. `supabase/functions/check-order-status/index.ts` (wajib)
2. `src/pages/QuickOrderDetail.tsx` (opsional hardening; jika Anda setuju)

---

## Catatan teknis tambahan (untuk developer)
- Screenshot “belum ada” konsisten dengan response missing recurring fields, bukan masalah UI rendering.
- Untuk order contoh ini, `recurrence_type=1` dan `repeat_interval=7` akan menghasilkan sesi mingguan, dan helper di `QuickOrderDetail.tsx` sudah menghitungnya (as daily + 7 days). Jadi setelah data terkirim, hasil tanggal akan sesuai ekspektasi.

