ALTER TABLE public.guest_orders
  ADD COLUMN IF NOT EXISTS payment_gateway text NOT NULL DEFAULT 'xendit',
  ADD COLUMN IF NOT EXISTS duitku_reference text,
  ADD COLUMN IF NOT EXISTS duitku_merchant_order_id text,
  ADD COLUMN IF NOT EXISTS duitku_payment_url text,
  ADD COLUMN IF NOT EXISTS duitku_payment_code text,
  ADD COLUMN IF NOT EXISTS duitku_fee integer;

CREATE INDEX IF NOT EXISTS guest_orders_duitku_merchant_order_id_idx
  ON public.guest_orders (duitku_merchant_order_id);