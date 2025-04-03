
-- Supabase SQL schema for Rapatin website

-- URL Management
CREATE TABLE url_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE url_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES url_groups(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Blog Management
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category_id UUID REFERENCES blog_categories(id),
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft' or 'published'
  published_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Testimonials
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT,
  company TEXT,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  image_url TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Brand Logos
CREATE TABLE brand_logos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  svg_content TEXT NOT NULL,
  width INTEGER NOT NULL DEFAULT 100,
  height INTEGER NOT NULL DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- FAQ
CREATE TABLE faq_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE faq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES faq_categories(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Terms and Privacy Policy
CREATE TABLE legal_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL, -- 'terms' or 'privacy'
  title TEXT NOT NULL,
  last_updated TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE legal_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES legal_documents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Initial data for URL management
INSERT INTO url_groups (id, title, "order") VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Hero Section', 1),
  ('22222222-2222-2222-2222-222222222222', 'Call to Action', 2),
  ('33333333-3333-3333-3333-333333333333', 'Navbar', 3);

INSERT INTO url_items (group_id, label, description, url, "order") VALUES
  ('11111111-1111-1111-1111-111111111111', 'Mulai Menjadwalkan', 'Tombol CTA utama di hero section', 'https://rapatin.id/register', 1),
  ('11111111-1111-1111-1111-111111111111', 'Lihat Harga', 'Tombol ke bagian pricing', '#pricing', 2),
  ('22222222-2222-2222-2222-222222222222', 'Daftar & Mulai Menjadwalkan', 'Tombol CTA di bagian akhir halaman', 'https://rapatin.id/register', 1),
  ('33333333-3333-3333-3333-333333333333', 'Masuk', 'Tombol login di navbar', 'https://rapatin.id/login', 1),
  ('33333333-3333-3333-3333-333333333333', 'Daftar', 'Tombol register di navbar', 'https://rapatin.id/register', 2);

-- Create trigger for updated_at columns
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables with updated_at
CREATE TRIGGER set_updated_at_url_groups
BEFORE UPDATE ON url_groups
FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();

CREATE TRIGGER set_updated_at_url_items
BEFORE UPDATE ON url_items
FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();

-- Repeat for other tables...

-- Set up Row Level Security (RLS)
ALTER TABLE url_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_sections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (example for url_groups)
CREATE POLICY "Allow anonymous read access to url_groups"
ON url_groups FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow authenticated users full access to url_groups"
ON url_groups FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Repeat similar policies for other tables
