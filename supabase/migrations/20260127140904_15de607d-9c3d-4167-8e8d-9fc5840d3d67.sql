-- Add recurring meeting columns to guest_orders table
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT false;
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS recurrence_type integer; -- 1=daily, 2=weekly, 3=monthly
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS repeat_interval integer DEFAULT 1;
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS weekly_days integer[]; -- untuk weekly: 1=Sunday, 2=Monday, etc
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS monthly_day integer; -- untuk monthly: tanggal 1-31
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS monthly_week integer; -- untuk monthly: minggu ke 1-5
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS end_type text; -- 'end_date' atau 'end_after_type'
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS recurrence_end_date date; -- tanggal berakhir
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS recurrence_count integer; -- jumlah pengulangan
ALTER TABLE guest_orders ADD COLUMN IF NOT EXISTS total_days integer DEFAULT 1; -- total hari untuk kalkulasi harga

-- Add comments for documentation
COMMENT ON COLUMN guest_orders.is_recurring IS 'Whether this is a recurring meeting';
COMMENT ON COLUMN guest_orders.recurrence_type IS '1=Daily, 2=Weekly, 3=Monthly';
COMMENT ON COLUMN guest_orders.repeat_interval IS 'Interval between recurrences (e.g., every 2 days)';
COMMENT ON COLUMN guest_orders.weekly_days IS 'For weekly: array of days (1=Sun, 2=Mon, ..., 7=Sat)';
COMMENT ON COLUMN guest_orders.monthly_day IS 'For monthly: day of month (1-31)';
COMMENT ON COLUMN guest_orders.monthly_week IS 'For monthly: week of month (1-5, where 5=last)';
COMMENT ON COLUMN guest_orders.end_type IS 'How recurrence ends: end_date or end_after_type';
COMMENT ON COLUMN guest_orders.recurrence_end_date IS 'End date if end_type=end_date';
COMMENT ON COLUMN guest_orders.recurrence_count IS 'Number of occurrences if end_type=end_after_type';
COMMENT ON COLUMN guest_orders.total_days IS 'Total number of meeting days for pricing';