-- Tambah kolom order_number
ALTER TABLE public.guest_orders 
ADD COLUMN order_number TEXT UNIQUE;

-- Create function untuk generate order number dengan format INV-YYMMDD-XXXX
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  date_part TEXT;
  max_seq INTEGER;
  new_seq INTEGER;
BEGIN
  -- Format: YYMMDD
  date_part := TO_CHAR(NOW() AT TIME ZONE 'Asia/Jakarta', 'YYMMDD');
  
  -- Cari sequence tertinggi untuk tanggal ini
  SELECT COALESCE(MAX(
    CAST(RIGHT(order_number, 4) AS INTEGER)
  ), 0) INTO max_seq
  FROM public.guest_orders
  WHERE order_number LIKE 'INV-' || date_part || '-%';
  
  new_seq := max_seq + 1;
  
  RETURN 'INV-' || date_part || '-' || LPAD(new_seq::TEXT, 4, '0');
END;
$$;

-- Index untuk performa query
CREATE INDEX idx_guest_orders_order_number 
ON public.guest_orders(order_number);