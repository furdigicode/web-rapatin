-- Create blog categories table
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Admin',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at TIMESTAMP WITH TIME ZONE,
  seo_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog categories (readable by everyone)
CREATE POLICY "Blog categories are viewable by everyone" 
ON public.blog_categories 
FOR SELECT 
USING (true);

-- Create policies for blog posts
CREATE POLICY "Published blog posts are viewable by everyone" 
ON public.blog_posts 
FOR SELECT 
USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage blog posts" 
ON public.blog_posts 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default blog categories
INSERT INTO public.blog_categories (name, description) VALUES
  ('Tips & Tricks', 'Tips dan trik seputar video conference'),
  ('Tutorial', 'Tutorial dan panduan penggunaan'),
  ('Berita', 'Berita dan update terbaru'),
  ('Fitur Baru', 'Informasi fitur-fitur terbaru'),
  ('Best Practices', 'Praktik terbaik dalam video conference');

-- Insert sample blog posts
INSERT INTO public.blog_posts (
  title, 
  slug, 
  excerpt, 
  content, 
  cover_image, 
  category, 
  author, 
  status,
  published_at,
  seo_title,
  meta_description,
  focus_keyword
) VALUES
(
  'Tips Efektif Menggunakan Video Conference untuk Bisnis',
  'tips-efektif-video-conference-bisnis',
  'Pelajari tips dan trik untuk memaksimalkan penggunaan video conference dalam bisnis Anda',
  '<h2>Pendahuluan</h2><p>Video conference telah menjadi bagian integral dari dunia bisnis modern. Dengan teknologi yang terus berkembang, kini kita dapat melakukan meeting dengan kualitas HD dan fitur-fitur canggih.</p><h2>Tips Utama</h2><ul><li>Pastikan koneksi internet stabil</li><li>Gunakan pencahayaan yang baik</li><li>Pilih background yang profesional</li><li>Test audio dan video sebelum meeting</li></ul><h2>Kesimpulan</h2><p>Dengan menerapkan tips ini, meeting video conference Anda akan lebih efektif dan profesional.</p>',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=627&fit=crop',
  'Tips & Tricks',
  'Admin',
  'published',
  now(),
  'Tips Efektif Video Conference - Panduan Lengkap Bisnis',
  'Panduan lengkap tips dan trik menggunakan video conference untuk bisnis. Tingkatkan produktivitas meeting online Anda.',
  'video conference bisnis'
),
(
  'Cara Mengatur Pencahayaan Terbaik untuk Video Call',
  'cara-mengatur-pencahayaan-video-call',
  'Pencahayaan yang tepat dapat membuat Anda terlihat profesional dalam video call',
  '<h2>Mengapa Pencahayaan Penting?</h2><p>Pencahayaan yang baik adalah kunci utama untuk tampil profesional dalam video call. Dengan pencahayaan yang tepat, wajah Anda akan terlihat jelas dan natural.</p><h2>Teknik Pencahayaan</h2><ul><li>Gunakan cahaya natural dari jendela</li><li>Posisikan lampu di depan wajah</li><li>Hindari backlight atau cahaya dari belakang</li><li>Gunakan ring light untuk hasil optimal</li></ul><p>Dengan mengikuti tips ini, Anda akan selalu tampil terbaik dalam setiap video call.</p>',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=627&fit=crop',
  'Tutorial',
  'Admin',
  'published',
  now(),
  'Cara Mengatur Pencahayaan Video Call - Tutorial Lengkap',
  'Tutorial lengkap mengatur pencahayaan terbaik untuk video call. Tips profesional untuk tampil sempurna dalam meeting online.',
  'pencahayaan video call'
);