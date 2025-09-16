-- Update the handle_new_article_notification function to include target_url with full domain
CREATE OR REPLACE FUNCTION public.handle_new_article_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only create notification if article is being published for the first time
  IF (NEW.status = 'published' AND (OLD IS NULL OR OLD.status != 'published')) THEN
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

-- Update existing notifications that have relative URLs to use full URLs
UPDATE public.article_notifications 
SET target_url = 'https://rapatin.id' || target_url 
WHERE target_url IS NOT NULL 
AND target_url LIKE '/blog/%';