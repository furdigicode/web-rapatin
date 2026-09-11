# Fix Kledo expense `pay_from_finance_account_id` for Duitku orders

## Problem
The MDR expense (`createExpense`) currently always pays from `pay_from_finance_account_id: 1` for every gateway. For Duitku orders, the MDR fee should be paid out of the Duitku cash account — i.e. `pay_from_finance_account_id: 1463` — matching the bank transaction destination for Duitku. Xendit stays at `1`.

## Changes (all in `supabase/functions/kledo-sync/index.ts`)

1. **Add `KLEDO_EXPENSE_DUITKU`** constant after `KLEDO_EXPENSE`:
   ```ts
   const KLEDO_EXPENSE_DUITKU = {
     ...KLEDO_EXPENSE,
     pay_from_finance_account_id: 1463, // Akun kas Duitku
   };
   ```

2. **`createExpense`** — add a `payFromFinanceAccountId` parameter and use it in the request body's `pay_from_finance_account_id` field instead of the hardcoded `KLEDO_EXPENSE.pay_from_finance_account_id`.

3. **Call sites** (line ~512 initial, line ~550 retry) — select the expense config based on `order.payment_gateway === 'duitku'` and pass its `pay_from_finance_account_id` to `createExpense`.

## Result
- Xendit orders: expense `pay_from_finance_account_id = 1` (unchanged)
- Duitku orders: expense `pay_from_finance_account_id = 1463`

Redeploy `kledo-sync` after editing.
