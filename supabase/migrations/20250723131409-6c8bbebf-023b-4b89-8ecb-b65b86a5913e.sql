
-- Create a storage bucket for blog cover images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-covers',
  'blog-covers',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create policy to allow public read access
CREATE POLICY "Public read access for blog covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-covers');

-- Create policy to allow admin users to upload blog covers
CREATE POLICY "Admin users can upload blog covers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-covers' AND is_admin_user());

-- Create policy to allow admin users to update blog covers
CREATE POLICY "Admin users can update blog covers"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-covers' AND is_admin_user());

-- Create policy to allow admin users to delete blog covers
CREATE POLICY "Admin users can delete blog covers"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-covers' AND is_admin_user());
