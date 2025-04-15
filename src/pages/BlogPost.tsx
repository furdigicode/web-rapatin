
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Calendar, User, Tag, Share2, Bookmark, ThumbsUp, MessageSquare, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost as BlogPostType } from '@/types/BlogTypes';

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  category: string;
}

interface SupabaseBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  author: string;
  created_at: string;
  status: 'draft' | 'published' | 'scheduled';
  published_at: string;
  seo_title: string;
  meta_description: string;
  focus_keyword: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  useEffect(() => {
    // Reset state when slug changes
    setPost(null);
    setRelatedPosts([]);
    setIsLoading(true);
    setNotFound(false);
    
    const fetchBlogPost = async () => {
      try {
        // Fetch the blog post from Supabase
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();
        
        if (error || !data) {
          console.error('Error fetching blog post:', error);
          setNotFound(true);
          setIsLoading(false);
          return;
        }
        
        // Transform Supabase data to our BlogPost type
        const blogPost = {
          id: data.id,
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || '',
          content: data.content || '',
          coverImage: data.cover_image || '',
          category: data.category || '',
          author: data.author || 'Admin',
          date: new Date(data.created_at).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          status: data.status,
          publishedAt: data.published_at || '',
          seoTitle: data.seo_title || data.title,
          metaDescription: data.meta_description || data.excerpt || '',
          focusKeyword: data.focus_keyword || '',
        };
        
        setPost(blogPost);
        
        // Fetch related posts (posts in the same category)
        const { data: relatedData, error: relatedError } = await supabase
          .from('blog_posts')
          .select('id, title, slug, cover_image, category')
          .eq('status', 'published')
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(2);
        
        if (!relatedError && relatedData && relatedData.length > 0) {
          const formattedRelatedPosts = relatedData.map((related: SupabaseBlogPost) => ({
            id: related.id,
            title: related.title,
            slug: related.slug,
            coverImage: related.cover_image || '',
            category: related.category || '',
          }));
          
          setRelatedPosts(formattedRelatedPosts);
        }
        
        // Add schema markup for blog post
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": blogPost.title,
          "description": blogPost.excerpt,
          "author": {
            "@type": "Person",
            "name": blogPost.author
          },
          "datePublished": data.published_at || data.created_at,
          "image": blogPost.coverImage,
          "publisher": {
            "@type": "Organization",
            "name": "Rapatin",
            "logo": {
              "@type": "ImageObject",
              "url": "https://rapatin.id/logo.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://rapatin.id/blog/${blogPost.slug}`
          }
        });
        document.head.appendChild(script);
        
        // Add meta tags for SEO and social sharing
        const metaTags = [
          { name: "description", content: blogPost.metaDescription },
          { property: "og:title", content: blogPost.seoTitle },
          { property: "og:description", content: blogPost.metaDescription },
          { property: "og:image", content: blogPost.coverImage },
          { property: "og:type", content: "article" },
          { property: "og:url", content: `https://rapatin.id/blog/${blogPost.slug}` },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:title", content: blogPost.seoTitle },
          { name: "twitter:description", content: blogPost.metaDescription },
          { name: "twitter:image", content: blogPost.coverImage }
        ];
        
        // Remove existing meta tags to avoid duplicates
        document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], meta[name="description"]')
          .forEach(tag => tag.remove());
        
        // Add new meta tags
        metaTags.forEach(tag => {
          const metaTag = document.createElement('meta');
          Object.entries(tag).forEach(([key, value]) => {
            metaTag.setAttribute(key, value);
          });
          document.head.appendChild(metaTag);
        });
        
        // Set document title
        document.title = `${blogPost.seoTitle} | Blog Rapatin`;
      } catch (err) {
        console.error('Error in blog post fetch:', err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchBlogPost();
    }
    
    return () => {
      // Clean up
      document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], meta[name="description"]')
        .forEach(tag => tag.remove());
      const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
      if (jsonLdScript?.parentNode) {
        jsonLdScript.parentNode.removeChild(jsonLdScript);
      }
      document.title = 'Rapatin';
    };
  }, [slug]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-28 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="w-full h-80 bg-gray-200 rounded-lg animate-pulse mb-8"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse mb-6 w-3/4"></div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-40"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-28 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
            <p className="text-lg text-muted-foreground mb-8">Maaf, artikel yang Anda cari tidak ditemukan.</p>
            <Button asChild>
              <Link to="/blog">Kembali ke Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!post) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-8 max-w-4xl mx-auto">
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to="/">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link to="/blog">Blog</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{post.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          {/* Article Content */}
          <div className="max-w-4xl mx-auto">
            {/* Cover Image */}
            {post.coverImage && (
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-auto rounded-lg mb-8 aspect-[1.91/1] object-cover" 
              />
            )}
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            {/* Article Metadata */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{post.author}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar size={14} className="mr-1" />
                <span>{post.date}</span>
              </div>
              
              {post.category && (
                <div className="flex items-center text-sm">
                  <Tag size={14} className="mr-1 text-primary" />
                  <span className="text-primary">{post.category}</span>
                </div>
              )}
            </div>
            
            {/* Social Sharing */}
            <div className="flex items-center gap-2 mb-8">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 size={16} />
                <span>Bagikan</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark size={16} />
                <span>Simpan</span>
              </Button>
            </div>
            
            {/* Article Content */}
            <div 
              className="prose max-w-none mb-10"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Article Actions */}
            <div className="flex items-center gap-4 mb-10">
              <Button variant="outline" size="sm" className="gap-2">
                <ThumbsUp size={16} />
                <span>Suka</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <MessageSquare size={16} />
                <span>Komentar</span>
              </Button>
            </div>
            
            <Separator className="my-10" />
            
            {/* Author */}
            <div className="flex items-start gap-4 mb-10 p-6 bg-muted/40 rounded-lg">
              <Avatar className="h-16 w-16">
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold mb-2">Tentang {post.author}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Penulis artikel tentang teknologi dan produktivitas. Suka berbagi tips dan trik untuk membuat rapat online lebih efektif.
                </p>
                <Button variant="outline" size="sm">Lihat Semua Artikel</Button>
              </div>
            </div>
            
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6">Artikel Terkait</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link to={`/blog/${relatedPost.slug}`} key={relatedPost.id}>
                      <Card className="h-full hover:shadow-md transition-all">
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={relatedPost.coverImage} 
                            alt={relatedPost.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {relatedPost.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                            {relatedPost.title}
                          </h3>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Pagination */}
            <div className="flex justify-between">
              <Button variant="outline" asChild className="gap-2">
                <Link to="/blog">
                  <ArrowLeft size={16} />
                  <span>Kembali ke Blog</span>
                </Link>
              </Button>
              {relatedPosts.length > 0 && (
                <Button variant="outline" asChild className="gap-2">
                  <Link to={`/blog/${relatedPosts[0].slug}`}>
                    <span>Artikel Berikutnya</span>
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
