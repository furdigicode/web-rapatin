-- Add word_count column to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN word_count integer DEFAULT 0;