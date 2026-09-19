# Duitku sebagai Default + POP Popup di /quick-order/:id

Dua perubahan: (1) Duitku jadi pilihan default di form Quick Order, (2) pembayaran Duitku di halaman detail order dibuka sebagai **popup (POP) di halaman yang sama** memakai Duitku JS SDK, bukan membuka tab baru. Alur Xendit tidak berubah.

## Yang Dibangun

1. **Default gateway = Duitku** — `QuickOrderForm.tsx`
   - `useState<PaymentGateway>("duitku")`; selector tetap bisa ganti ke Xendit.

2. **`check-order-status` mengembalikan `duitku_reference`**
   - Tambah `duitku_reference` ke `.select(...)` dan ke response, supaya frontend punya reference untuk membuka POP SDK.

3. **`QuickOrderDetail.tsx` — POP popup untuk Duitku**
   - Load script Duitku POP JS SDK (production: `https://app-prod.duitku.com/lib/js/duitku.js`) secara dinamis hanya saat order ber-gateway Duitku.
   - Tombol "Lanjutkan Pembayaran":
     - Duitku → panggil `checkout.process(reference, {...callbacks})` → popup Duitku muncul di atas halaman detail order. Polling status 10 detik yang sudah ada otomatis menangkap perubahan status setelah popup ditutup.
     - Xendit → tetap link `xendit_invoice_url` di tab baru (tidak berubah).
   - Auto-redirect saat pertama landing (sessionStorage `payment_url_{slug}`): untuk Duitku, ganti redirect dengan **auto-buka popup POP**; untuk Xendit tetap redirect seperti sekarang.
   - Fallback: jika SDK gagal dimuat atau `duitku_reference` kosong, tombol tetap membuka `duitku_payment_url` di tab baru.

## Catatan Teknis

- `checkout.process` dari Duitku POP SDK menerima `reference` (bukan paymentUrl) — karena itu `duitku_reference` perlu diekspos via `check-order-status`.
- Tidak ada perubahan database, webhook, atau alur callback — `duitku-callback` tetap sumber kebenaran status.
- Deploy ulang `check-order-status` setelah edit.
- Verifikasi: buka order Duitku pending di `/quick-order/:id`, klik tombol → popup Duitku muncul tanpa pindah tab.
