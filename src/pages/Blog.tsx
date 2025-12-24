
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Calendar, Clock, User } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string;
  author: string;
  created_at: string;
}

const Blog = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, content, cover_image, category, author, created_at')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    }
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: localeId });
    } catch {
      return 'Tanggal tidak valid';
    }
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const generateExcerpt = (content: string, excerpt: string | null) => {
    if (excerpt) return excerpt;
    
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    return plainText.length > 150 ? plainText.substring(0, 147) + '...' : plainText;
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Blog Rapatin - Artikel & Tips Meeting Online Terbaik Indonesia"
        description="Baca artikel terbaru seputar meeting online, tips produktivitas, panduan Zoom, dan strategi rapat efektif. Update terkini dari platform Rapatin."
        keywords="blog rapatin, artikel meeting online, tips zoom, panduan rapat virtual, produktivitas meeting"
        canonicalUrl="https://rapatin.id/blog"
        type="website"
      />
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              Blog
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Artikel & Tips Meeting Online</h1>
            <p className="text-lg text-muted-foreground">
              Baca artikel terbaru seputar meeting online, tips produktivitas, dan strategi rapat efektif.
            </p>
          </div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                Gagal memuat artikel. Silakan coba lagi nanti.
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && posts && posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                Belum ada artikel yang dipublikasikan.
              </p>
            </div>
          )}

          {/* Articles Grid */}
          {!isLoading && !error && posts && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {posts.map((post) => (
                <Card key={post.id} className="group overflow-hidden hover:shadow-elevation transition-all duration-300 h-full flex flex-col">
                  <Link to={`/blog/${post.slug}`} className="block">
                    {/* Cover Image */}
                    <div className="relative h-48 overflow-hidden bg-muted">
                      {post.cover_image ? (
                        <img 
                          src={post.cover_image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <span className="text-primary/40 text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <CardContent className="p-6 flex-1 flex flex-col">
                      {/* Category Badge */}
                      {post.category && (
                        <Badge variant="secondary" className="w-fit mb-3 text-xs">
                          {post.category}
                        </Badge>
                      )}
                      
                      {/* Title */}
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      {/* Excerpt */}
                      <p className="text-muted-foreground mb-4 flex-1 line-clamp-3 text-sm">
                        {generateExcerpt(post.content, post.excerpt)}
                      </p>
                      
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                        <div className="flex items-center gap-1">
                          <User size={12} />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{estimateReadingTime(post.content)} min</span>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
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
