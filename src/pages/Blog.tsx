
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, Clock, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string;
  author: string;
  created_at: string;
  content: string;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            id, 
            title, 
            slug, 
            excerpt, 
            cover_image, 
            category, 
            author,
            created_at,
            content,
            authors!inner(name)
          `)
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Transform data to include author name from authors table
        const transformedData = (data || []).map(post => ({
          ...post,
          author: post.authors?.name || post.author || 'Admin'
        }));
        
        setBlogPosts(transformedData);
      } catch (err) {
        setError('Gagal memuat artikel blog');
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: localeId });
    } catch {
      return 'Tanggal tidak valid';
    }
  };

  const calculateReadingTime = (content: string) => {
    // Strip HTML tags and count words
    const plainText = content.replace(/<[^>]*>/g, '');
    const wordCount = plainText.trim().split(/\s+/).length;
    
    // Average reading speed: 225 words per minute
    const readingTimeMinutes = Math.ceil(wordCount / 225);
    
    // Minimum 1 minute
    return Math.max(1, readingTimeMinutes);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-28 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog Rapatin</h1>
              <p className="text-lg text-muted-foreground">
                Artikel dan tips seputar meeting online dan produktivitas
              </p>
            </div>
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-28 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog Rapatin</h1>
              <p className="text-lg text-muted-foreground">
                Artikel dan tips seputar meeting online dan produktivitas
              </p>
            </div>
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">{error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog Rapatin</h1>
            <p className="text-lg text-muted-foreground">
              Artikel dan tips seputar meeting online dan produktivitas
            </p>
          </div>
          
          {/* Blog Posts */}
          {blogPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">Belum ada artikel yang dipublikasikan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.id}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.cover_image || 'https://via.placeholder.com/600x400?text=Rapatin'} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-all duration-500 hover:scale-105" 
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                          {post.category}
                        </span>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          <span>{calculateReadingTime(post.content)} menit baca</span>
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      
                      <p className="text-muted-foreground line-clamp-3 text-sm mb-4">
                        {post.excerpt || 'Tidak ada ringkasan tersedia.'}
                      </p>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User size={14} className="mr-1" />
                        <span>{post.author}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
