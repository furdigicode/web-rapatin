# Tambah parameter witholdings ke tool expense Kledo

Tool `kledo_create_expense` dan `kledo_update_expense` belum punya parameter `witholdings`, padahal endpoint `/finance/expenses` mendukungnya (contoh: potongan withholding untuk biaya QRIS seperti OR5604). Bank transaction sudah punya pola yang sama.

## Perubahan

File: `supabase/functions/_shared/kledo-mcp-tools.ts`

1. **`kledo_create_expense`** (skema sekitar baris 250–322):
   - Tambah properti `witholdings` (array of object, opsional) dengan field:
     - `witholding_account_id` (integer) — akun withholding
     - `witholding_amount` (number) — nominal potongan
     - `witholding_percent` (number) — persen potongan
   - Ketiga field wajib di dalam tiap item array (sama seperti pola di bank transaction).
   - Deskripsi menyebutkan contoh kasus: potongan biaya QRIS dengan `witholding_percent: 0`.
2. **`kledo_update_expense`** (skema baris 859–887): tambah properti `witholdings` yang sama, opsional.
3. **Handler** (baris 1053–1075): tambahkan `"witholdings"` ke daftar `pick()` pada `kledo_create_expense` dan `kledo_update_expense` agar nilainya ikut terkirim ke `POST`/`PUT /finance/expenses`.

Field bersifat opsional — panggilan yang sudah ada tidak berubah.

## Verifikasi

- `npx tsgo --noEmit -p tsconfig.app.json` bersih.
- Deploy `mcp-rapatin`, cek lewat `tools/list` bahwa kedua tool menampilkan parameter `witholdings`.
