
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, User, ArrowLeft, Loader2, Clock, Share2, 
  Bookmark, Eye, ChevronRight, Home, ArrowUp 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string | null;
  category: string;
  author: string;
  created_at: string;
}

interface RelatedPostData {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  category: string;
  author: string;
  created_at: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!slug) {
        setError('Slug artikel tidak valid');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, content, cover_image, category, author, created_at')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            setError('Artikel tidak ditemukan');
          } else {
            throw error;
          }
        } else {
          setPost(data);
          // Fetch related posts
          fetchRelatedPosts(data.category, data.id);
        }
      } catch (err) {
        setError('Gagal memuat artikel');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedPosts = async (category: string, currentPostId: string) => {
      try {
        const { data } = await supabase
          .from('blog_posts')
          .select('id, title, slug, cover_image, category, author, created_at')
          .eq('status', 'published')
          .eq('category', category)
          .neq('id', currentPostId)
          .limit(3);
        
        setRelatedPosts(data || []);
      } catch (err) {
        console.error('Error fetching related posts:', err);
      }
    };

    fetchBlogPost();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;
      
      setReadingProgress(progress);
      setShowScrollTop(scrolled > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sharePost = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: `Baca artikel menarik: ${post.title}`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-28 pb-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-28 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
            <p className="text-lg text-muted-foreground mb-8">
              {error || 'Maaf, artikel yang Anda cari tidak ditemukan.'}
            </p>
            <Button asChild>
              <Link to="/blog">Kembali ke Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-300"
        style={{ width: `${readingProgress}%` }}
      />
      
      <main className="flex-grow">
        {/* Hero Section with Cover Image */}
        <div className="relative">
          {post.cover_image ? (
            <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
              <img 
                src={post.cover_image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Hero Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 px-4 py-6 md:px-6 md:py-12 text-white">
                <div className="container mx-auto max-w-4xl">
                  {/* Breadcrumb */}
                  <nav className="flex items-center space-x-2 text-sm mb-3 text-white/80">
                    <Link to="/" className="hover:text-white flex items-center">
                      <Home size={14} className="mr-1" />
                      Home
                    </Link>
                    <ChevronRight size={14} />
                    <Link to="/blog" className="hover:text-white">Blog</Link>
                    <ChevronRight size={14} />
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {post.category}
                    </Badge>
                  </nav>
                  
                  <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                    {post.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{estimateReadingTime(post.content)} menit baca</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 py-12 md:py-16">
              <div className="container mx-auto px-4 max-w-4xl">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm mb-4 text-muted-foreground">
                  <Link to="/" className="hover:text-foreground flex items-center">
                    <Home size={14} className="mr-1" />
                    Home
                  </Link>
                  <ChevronRight size={14} />
                  <Link to="/blog" className="hover:text-foreground">Blog</Link>
                  <ChevronRight size={14} />
                  <Badge variant="outline">{post.category}</Badge>
                </nav>
                
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{estimateReadingTime(post.content)} menit baca</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Main Article Content */}
              <article className="lg:col-span-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <Button variant="outline" asChild>
                    <Link to="/blog" className="flex items-center gap-2">
                      <ArrowLeft size={16} />
                      Kembali ke Blog
                    </Link>
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={sharePost}>
                      <Share2 size={16} className="mr-2" />
                      <span className="hidden sm:inline">Bagikan</span>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark size={16} className="mr-2" />
                      <span className="hidden sm:inline">Simpan</span>
                    </Button>
                  </div>
                </div>

                {/* Article Content */}
                <div 
                  className="blog-content prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <Separator className="my-8 md:my-12" />

                {/* Article Footer */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <Badge variant="outline">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Dipublikasikan {formatDate(post.created_at)}
                    </span>
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={sharePost} className="w-full sm:w-auto">
                    <Share2 size={16} className="mr-2" />
                    Bagikan Artikel
                  </Button>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-1 order-first lg:order-last">
                <div className="sticky top-24 space-y-6">
                  {/* Author Card */}
                  <Card>
                    <CardContent className="p-4 md:p-6">
                      <div className="text-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <User size={20} className="text-primary md:w-6 md:h-6" />
                        </div>
                        <h3 className="font-semibold mb-2 text-sm md:text-base">{post.author}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground mb-3">
                          Penulis konten berkualitas di Rapatin Blog
                        </p>
                        <Button variant="outline" size="sm" className="w-full text-xs md:text-sm">
                          <Eye size={12} className="mr-2 md:w-4 md:h-4" />
                          Lihat Profil
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Related Articles */}
                  {relatedPosts.length > 0 && (
                    <Card>
                      <CardContent className="p-4 md:p-6">
                        <h3 className="font-semibold mb-3 text-sm md:text-base">Artikel Terkait</h3>
                        <div className="space-y-3">
                          {relatedPosts.map((relatedPost) => (
                            <Link 
                              key={relatedPost.id}
                              to={`/blog/${relatedPost.slug}`}
                              className="block group"
                            >
                              <div className="flex gap-3">
                                {relatedPost.cover_image && (
                                  <img 
                                    src={relatedPost.cover_image}
                                    alt={relatedPost.title}
                                    className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover flex-shrink-0"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-xs md:text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                    {relatedPost.title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(relatedPost.created_at)}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Popular Categories */}
                  <Card className="lg:block hidden">
                    <CardContent className="p-4 md:p-6">
                      <h3 className="font-semibold mb-3 text-sm md:text-base">Kategori Popular</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs">
                          Tips Meeting
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs">
                          Produktivitas
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs">
                          Tutorial
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs">
                          Bisnis
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-8 right-8 z-40 shadow-lg bg-background/80 backdrop-blur-sm"
          onClick={scrollToTop}
        >
          <ArrowUp size={16} />
        </Button>
      )}
      
      <Footer />
    </div>
  );
};

export default BlogPost;
