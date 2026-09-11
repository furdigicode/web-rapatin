# Fix: Duitku payment button missing on `/quick-order/:id` (unpaid state)

## Problem
For Xendit orders, the unpaid `/quick-order/:id` page shows a "Lanjutkan Pembayaran" button linking to the Xendit invoice URL. For Duitku orders, the button is missing on revisit.

Root cause: `supabase/functions/check-order-status/index.ts` does not select or return `payment_gateway` or `duitku_payment_url`. The frontend (`QuickOrderDetail.tsx`) already computes `paymentUrl` from these fields (lines 550-553), but the API never sends them — so for Duitku orders `paymentUrl` is `null` and the button doesn't render. The auto-redirect on first landing works (via `sessionStorage`), but if the user closes the tab and returns later, there is no button.

## Changes

### 1. `supabase/functions/check-order-status/index.ts`
- Add `payment_gateway`, `duitku_payment_url` to the `.select(...)` column list (line 35).
- Add `payment_gateway: order.payment_gateway`, `duitku_payment_url: order.duitku_payment_url` to the response `order` object (after `xendit_invoice_url`).

### 2. No frontend changes needed
`QuickOrderDetail.tsx` already has the `payment_gateway` and `duitku_payment_url` fields in its `OrderDetails` interface (lines 63-64) and already selects the correct URL (lines 550-553). Once the API returns the fields, the "Lanjutkan Pembayaran" button will appear for Duitku orders.

## Result
- Xendit unpaid orders: button links to `xendit_invoice_url` (unchanged)
- Duitku unpaid orders: button links to `duitku_payment_url` (now visible on revisit)

Redeploy `check-order-status` after editing.
