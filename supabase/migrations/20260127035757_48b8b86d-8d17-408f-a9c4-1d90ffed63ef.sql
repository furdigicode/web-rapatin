-- Add meeting_time column to guest_orders table
ALTER TABLE public.guest_orders 
ADD COLUMN meeting_time text;