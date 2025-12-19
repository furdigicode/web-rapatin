-- Add popup notification columns to article_notifications table
ALTER TABLE public.article_notifications
ADD COLUMN IF NOT EXISTS button_text text,
ADD COLUMN IF NOT EXISTS button_url text,
ADD COLUMN IF NOT EXISTS display_frequency text DEFAULT 'once',
ADD COLUMN IF NOT EXISTS show_close_button boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS priority integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS popup_view_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS popup_click_count integer DEFAULT 0;

-- Add comment for clarity
COMMENT ON COLUMN public.article_notifications.display_frequency IS 'once | every_visit | every_session';
COMMENT ON COLUMN public.article_notifications.notification_type IS 'new_article | custom | popup';