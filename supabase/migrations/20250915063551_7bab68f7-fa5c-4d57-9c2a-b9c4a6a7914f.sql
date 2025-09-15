-- Create table for per-user notification read status
CREATE TABLE public.user_notification_read_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Using TEXT to support both authenticated users and anonymous users
  notification_id UUID NOT NULL REFERENCES public.article_notifications(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, notification_id)
);

-- Enable RLS
ALTER TABLE public.user_notification_read_status ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own read status
CREATE POLICY "Users can view their own read status" 
ON public.user_notification_read_status 
FOR SELECT 
USING (true); -- Allow reading for tracking purposes

CREATE POLICY "Users can insert their own read status" 
ON public.user_notification_read_status 
FOR INSERT 
WITH CHECK (true); -- Allow inserting for tracking purposes

CREATE POLICY "Admin users can manage all read status" 
ON public.user_notification_read_status 
FOR ALL 
USING (is_custom_admin_user());

-- Create index for better performance
CREATE INDEX idx_user_notification_read_status_user_id ON public.user_notification_read_status(user_id);
CREATE INDEX idx_user_notification_read_status_notification_id ON public.user_notification_read_status(notification_id);