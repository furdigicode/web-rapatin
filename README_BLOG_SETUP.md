# Blog Setup Instructions

## 1. Create Database Tables

Run the following SQL script in your Supabase SQL Editor:

```sql
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
  ('Tutorial', 'tutorial', 'Step-by-step guides and tutorials'),
  ('Tips & Tricks', 'tips-tricks', 'Useful tips and tricks'),
  ('News', 'news', 'Latest news and updates'),
  ('Review', 'review', 'Product and service reviews'),
  ('Technology', 'technology', 'Technology-related articles')
ON CONFLICT (slug) DO NOTHING;

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
```

## 2. Update TypeScript Types

After creating the tables, regenerate your TypeScript types in Supabase Dashboard:
1. Go to your Supabase project
2. Navigate to Settings > API
3. Copy the new types and update `src/integrations/supabase/types.ts`

## 3. Test the Blog Management

1. Go to `/admin/blog` to access the blog management panel
2. Try creating a new blog post
3. Test all CRUD operations (Create, Read, Update, Delete)
4. Verify SEO panel functionality
5. Test publishing workflow

## 4. Features Included

- ✅ Complete CRUD operations for blog posts
- ✅ Rich text editor for content
- ✅ SEO optimization panel
- ✅ Category management
- ✅ Draft/Published/Scheduled status
- ✅ Cover image support
- ✅ Author attribution
- ✅ Slug generation
- ✅ Meta description and focus keywords
- ✅ Row Level Security (RLS) policies

## 5. Next Steps (Optional Enhancements)

- [ ] Integrate Supabase Storage for file uploads
- [ ] Add category management interface
- [ ] Implement comment system
- [ ] Add blog analytics dashboard
- [ ] Create media library
- [ ] Add bulk operations
- [ ] Implement revision history