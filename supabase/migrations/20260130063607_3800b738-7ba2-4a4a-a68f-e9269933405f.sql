-- Add Kledo tracking columns to guest_orders table
ALTER TABLE public.guest_orders
ADD COLUMN IF NOT EXISTS kledo_invoice_id text,
ADD COLUMN IF NOT EXISTS kledo_synced_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS kledo_sync_error text;