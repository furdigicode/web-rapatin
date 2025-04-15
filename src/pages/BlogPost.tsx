
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost as BlogPostType } from '@/types/BlogTypes';

// Import refactored components
import BlogPostSkeleton from '@/components/blog/BlogPostSkeleton';
import BlogPostNotFound from '@/components/blog/BlogPostNotFound';
import BlogBreadcrumb from '@/components/blog/BlogBreadcrumb';
import BlogPostMeta from '@/components/blog/BlogPostMeta';
import ShareButtons from '@/components/blog/ShareButtons';
import AuthorBio from '@/components/blog/AuthorBio';
import RelatedPosts from '@/components/blog/RelatedPosts';
import PostNavigation from '@/components/blog/PostNavigation';

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
        const blogPost: BlogPostType = {
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
          status: (data.status as 'draft' | 'published' | 'scheduled'),
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
          const formattedRelatedPosts = relatedData.map((related: any) => ({
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
    return <BlogPostSkeleton />;
  }
  
  if (notFound) {
    return <BlogPostNotFound />;
  }
  
  if (!post) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <BlogBreadcrumb title={post.title} />
          
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
            <BlogPostMeta post={post} />
            
            {/* Social Sharing */}
            <ShareButtons showLikeComment={false} />
            
            {/* Article Content */}
            <div 
              className="prose max-w-none mb-10"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Article Actions */}
            <ShareButtons />
            
            <Separator className="my-10" />
            
            {/* Author */}
            <AuthorBio author={post.author} />
            
            {/* Related Posts */}
            <RelatedPosts posts={relatedPosts} />
            
            {/* Pagination */}
            <PostNavigation relatedPosts={relatedPosts} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
