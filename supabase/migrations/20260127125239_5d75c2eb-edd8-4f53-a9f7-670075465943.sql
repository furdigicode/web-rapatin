-- Add xendit_reference_id column to guest_orders for matching payment.capture webhook
ALTER TABLE public.guest_orders 
ADD COLUMN xendit_reference_id text;