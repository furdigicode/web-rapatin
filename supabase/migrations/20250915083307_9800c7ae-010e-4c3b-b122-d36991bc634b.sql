-- Add unique constraint to prevent duplicate user_id and notification_id combinations
ALTER TABLE public.user_notification_read_status 
ADD CONSTRAINT unique_user_notification UNIQUE (user_id, notification_id);