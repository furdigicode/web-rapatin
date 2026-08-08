# Perbaiki Xendit MCP: 403 REQUEST_FORBIDDEN_ERROR

## Temuan

Log edge function `mcp-rapatin` (8 Agu 08:32 UTC) menunjukkan panggilan tool berhasil sampai ke Xendit, tapi Xendit menolaknya:

```text
GET /balance      -> 403 REQUEST_FORBIDDEN_ERROR
GET /transactions -> 403 REQUEST_FORBIDDEN_ERROR
"The API key is forbidden to perform this request... adjust your API key permission
accordingly in the Dashboard"
```

Artinya: kode MCP, autentikasi Basic Auth, dan routing tool sudah benar (kalau key salah, Xendit menjawab 401, bukan 403). Yang kurang adalah **permission pada API key Xendit** yang tersimpan di secret `XENDIT_SECRET_KEY`. Key itu sekarang dipakai juga untuk membuat pembayaran (`xendit-webhook` / order), jadi kemungkinan besar hanya punya izin Money-in, bukan Balance & Transaction.

## Yang perlu Anda lakukan di Dashboard Xendit

Settings > Developers > API Keys, lalu pada key yang dipakai (atau buat key baru):

- **Balance** = READ (atau VIEW)
- **Transactions / Transaction list** = READ
- **Reports** = READ + WRITE (hanya jika ingin memakai `xendit_generate_report`)

Biarkan izin Money-in/Invoice yang sudah ada tetap seperti sekarang supaya alur pembayaran tidak rusak.

## Yang saya lakukan (secret baru khusus read)

1. Minta Anda memasukkan API key Xendit read-only baru lewat form aman, disimpan sebagai secret `XENDIT_READ_SECRET_KEY`. Key lama `XENDIT_SECRET_KEY` tetap utuh untuk alur pembayaran.
2. `supabase/functions/_shared/xendit.ts`: baca `XENDIT_READ_SECRET_KEY` lebih dulu, fallback ke `XENDIT_SECRET_KEY` bila belum diisi.
3. Deploy ulang `mcp-rapatin`, lalu uji `xendit_get_balance` dan `xendit_list_transactions` dan konfirmasi hasilnya.

Key baru dibuat di Dashboard Xendit (Settings > Developers > API Keys) dengan izin: **Balance = READ**, **Transactions = READ**, dan **Reports = READ/WRITE** bila ingin memakai `xendit_generate_report`. Tanpa izin Money-in, jadi key ini tidak bisa membuat pembayaran maupun disbursement.


## Perbaikan pesan error (dilakukan di kedua opsi)

Di `supabase/functions/_shared/xendit-mcp-tools.ts` / `xendit.ts`: saat Xendit mengembalikan 403, kembalikan pesan yang jelas ke agen AI, misalnya "API key Xendit tidak punya izin Balance/Transaction — tambahkan permission READ di Dashboard Xendit", bukan hanya meneruskan JSON mentah. Ini supaya agen tidak menyimpulkan tool-nya rusak.

Tidak ada perubahan database. Alur pembayaran/webhook tidak disentuh.
