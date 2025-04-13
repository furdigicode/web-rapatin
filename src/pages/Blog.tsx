
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

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  date: string;
  status: 'draft' | 'published' | 'scheduled';
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll simulate loading and use mock data
    setTimeout(() => {
      setPosts([
        {
          id: 1,
          title: "Cara Mengoptimalkan Rapat Online Anda",
          slug: "cara-mengoptimalkan-rapat-online-anda",
          excerpt: "Pelajari cara membuat rapat online Anda lebih produktif dan efisien dengan tips dan trik dari para ahli.",
          content: "<h2>Pendahuluan</h2><p>Rapat online telah menjadi bagian penting dari rutinitas kerja modern. Artikel ini akan membahas cara mengoptimalkan rapat online agar lebih efektif dan efisien.</p>",
          coverImage: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=627&q=80",
          category: "Tips & Trik",
          author: "Budi Setiawan",
          date: "10 Juni 2023",
          status: "published"
        },
        {
          id: 2,
          title: "Mengapa Model Bayar-Sesuai-Pakai Lebih Ekonomis",
          slug: "mengapa-model-bayar-sesuai-pakai-lebih-ekonomis",
          excerpt: "Analisis mendalam tentang bagaimana model bayar-sesuai-pakai dapat menghemat biaya rapat online Anda secara signifikan.",
          content: "<h2>Model Bayar-Sesuai-Pakai</h2><p>Dalam model bisnis ini, Anda hanya membayar untuk apa yang Anda gunakan, tidak lebih dan tidak kurang.</p>",
          coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=627&q=80",
          category: "Bisnis",
          author: "Dewi Lestari",
          date: "28 Mei 2023",
          status: "published"
        }
      ]);
      setIsLoading(false);
    }, 500);
    
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
    
    return () => {
      document.head.removeChild(script);
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.id}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.coverImage} 
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
