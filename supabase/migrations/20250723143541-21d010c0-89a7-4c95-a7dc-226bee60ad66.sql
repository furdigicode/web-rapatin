-- Create article_notifications table
CREATE TABLE public.article_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read BOOLEAN DEFAULT false,
  notification_type TEXT DEFAULT 'new_article',
  category TEXT
);

-- Enable Row Level Security
ALTER TABLE public.article_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access for notifications" 
ON public.article_notifications 
FOR SELECT 
USING (true);

-- Create policy for admin management
CREATE POLICY "Admin users can manage notifications" 
ON public.article_notifications 
FOR ALL 
USING (public.is_admin_user());

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.article_notifications;

-- Set replica identity for realtime updates
ALTER TABLE public.article_notifications REPLICA IDENTITY FULL;

-- Create function to handle new article notifications
CREATE OR REPLACE FUNCTION public.handle_new_article_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if article is being published for the first time
  IF (NEW.status = 'published' AND (OLD IS NULL OR OLD.status != 'published')) THEN
    INSERT INTO public.article_notifications (
      blog_post_id, 
      title, 
      excerpt, 
      image_url, 
      category
    ) VALUES (
      NEW.id, 
      NEW.title, 
      NEW.excerpt, 
      NEW.cover_image, 
      NEW.category
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic notification creation
CREATE TRIGGER on_article_published
  AFTER INSERT OR UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_article_notification();