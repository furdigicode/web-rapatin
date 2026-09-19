# Sembunyikan Pilihan Xendit di Quick Order, Pindah ke Pengaturan Admin

## Tujuan
Pelanggan di halaman /quick-order tidak lagi memilih penyedia pembayaran. Mereka hanya menekan satu tombol "Bayar Sekarang". Penyedia pembayaran yang dipakai ditentukan oleh admin dari halaman pengaturan, default Duitku.

## Yang berubah untuk pelanggan
- Blok "Pilih Penyedia Pembayaran" hilang dari formulir order.
- Alur pembayaran tetap sama: popup Duitku muncul di halaman order (atau halaman Xendit jika admin mengaktifkan Xendit).
- Halaman detail order tetap mendukung keduanya, karena order lama yang memakai Xendit harus tetap bisa dibayar dan ditampilkan.

## Yang berubah untuk admin
- Halaman baru **Pengaturan Pembayaran** di area admin (`/admin/payment-settings`), muncul di menu admin.
- Satu pilihan: penyedia aktif — Duitku (default) atau Xendit — dengan tombol simpan dan keterangan kapan terakhir diubah.
- Pilihan ini langsung berlaku untuk order baru berikutnya.

## Catatan teknis
- Tabel baru `payment_gateway_settings` (satu baris: `id`, `active_gateway` text default `'duitku'`, `updated_at`, `updated_by`). GRANT: `SELECT` ke `anon` dan `authenticated`, `ALL` ke `service_role`; RLS aktif — baca publik, tulis hanya admin (`is_custom_admin_user()`), mengikuti pola tabel pengaturan yang sudah ada. Seed satu baris berisi `duitku`.
- `supabase/functions/create-guest-order/index.ts`: berhenti mempercayai `payment_gateway` dari klien. Baca `active_gateway` dari tabel pengaturan (fallback `duitku` bila gagal), lalu jalankan cabang Duitku/Xendit yang sudah ada dan simpan nilainya di `guest_orders.payment_gateway`.
- `src/components/quick-order/QuickOrderForm.tsx`: hapus state `paymentGateway`, render `PaymentGatewaySelector`, dan field `payment_gateway` pada payload invoke.
- `src/components/quick-order/PaymentGatewaySelector.tsx`: dihapus; tipe `PaymentGateway` dipindah ke `src/types/OrderTypes.ts` agar tetap dipakai admin dan detail order.
- Halaman admin baru `src/pages/admin/PaymentSettings.tsx` (pola sama seperti `MysqlConnect.tsx`) + route lazy di `src/App.tsx` + item menu di komponen navigasi admin.
- `QuickOrderDetail.tsx`, `check-order-status`, `duitku-callback`, `xendit-webhook`, dan `kledo-sync` tidak diubah — Xendit tetap berfungsi penuh di sisi server.
