
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Loader2 } from 'lucide-react';
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

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        }
      } catch (err) {
        setError('Gagal memuat artikel');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: localeId });
    } catch {
      return 'Tanggal tidak valid';
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
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button variant="outline" asChild className="mb-6">
              <Link to="/blog" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Kembali ke Blog
              </Link>
            </Button>

            {/* Cover Image */}
            {post.cover_image && (
              <img 
                src={post.cover_image} 
                alt={post.title} 
                className="w-full h-auto rounded-lg mb-8 aspect-[1.91/1] object-cover" 
              />
            )}
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
            
            {/* Meta Info */}
            <div className="flex items-center gap-6 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                {post.category}
              </span>
            </div>
            
            {/* Content */}
            <div 
              className="blog-content max-w-none mb-10"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Back Button Bottom */}
            <div className="pt-8 border-t">
              <Button variant="outline" asChild>
                <Link to="/blog" className="flex items-center gap-2">
                  <ArrowLeft size={16} />
                  Kembali ke Blog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
