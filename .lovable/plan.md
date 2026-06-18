## Perbaikan Kolom Phone & Status di Riwayat Webhook KirimChat

### Masalah saat ini
- **Phone** kosong karena payload KirimChat memakai key `customer_phone` (atau variannya) yang belum dipetakan.
- **Status** saat ini mengambil `status` dari payload KirimChat (status pengiriman pesan), padahal yang dimaksud adalah status penerimaan webhook di backend kita (berhasil disimpan / gagal).

### Perubahan

**1. Edge function `supabase/functions/kirimchat-webhook/index.ts`**
- Tambah path baru pada ekstraksi `phone_number`:
  - `customer_phone`, `customer.phone`, `data.customer_phone`, `data.customer.phone`, `payload.customer_phone`
  - (path lama tetap dipertahankan sebagai fallback)
- Hentikan pengisian kolom `status` dari payload KirimChat. Sebagai gantinya, set `status` berdasarkan hasil pemrosesan webhook di backend kita:
  - `received` → payload berhasil di-parse & disimpan
  - `invalid_signature` → 401 (tidak akan tersimpan, tetap dilog)
  - `invalid_json` → 400 (tidak tersimpan)
  - `insert_failed` → gagal simpan ke DB
  
  Karena baris hanya tercipta saat insert sukses, nilai status pada baris yang tersimpan praktis selalu `received`. Untuk tetap menyimpan jejak kegagalan, function akan tetap mencoba menyimpan baris dengan status `invalid_json` ketika body bukan JSON valid (payload disimpan sebagai `{ "_raw": "..." }`), sehingga admin tetap bisa melihatnya di dasbor.
- Status asli dari KirimChat (mis. `delivered`, `read`) tetap tersedia di kolom `payload` (raw) dan tercermin di `event_type` (mis. `message_delivered`).

**2. Halaman admin `src/pages/admin/KirimchatWebhooks.tsx`**
- Ubah label kolom **Status** menjadi **Penerimaan** agar tidak rancu dengan status pesan KirimChat.
- Render badge:
  - `received` → hijau/default
  - `invalid_json` / `insert_failed` → destructive
- Detail dialog: tampilkan "Status Penerimaan" alih-alih "Status".

### Tidak diubah
- Skema tabel `kirimchat_webhook_events` (kolom `status` tetap dipakai, hanya makna isinya berubah).
- Verifikasi HMAC, filter, pagination, dan UI lainnya.

### Verifikasi
- Kirim webhook test dengan `customer_phone` → kolom Phone terisi.
- Baris baru menampilkan badge `received`.
- Kirim body JSON tidak valid → muncul baris `invalid_json`.
