# Fix Kledo bank_account_id for Duitku orders

## Problem
For Duitku orders, the Kledo bank transaction should receive money into the Duitku cash account (`bank_account_id: 1463`) while the revenue line item (`finance_account_id`) stays `121` for both gateways. Currently the code overrides `finance_account_id` to `1463` and always sends `bank_account_id: 1`, which is wrong.

## Changes (all in `supabase/functions/kledo-sync/index.ts`)

1. **`KLEDO_BANK_TRANS_DUITKU`** — override `bank_account_id: 1463` instead of `finance_account_id: 1463`. The `finance_account_id` stays `121` for both Xendit and Duitku.

2. **`createBankTransaction`** — add a `bankAccountId` parameter and use it in the request body's `bank_account_id` field instead of the hardcoded `KLEDO_BANK_TRANS.bank_account_id`.

3. **Call site** (line ~459) — pass both `bankTransConfig.bank_account_id` and `bankTransConfig.finance_account_id` to `createBankTransaction`.

## Result
- Xendit orders: `bank_account_id = 1`, `finance_account_id = 121` (unchanged)
- Duitku orders: `bank_account_id = 1463`, `finance_account_id = 121`

Redeploy `kledo-sync` after editing.
