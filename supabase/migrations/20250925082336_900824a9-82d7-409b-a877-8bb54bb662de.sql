-- Add send_notification column to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN send_notification boolean NOT NULL DEFAULT true;

-- Update the trigger function to check send_notification flag
CREATE OR REPLACE FUNCTION public.handle_new_article_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only create notification if article is being published for the first time AND send_notification is true
  IF (NEW.status = 'published' AND (OLD IS NULL OR OLD.status != 'published') AND NEW.send_notification = true) THEN
    INSERT INTO public.article_notifications (
      blog_post_id, 
      title, 
      excerpt, 
      image_url, 
      category,
      target_url
    ) VALUES (
      NEW.id, 
      NEW.title, 
      NEW.excerpt, 
      NEW.cover_image, 
      NEW.category,
      'https://rapatin.id/blog/' || NEW.slug
    );
  END IF;
  RETURN NEW;
END;
$function$;