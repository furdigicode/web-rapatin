-- Create admin role check function
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean AS $$
BEGIN
  -- Check if current user is in admin_users table
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = auth.jwt() ->> 'email' 
    AND is_active = true
  );
EXCEPTION WHEN OTHERS THEN
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update blog_posts RLS policies to allow admin operations
DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON public.blog_posts;

-- Allow everyone to view published posts
CREATE POLICY "Published blog posts are viewable by everyone" 
ON public.blog_posts 
FOR SELECT 
USING (status = 'published' OR public.is_admin_user());

-- Allow admin users to manage all blog posts
CREATE POLICY "Admin users can manage blog posts" 
ON public.blog_posts 
FOR ALL 
USING (public.is_admin_user());

-- Update admin_users RLS policies
DROP POLICY IF EXISTS "Only authenticated admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Only authenticated admins can update admin users" ON public.admin_users;

CREATE POLICY "Admin users can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (public.is_admin_user());

CREATE POLICY "Admin users can update admin users" 
ON public.admin_users 
FOR UPDATE 
USING (public.is_admin_user());

-- Update admin_sessions RLS policies  
DROP POLICY IF EXISTS "Admins can manage their own sessions" ON public.admin_sessions;

CREATE POLICY "Admin users can manage sessions" 
ON public.admin_sessions 
FOR ALL 
USING (public.is_admin_user());