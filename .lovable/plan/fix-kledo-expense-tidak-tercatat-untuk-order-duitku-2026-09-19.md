# Fix Kledo expense tidak tercatat untuk order Duitku

## Masalah
Duitku callback (notification) **tidak mengirim field fee** di payload-nya. Hanya ada: `merchantOrderId`, `amount`, `merchantCode`, `productDetails`, `paymentCode`, `resultCode`, `reference`, `signature`, dll. Karena `duitku-callback` mencoba ekstrak `body.fee ?? body.totalFee ?? body.amountFee` — semuanya `undefined` — maka `duitku_fee` selalu `NULL`.

Saat `kledo-sync` jalan, `Number(null) || 0 = 0`, dan karena `fee <= 0`, expense (biaya MDR) **diskip total** (lines 497–516). Hasilnya: di Kledo hanya tercatat Terima Dana, tanpa expense.

Database membuktikan: semua 3 order Duitku yang sudah paid memiliki `duitku_fee = NULL`.

## Solusi

### 1. Tambah `checkDuitkuTransaction` di `_shared/duitku.ts`
Panggil Duitku Check Transaction API untuk mendapat fee asli:
- **Endpoint (production):** `https://passport.duitku.com/webapi/api/merchant/transactionStatus`
- **Endpoint (sandbox):** `https://sandbox.duitku.com/webapi/api/merchant/transactionStatus`
- **Method:** POST, Content-Type: application/json
- **Body:** `{ merchantcode, merchantOrderId, signature }` — signature = `MD5(merchantCode + merchantOrderId + apiKey)`
- **Response:** `{ merchantOrderId, reference, amount, fee, statusCode, statusMessage }`

Fungsi mengembalikan `{ fee: number | null }` — fee di-parse dari string ke integer (Math.round).

### 2. Update `duitku-callback/index.ts`
Setelah pembayaran dikonfirmasi (`resultCode === '00'`), sebelum memanggil `processPaidOrder`:
- Panggil `checkDuitkuTransaction(merchantOrderId)`
- Jika dapat fee, simpan ke `gatewayUpdate.duitku_fee`
- Jika gagal, log warning dan biarkan `duitku_fee` null (kledo-sync akan skip expense — sama seperti sekarang)

### 3. Re-sync 3 order Duitku yang sudah tercatat tanpa expense
3 order ini sudah punya `kledo_invoice_id` (BANK/04371, BANK/04328, BANK/04324), jadi `kledo-sync` skip karena idempotency. Untuk menambahkan expense yang hilang:
- Fetch fee via Check Transaction API untuk ketiga order
- Buat expense manual via MCP `kledo_create_expense` dengan `pay_from_finance_account_id: 1463` dan `finance_account_id: 1459`
- Ini dilakukan setelah code fix di-deploy, sebagai one-off manual sync

## File yang diubah
1. `supabase/functions/_shared/duitku.ts` — tambah `checkDuitkuTransaction` + export `DUITKU_LEGACY_BASE_URL`
2. `supabase/functions/duitku-callback/index.ts` — panggil check transaction setelah konfirmasi pembayaran

## Deploy
- `duitku-callback` (setelah edit)
- Tidak perlu deploy `kledo-sync` (tidak berubah)

## Hasil yang diharapkan
- Order Duitku baru: callback fetch fee asli dari Duitku → `duitku_fee` terisi → `kledo-sync` mencatat expense dengan nilai asli
- 3 order lama: expense ditambahkan manual via MCP
