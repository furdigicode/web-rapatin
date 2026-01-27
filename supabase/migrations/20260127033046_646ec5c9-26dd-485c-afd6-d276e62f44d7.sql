-- Create guest_orders table for Quick Order feature
CREATE TABLE public.guest_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  meeting_date DATE NOT NULL,
  participant_count INTEGER NOT NULL,
  price INTEGER NOT NULL,
  payment_method TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  xendit_invoice_id TEXT,
  xendit_invoice_url TEXT,
  rapatin_order_id TEXT,
  zoom_link TEXT,
  zoom_passcode TEXT,
  meeting_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE,
  expired_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.guest_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can create an order (for guest checkout)
CREATE POLICY "Anyone can create guest orders"
ON public.guest_orders
FOR INSERT
WITH CHECK (true);

-- Guests can view their own orders by ID (no auth required, controlled by edge function)
CREATE POLICY "Anyone can view orders by id"
ON public.guest_orders
FOR SELECT
USING (true);

-- Admin users can manage all orders
CREATE POLICY "Admin users can manage guest orders"
ON public.guest_orders
FOR ALL
USING (is_admin_user());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_guest_orders_updated_at
BEFORE UPDATE ON public.guest_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_guest_orders_xendit_invoice_id ON public.guest_orders(xendit_invoice_id);
CREATE INDEX idx_guest_orders_email ON public.guest_orders(email);
CREATE INDEX idx_guest_orders_payment_status ON public.guest_orders(payment_status);