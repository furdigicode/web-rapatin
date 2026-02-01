-- Add whatsapp_sent_at column for rate limiting WhatsApp notifications
ALTER TABLE public.guest_orders 
ADD COLUMN IF NOT EXISTS whatsapp_sent_at TIMESTAMPTZ DEFAULT NULL;