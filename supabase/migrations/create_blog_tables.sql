-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT REFERENCES blog_categories(name),
  author TEXT DEFAULT 'Admin',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at TIMESTAMP WITH TIME ZONE,
  seo_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO blog_categories (name, slug, description) VALUES
  ('Tutorial', 'tutorial', 'Panduan step-by-step untuk menggunakan platform meeting online'),
  ('Tips & Tricks', 'tips-tricks', 'Tips dan trik untuk meeting online yang lebih efektif'),
  ('Berita', 'berita', 'Berita terbaru dan update platform'),
  ('Produktivitas', 'produktivitas', 'Tips meningkatkan produktivitas dalam meeting virtual')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample blog post
INSERT INTO blog_posts (
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
) VALUES (
  '5 Tips Efektif untuk Meeting Online yang Produktif',
  '5-tips-efektif-meeting-online-produktif',
  'Pelajari 5 tips terbaik untuk membuat meeting online Anda lebih produktif dan efisien. Dari persiapan hingga follow-up yang tepat.',
  '<h2>Meeting Online yang Lebih Produktif</h2>

<p>Meeting online telah menjadi bagian integral dari kehidupan kerja modern. Namun, tidak semua meeting online berjalan dengan efektif. Berikut adalah 5 tips yang dapat membantu Anda membuat meeting online yang lebih produktif:</p>

<h3>1. Persiapan yang Matang</h3>
<p>Sebelum meeting dimulai, pastikan Anda telah:</p>
<ul>
<li>Menyiapkan agenda yang jelas</li>
<li>Mengirim undangan dengan detail lengkap</li>
<li>Testing audio dan video sebelum meeting</li>
</ul>

<h3>2. Gunakan Fitur Mute dengan Bijak</h3>
<p>Mute mikrofon ketika tidak berbicara untuk menghindari noise yang mengganggu. Aktifkan kembali ketika akan berbicara.</p>

<h3>3. Batasi Durasi Meeting</h3>
<p>Meeting yang efektif sebaiknya tidak lebih dari 60 menit. Untuk diskusi panjang, bagi menjadi beberapa sesi.</p>

<h3>4. Gunakan Fitur Screen Sharing</h3>
<p>Manfaatkan fitur screen sharing untuk presentasi yang lebih interaktif dan jelas.</p>

<h3>5. Follow-up yang Tepat</h3>
<p>Setelah meeting, kirim summary dan action items kepada semua peserta untuk memastikan semua poin penting tercatat.</p>

<p>Dengan menerapkan tips-tips di atas, meeting online Anda akan menjadi lebih efektif dan produktif!</p>',
  '/lovable-uploads/meeting-productivity.jpg',
  'Tips & Tricks',
  'Admin',
  'published',
  NOW(),
  '5 Tips Meeting Online Produktif - Panduan Lengkap',
  'Pelajari 5 tips terbaik untuk meeting online yang produktif dan efisien. Tingkatkan efektivitas meeting virtual Anda dengan panduan lengkap ini.',
  'meeting online produktif'
) ON CONFLICT (slug) DO NOTHING;

-- Enable RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to blog_categories" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to published blog_posts" ON blog_posts FOR SELECT USING (status = 'published');

-- Create policies for authenticated users (admin)
CREATE POLICY "Allow authenticated users full access to blog_categories" ON blog_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users full access to blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();