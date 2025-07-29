-- Add target_url column to article_notifications table
ALTER TABLE public.article_notifications 
ADD COLUMN target_url TEXT;

-- For existing custom notifications, migrate image_url to target_url if it looks like a URL
UPDATE public.article_notifications 
SET target_url = image_url,
    image_url = NULL
WHERE notification_type = 'custom' 
  AND image_url IS NOT NULL 
  AND (image_url LIKE 'http%' OR image_url LIKE '/%');