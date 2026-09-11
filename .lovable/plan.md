# Kledo: Account ID berbeda untuk order Duitku + Duitku production

Dua perubahan terkait Duitku: (1) pencatatan Kledo memakai account id 1463 untuk order Duitku, dan (2) Duitku dipindah dari sandbox ke production.

## Yang Dibangun

1. **`supabase/functions/kledo-sync/index.ts` — account id per gateway**
   - Tambah konstanta `KLEDO_BANK_TRANS_DUITKU = { ...KLEDO_BANK_TRANS, finance_account_id: 1463 }`.
   - Ubah `createBankTransaction` agar menerima parameter `financeAccountId` (menggantikan nilai konstanta hardcode).
   - Di handler, pilih account id berdasarkan `order.payment_gateway`:
     - `'duitku'` → `1463`
     - lainnya (Xendit) → `121` (tetap seperti sekarang)
   - Bagian expense/MDR tidak berubah — Duitku tetap memakai `duitku_fee` dari callback.

2. **`supabase/functions/_shared/duitku.ts` — production**
   - Ubah `DUITKU_ENVIRONMENT` dari `'sandbox'` menjadi `'production'` agar base URL mengarah ke `https://api-prod.duitku.com`.

## Catatan Teknis

- Tidak ada perubahan database.
- Tidak ada perubahan UI.
- Deploy ulang `kledo-sync`, `create-guest-order`, dan `duitku-callback` setelah edit (semua memakai `_shared/duitku.ts`).
- Pastikan callback URL `https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1/duitku-callback` sudah terdaftar di dashboard Duitku production.
