-- Create improved admin authentication function
CREATE OR REPLACE FUNCTION public.is_custom_admin_user()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  admin_session_exists boolean := false;
  current_user_email text;
BEGIN
  -- Get the current user's email from auth.jwt()
  current_user_email := auth.jwt() ->> 'email';
  
  -- If no email found in JWT, return false
  IF current_user_email IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user exists in admin_users table and is active
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = current_user_email 
    AND is_active = true
  ) THEN
    RETURN false;
  END IF;
  
  -- Check if there's an active session for this admin user
  SELECT EXISTS (
    SELECT 1 FROM public.admin_sessions s
    JOIN public.admin_users a ON s.admin_id = a.id
    WHERE a.email = current_user_email
    AND s.expires_at > now()
  ) INTO admin_session_exists;
  
  RETURN admin_session_exists;
EXCEPTION WHEN OTHERS THEN
  RETURN false;
END;
$$;

-- Update existing data to fix null target_url values
UPDATE public.article_notifications 
SET target_url = CASE 
  WHEN blog_post_id IS NOT NULL THEN '/blog/' || (
    SELECT slug FROM public.blog_posts WHERE id = blog_post_id LIMIT 1
  )
  ELSE '#'
END
WHERE target_url IS NULL;

-- Drop existing policies
DROP POLICY IF EXISTS "Admin users can manage notifications" ON public.article_notifications;
DROP POLICY IF EXISTS "Public read access for notifications" ON public.article_notifications;

-- Create new improved policies
CREATE POLICY "Custom admin users can manage notifications" 
ON public.article_notifications 
FOR ALL 
USING (public.is_custom_admin_user());

CREATE POLICY "Public read access for notifications" 
ON public.article_notifications 
FOR SELECT 
USING (true);