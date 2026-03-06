

# Notifikasi WhatsApp Admin untuk Order Baru

## Ringkasan
Membuat sistem notifikasi WhatsApp otomatis ke admin setiap ada order baru (pending) dan saat pembayaran berhasil (paid), menggunakan KirimChat dengan pesan teks biasa.

## Perubahan

### 1. Edge Function baru: `supabase/functions/notify-admin-order/index.ts`
- Kirim pesan teks biasa via KirimChat ke nomor admin yang di-hardcode
- Menerima parameter: `order_id` dan `event_type` (`new_order` | `payment_success`)
- **Pesan order baru (pending):**
  ```
  🔔 ORDER BARU #INV-260306-0001

  Nama: Yayasan Sadar Hati
  Email: info@yadahi.org
  WA: 08123456789
  Topik: Training Digital Marketing
  Tanggal: 4 Maret 2026, 13:00 WIB
  Peserta: 100 orang
  Harga: Rp 25.000

  Status: Menunggu Pembayaran
  ```
- **Pesan payment success:**
  ```
  ✅ PEMBAYARAN BERHASIL #INV-260306-0001

  Nama: Yayasan Sadar Hati
  Topik: Training Digital Marketing
  Tanggal: 4 Maret 2026, 13:00 WIB
  Total: Rp 25.000
  Metode: QRIS

  Link Admin: https://rapatin.lovable.app/admin/orders
  ```

### 2. `supabase/functions/create-guest-order/index.ts`
- Setelah order berhasil disimpan ke database, tambahkan fire-and-forget call ke `notify-admin-order` dengan `event_type: 'new_order'`

### 3. `supabase/functions/xendit-webhook/index.ts`
- Setelah status berubah ke `paid`, tambahkan fire-and-forget call ke `notify-admin-order` dengan `event_type: 'payment_success'`

### 4. `supabase/config.toml`
- Tambahkan config untuk function baru: `verify_jwt = false`

## Detail Teknis

| File | Perubahan |
|------|-----------|
| `notify-admin-order/index.ts` | Edge function baru, kirim WA teks biasa ke admin via KirimChat |
| `create-guest-order/index.ts` | Tambah fire-and-forget trigger notifikasi admin |
| `xendit-webhook/index.ts` | Tambah fire-and-forget trigger notifikasi admin |
| `supabase/config.toml` | Tambah config function baru |

Secret yang digunakan: `KIRIMCHAT_API_KEY` (sudah ada).

