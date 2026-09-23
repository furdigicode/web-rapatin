# Parameter pay_from_finance_account_id di tool expense Kledo

Koreksi: parameter `witholdings` TIDAK ditambahkan. Yang dibutuhkan adalah `pay_from_finance_account_id`.

## Temuan (sudah diverifikasi di kode)

`pay_from_finance_account_id` **sudah ada** di kedua tool di `supabase/functions/_shared/kledo-mcp-tools.ts`:

- `kledo_create_expense` (baris 258–262): integer, deskripsi "Payment source. 1 = Xendit.", default 1 — termasuk di `required` dan di daftar `pick()` handler `POST /finance/expenses` (baris 1057).
- `kledo_update_expense` (baris 864): integer, deskripsi "Payment source. 1 = Xendit, 1463 = Duitku.", default 1 — termasuk di `required` dan `pick()` handler `PUT /finance/expenses/{id}` (baris 1068).

Jadi raw body contoh Anda (`pay_from_finance_account_id: 1`) sudah diteruskan apa adanya ke Kledo.

## Perubahan

1. Perjelas deskripsi `pay_from_finance_account_id` di `kledo_create_expense` agar konsisten dengan versi update: "Payment source. 1 = Xendit, 1463 = Duitku."
2. Tidak ada penambahan `witholdings`.
3. Deploy ulang `mcp-rapatin`.

## Verifikasi

- `npx tsgo --noEmit -p tsconfig.app.json` bersih.
- `tools/list` menampilkan `pay_from_finance_account_id` pada kedua tool expense.
