# Kledo: Account ID berbeda untuk order Duitku

Saat ini `kledo-sync` memakai `KLEDO_BANK_TRANS.finance_account_id` (121) untuk semua order. Order yang dibayar via Duitku harus dicatat ke akun Kledo **1463**.

## Yang Dibangun

1. **`supabase/functions/kledo-sync/index.ts`**
   - Tambah konstanta `KLEDO_BANK_TRANS_DUITKU = { ...KLEDO_BANK_TRANS, finance_account_id: 1463 }`.
   - Ubah `createBankTransaction` agar menerima parameter `financeAccountId` (menggantikan nilai konstanta hardcode).
   - Di handler, pilih account id berdasarkan `order.payment_gateway`:
     - `'duitku'` → `1463`
     - lainnya (Xendit) → `121` (tetap seperti sekarang)
   - Bagian expense/MDR tidak berubah — Duitku tetap memakai `duitku_fee` dari callback.

## Catatan Teknis

- Tidak ada perubahan database.
- Tidak ada perubahan UI.
- Deploy ulang `kledo-sync` setelah edit.
