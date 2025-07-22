
-- Add RLS policies for admin users to manage blog categories
CREATE POLICY "Admin users can insert blog categories" 
ON public.blog_categories 
FOR INSERT 
USING (is_admin_user());

CREATE POLICY "Admin users can update blog categories" 
ON public.blog_categories 
FOR UPDATE 
USING (is_admin_user());

CREATE POLICY "Admin users can delete blog categories" 
ON public.blog_categories 
FOR DELETE 
USING (is_admin_user());
