# Duitku sebagai Opsi Pembayaran Kedua di /quick-order

Xendit tetap jalan seperti sekarang. Duitku ditambahkan sebagai pilihan kedua, dipilih user lewat selector di atas tombol "Bayar Sekarang".

Catatan: BengkelApp tidak memakai SNAP v2, tapi Duitku **createInvoice (POP)** — user diarahkan ke halaman pembayaran Duitku dan memilih VA/QRIS/e-wallet di sana. Rapatin akan memakai pola yang sama, mulai di **sandbox**.

## Alur

```text
Form Quick Order
  └─ pilih gateway: [ Xendit ] [ Duitku ]
       └─ create-guest-order (satu fungsi, dua cabang)
            ├─ Xendit  → Sessions v3 → payment_link_url
            └─ Duitku  → createInvoice → paymentUrl
                 └─ simpan order (payment_gateway = 'xendit' | 'duitku')
                      └─ redirect ke /quick-order/{access_slug} → tombol bayar

Pembayaran berhasil
  ├─ xendit-webhook      ┐
  └─ duitku-callback     ┴→ pipeline pasca-bayar yang SAMA
       (buat jadwal Rapatin → email konfirmasi → Kledo → notifikasi WA admin)
```

## Yang Dibangun

1. **Pilihan gateway di UI**
   - Radio card "Xendit" / "Duitku" di panel Ringkasan Order, tepat di atas tombol Bayar Sekarang.
   - Ikon metode di bawahnya menyesuaikan gateway terpilih (Xendit: QRIS/VA/E-Wallet; Duitku: VA/QRIS/E-Wallet/retail).
   - Default tetap Xendit.

2. **Kolom baru di tabel `guest_orders`**
   - `payment_gateway` (text, default `'xendit'`), `duitku_reference`, `duitku_merchant_order_id`, `duitku_payment_url`, `duitku_payment_code`, `duitku_fee` (integer).
   - Order lama otomatis terbaca sebagai Xendit.

3. **`create-guest-order` mendukung dua gateway**
   - Terima parameter `payment_gateway`; seluruh validasi, harga, recurring, nomor invoice, access slug, dan notifikasi admin `new_order` tidak berubah.
   - Cabang Duitku: `POST /api/merchant/createInvoice` dengan header `x-duitku-signature` (SHA-256 dari merchantCode + timestamp + apiKey), `merchantOrderId` = nomor invoice, `callbackUrl` ke fungsi `duitku-callback`, `returnUrl` ke `https://rapatin.id/quick-order/{access_slug}`, expiry 1440 menit.
   - Respons ke frontend tetap seragam (`invoice_url`), jadi halaman detail order tidak perlu tahu gateway-nya.

4. **Fungsi baru `duitku-callback`**
   - Menerima form-urlencoded/JSON dari Duitku, verifikasi signature MD5(merchantCode + amount + merchantOrderId + apiKey), tolak 403 kalau tidak cocok.
   - Idempotent (order `paid` diabaikan), map `resultCode` `00` → paid, lainnya → failed.
   - Simpan `duitku_reference`, `paymentCode`/metode ke `payment_method`, dan `fee` dari callback ke `duitku_fee`.

5. **Refaktor pipeline pasca-bayar jadi shared**
   - Logika pasca-bayar yang sekarang ada di `xendit-webhook` (login + create schedule Rapatin dengan `rapatin_api_log`, retry email, Kledo, notifikasi WA admin, `EdgeRuntime.waitUntil`) dipindah ke `supabase/functions/_shared/post-payment.ts`.
   - `xendit-webhook` dan `duitku-callback` sama-sama memanggilnya, sehingga perilaku order Duitku identik dengan Xendit. Tidak ada perubahan fungsional untuk Xendit.

6. **Kledo: MDR dari callback Duitku**
   - `kledo-sync` memakai `duitku_fee` dari callback bila order-nya Duitku (tanpa tarif hardcode), dan tetap memakai perhitungan MDR Xendit yang ada untuk order Xendit. Kalau `duitku_fee` kosong/0, entri beban MDR dilewati dan dicatat di log.

7. **Admin**
   - Dialog detail order menampilkan gateway yang dipakai + referensi Duitku, dan tombol "Buka Link Pembayaran" mengikuti gateway order tersebut.
   - Fungsi regenerate jadwal Rapatin tetap bekerja untuk kedua gateway.

## Yang Dibutuhkan dari Anda

Dua secret Duitku sandbox (saya minta lewat form aman setelah rencana disetujui):
- `DUITKU_MERCHANT_CODE`
- `DUITKU_API_KEY`

Setelah deploy, URL callback yang perlu didaftarkan di dashboard Duitku:
`https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1/duitku-callback`

## Catatan Teknis

- `duitku-callback` dideploy dengan `verify_jwt = false` karena dipanggil server Duitku.
- Base URL sandbox `https://api-sandbox.duitku.com`, production `https://api-prod.duitku.com`, dipilih lewat konstanta environment sehingga pindah ke live hanya satu baris.
- Pencarian order dari callback memakai `duitku_merchant_order_id`, terpisah dari `xendit_invoice_id`, jadi tidak ada risiko tabrakan antar gateway.
