
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Calendar, User, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/BlogTypes';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        // We need to use the generic version of from() to specify the expected data structure
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false }) as { data: any[], error: any };
        
        if (error) {
          console.error('Error fetching blog posts:', error);
          setIsLoading(false);
          return;
        }
        
        // Transform the data
        const formattedPosts = data.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content || '',
          coverImage: post.cover_image || '',
          category: post.category || '',
          author: post.author || 'Admin',
          date: new Date(post.created_at).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          // Cast the status to the specific allowed types
          status: (post.status as 'draft' | 'published' | 'scheduled'),
          publishedAt: post.published_at || '',
          seoTitle: post.seo_title || post.title,
          metaDescription: post.meta_description || post.excerpt || '',
          focusKeyword: post.focus_keyword || '',
        }));
        
        setPosts(formattedPosts);
        setIsLoading(false);
      } catch (err) {
        console.error('Error in blog posts fetch:', err);
        setIsLoading(false);
      }
    };
    
    fetchBlogPosts();
    
    // Add schema markup for blog listing
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Blog Rapatin",
      "description": "Artikel dan tips seputar meeting online dan produktivitas",
      "url": "https://rapatin.id/blog"
    });
    document.head.appendChild(script);
    
    // Set page title
    document.title = "Blog Rapatin | Tips & Artikel tentang Meeting Online";
    
    return () => {
      document.head.removeChild(script);
      document.title = "Rapatin";
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Blog</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog Rapatin</h1>
            <p className="text-lg text-muted-foreground">
              Artikel dan tips seputar meeting online dan produktivitas
            </p>
          </div>
          
          {/* Blog Posts */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-md">
                  <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-4">Belum ada artikel</h2>
              <p className="text-muted-foreground">
                Artikel sedang dalam proses penulisan. Silakan kunjungi lagi nanti.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.id}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.coverImage || 'https://via.placeholder.com/600x400?text=Rapatin'} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-all duration-500 hover:scale-105" 
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        {post.category && (
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                            {post.category}
                          </span>
                        )}
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      
                      <p className="text-muted-foreground line-clamp-3 text-sm mb-4">
                        {post.excerpt}
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
