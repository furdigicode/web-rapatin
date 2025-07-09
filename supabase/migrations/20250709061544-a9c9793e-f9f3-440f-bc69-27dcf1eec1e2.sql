
-- Create authors table
CREATE TABLE public.authors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}',
  specialization TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

-- Create policies for authors
CREATE POLICY "Authors are viewable by everyone" 
ON public.authors 
FOR SELECT 
USING (true);

CREATE POLICY "Admin users can manage authors" 
ON public.authors 
FOR ALL 
USING (is_admin_user());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_authors_updated_at
BEFORE UPDATE ON public.authors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for slug lookups
CREATE INDEX idx_authors_slug ON public.authors(slug);
CREATE INDEX idx_authors_active ON public.authors(is_active);

-- Insert default admin author for existing articles
INSERT INTO public.authors (name, slug, email, bio, specialization, is_active) 
VALUES (
  'Admin', 
  'admin', 
  'admin@rapatin.com', 
  'Administrator dan penulis utama RapatIn. Berpengalaman dalam teknologi meeting dan video conference.', 
  'Technology & Business', 
  true
);

-- Add new author_id column to blog_posts
ALTER TABLE public.blog_posts 
ADD COLUMN author_id UUID REFERENCES public.authors(id);

-- Update existing blog_posts to reference the admin author
UPDATE public.blog_posts 
SET author_id = (SELECT id FROM public.authors WHERE slug = 'admin' LIMIT 1)
WHERE author_id IS NULL;

-- Make author_id required after data migration
ALTER TABLE public.blog_posts 
ALTER COLUMN author_id SET NOT NULL;

-- Create index for author lookups
CREATE INDEX idx_blog_posts_author_id ON public.blog_posts(author_id);
