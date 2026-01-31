-- Add email_sent_at column to track when confirmation email was sent
ALTER TABLE public.guest_orders 
ADD COLUMN email_sent_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

COMMENT ON COLUMN public.guest_orders.email_sent_at IS 
  'Timestamp when confirmation email was sent';