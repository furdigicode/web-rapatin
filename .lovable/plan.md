
# Rencana: Tampilkan Jadwal Recurring Meeting di Admin Order Detail

## Masalah
Order "Yayasan Sadar Hati" adalah recurring meeting (daily, 2 hari: 4 & 5 Maret), tapi dialog detail order admin hanya menampilkan tanggal pertama (4 Maret). Admin tidak bisa melihat bahwa ini order 2 hari.

## Perubahan

### `src/components/admin/OrderDetailDialog.tsx`

1. Import `addDays`, `addWeeks`, `addMonths` dari `date-fns`
2. Tambah fungsi `generateRecurringDates` (sama seperti yang ada di `QuickOrderDetail.tsx`)
3. Di bagian "Detail Meeting", setelah tanggal meeting:
   - Jika `order.is_recurring && order.total_days > 1`:
     - Tampilkan badge "Recurring" (misal `Badge` dengan label "Recurring · X sesi")
     - Tampilkan daftar semua tanggal sesi
   - Jika tidak recurring, tampilkan tanggal tunggal seperti sekarang

Contoh tampilan di dialog:
```
📅 Recurring · 2 sesi
   - Rabu, 4 Maret 2026
   - Kamis, 5 Maret 2026
```

| File | Perubahan |
|------|-----------|
| `OrderDetailDialog.tsx` | Tambah recurring dates display + badge di bagian Detail Meeting |
