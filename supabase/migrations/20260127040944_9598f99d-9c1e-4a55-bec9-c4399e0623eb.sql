-- Add meeting configuration columns to guest_orders table
ALTER TABLE public.guest_orders
ADD COLUMN meeting_topic text,
ADD COLUMN custom_passcode text,
ADD COLUMN is_meeting_registration boolean DEFAULT false,
ADD COLUMN is_meeting_qna boolean DEFAULT false,
ADD COLUMN is_language_interpretation boolean DEFAULT false,
ADD COLUMN is_mute_upon_entry boolean DEFAULT false,
ADD COLUMN is_req_unmute_permission boolean DEFAULT false;