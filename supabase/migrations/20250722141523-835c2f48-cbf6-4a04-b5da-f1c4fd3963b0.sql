
-- Update the is_admin_user function to work with our custom admin authentication
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean AS $$
DECLARE
  current_user_email text;
  admin_session_exists boolean := false;
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the existing RLS policies for blog_categories are properly set up
-- First drop existing policies if they exist
DROP POLICY IF EXISTS "Admin users can insert blog categories" ON public.blog_categories;
DROP POLICY IF EXISTS "Admin users can update blog categories" ON public.blog_categories;
DROP POLICY IF EXISTS "Admin users can delete blog categories" ON public.blog_categories;

-- Create the proper RLS policies for admin category management
CREATE POLICY "Admin users can insert blog categories" 
ON public.blog_categories 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin_user());

CREATE POLICY "Admin users can update blog categories" 
ON public.blog_categories 
FOR UPDATE 
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

CREATE POLICY "Admin users can delete blog categories" 
ON public.blog_categories 
FOR DELETE 
TO authenticated
USING (public.is_admin_user());
