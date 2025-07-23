-- Update function to fix security warnings by setting search_path
CREATE OR REPLACE FUNCTION public.handle_new_article_notification()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
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
$$;