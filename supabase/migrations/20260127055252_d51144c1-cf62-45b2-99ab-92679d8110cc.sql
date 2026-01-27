-- Add access_slug column to guest_orders table
ALTER TABLE guest_orders 
ADD COLUMN access_slug TEXT UNIQUE;

-- Create unique index for fast lookups
CREATE UNIQUE INDEX idx_guest_orders_access_slug ON guest_orders(access_slug) WHERE access_slug IS NOT NULL;