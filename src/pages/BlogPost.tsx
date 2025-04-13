
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

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  authorAvatar?: string;
  date: string;
  status: 'draft' | 'published' | 'scheduled';
  relatedPosts?: RelatedPost[];
}

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  category: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  useEffect(() => {
    // Reset state when slug changes
    setPost(null);
    setIsLoading(true);
    setNotFound(false);
    
    // In a real app, this would fetch from an API
    // For now, we'll simulate loading and use mock data
    setTimeout(() => {
      // Mock data
      const mockPosts: BlogPost[] = [
        {
          id: 1,
          title: "Cara Mengoptimalkan Rapat Online Anda",
          slug: "cara-mengoptimalkan-rapat-online-anda",
          excerpt: "Pelajari cara membuat rapat online Anda lebih produktif dan efisien dengan tips dan trik dari para ahli.",
          content: `
            <h2>Pendahuluan</h2>
            <p>Rapat online telah menjadi bagian penting dari rutinitas kerja modern. Artikel ini akan membahas cara mengoptimalkan rapat online agar lebih efektif dan efisien.</p>
            
            <h2>Siapkan Agenda yang Jelas</h2>
            <p>Sebelum memulai rapat, pastikan Anda memiliki agenda yang jelas. Kirimkan agenda tersebut ke semua peserta sebelum rapat dimulai. Dengan demikian, semua orang akan memahami tujuan rapat dan apa yang diharapkan dari mereka.</p>
            
            <h2>Batasi Durasi Rapat</h2>
            <p>Rapat yang terlalu panjang cenderung tidak produktif. Batasi durasi rapat menjadi maksimal 45-60 menit. Jika perlu lebih lama, pertimbangkan untuk menjadwalkan beberapa rapat yang lebih pendek.</p>
            
            <h2>Gunakan Fitur Screen Sharing</h2>
            <p>Memanfaatkan fitur berbagi layar untuk menunjukkan dokumen, presentasi, atau data yang relevan. Ini membantu semua peserta fokus pada materi yang sedang dibahas.</p>
            
            <h2>Rekam Rapat untuk Referensi</h2>
            <p>Merekam rapat memungkinkan peserta yang tidak hadir untuk mengejar ketinggalan, dan juga membantu dalam membuat catatan rapat yang akurat.</p>
            
            <h2>Kesimpulan</h2>
            <p>Dengan menerapkan tips di atas, Anda dapat membuat rapat online Anda lebih produktif dan efisien. Jangan lupa untuk selalu menindaklanjuti hasil rapat dengan tindakan nyata.</p>
          `,
          coverImage: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=627&q=80",
          category: "Tips & Trik",
          author: "Budi Setiawan",
          authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
          date: "10 Juni 2023",
          status: "published",
          relatedPosts: [
            {
              id: 2,
              title: "Mengapa Model Bayar-Sesuai-Pakai Lebih Ekonomis",
              slug: "mengapa-model-bayar-sesuai-pakai-lebih-ekonomis",
              coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=627&q=80",
              category: "Bisnis"
            },
            {
              id: 3,
              title: "5 Alat yang Harus Anda Miliki untuk Rapat Online",
              slug: "5-alat-yang-harus-anda-miliki-untuk-rapat-online",
              coverImage: "https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=627&q=80",
              category: "Tips & Trik"
            }
          ]
        },
        {
          id: 2,
          title: "Mengapa Model Bayar-Sesuai-Pakai Lebih Ekonomis",
          slug: "mengapa-model-bayar-sesuai-pakai-lebih-ekonomis",
          excerpt: "Analisis mendalam tentang bagaimana model bayar-sesuai-pakai dapat menghemat biaya rapat online Anda secara signifikan.",
          content: `
            <h2>Model Bayar-Sesuai-Pakai</h2>
            <p>Dalam model bisnis ini, Anda hanya membayar untuk apa yang Anda gunakan, tidak lebih dan tidak kurang.</p>
            
            <h2>Menghemat Biaya</h2>
            <p>Dengan model bayar-sesuai-pakai, Anda tidak perlu membayar biaya tetap bulanan yang besar. Ini sangat menguntungkan bagi bisnis yang hanya perlu mengadakan rapat online sesekali.</p>
            
            <h2>Fleksibilitas Tinggi</h2>
            <p>Model ini menawarkan fleksibilitas yang tinggi. Anda bisa meningkatkan atau mengurangi penggunaan sesuai kebutuhan tanpa harus terikat kontrak jangka panjang.</p>
            
            <h2>Kesimpulan</h2>
            <p>Model bayar-sesuai-pakai adalah solusi ekonomis untuk bisnis dari berbagai ukuran. Ini memungkinkan Anda untuk mengoptimalkan anggaran dan hanya membayar untuk layanan yang benar-benar Anda gunakan.</p>
          `,
          coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=627&q=80",
          category: "Bisnis",
          author: "Dewi Lestari",
          authorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
          date: "28 Mei 2023",
          status: "published",
          relatedPosts: [
            {
              id: 1,
              title: "Cara Mengoptimalkan Rapat Online Anda",
              slug: "cara-mengoptimalkan-rapat-online-anda",
              coverImage: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=627&q=80",
              category: "Tips & Trik"
            }
          ]
        }
      ];
      
      const foundPost = mockPosts.find(p => p.slug === slug);
      
      if (foundPost) {
        setPost(foundPost);
        
        // Add schema markup for blog post
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": foundPost.title,
          "description": foundPost.excerpt,
          "author": {
            "@type": "Person",
            "name": foundPost.author
          },
          "datePublished": new Date().toISOString(),
          "image": foundPost.coverImage,
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
            "@id": `https://rapatin.id/blog/${foundPost.slug}`
          }
        });
        document.head.appendChild(script);
        
        // Add meta tags for SEO and social sharing
        const metaTags = [
          { name: "description", content: foundPost.excerpt },
          { property: "og:title", content: foundPost.title },
          { property: "og:description", content: foundPost.excerpt },
          { property: "og:image", content: foundPost.coverImage },
          { property: "og:type", content: "article" },
          { property: "og:url", content: `https://rapatin.id/blog/${foundPost.slug}` },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:title", content: foundPost.title },
          { name: "twitter:description", content: foundPost.excerpt },
          { name: "twitter:image", content: foundPost.coverImage }
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
        document.title = `${foundPost.title} | Blog Rapatin`;
        
        return () => {
          // Clean up
          document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], meta[name="description"]')
            .forEach(tag => tag.remove());
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
          document.title = 'Rapatin';
        };
      } else {
        setNotFound(true);
      }
      
      setIsLoading(false);
    }, 500);
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
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-auto rounded-lg mb-8 aspect-[1.91/1] object-cover" 
            />
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            {/* Article Metadata */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  {post.authorAvatar ? (
                    <AvatarImage src={post.authorAvatar} alt={post.author} />
                  ) : (
                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm">{post.author}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar size={14} className="mr-1" />
                <span>{post.date}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Tag size={14} className="mr-1 text-primary" />
                <span className="text-primary">{post.category}</span>
              </div>
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
                {post.authorAvatar ? (
                  <AvatarImage src={post.authorAvatar} alt={post.author} />
                ) : (
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                )}
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
            {post.relatedPosts && post.relatedPosts.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6">Artikel Terkait</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {post.relatedPosts.map((relatedPost) => (
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
              {post.relatedPosts && post.relatedPosts.length > 0 && (
                <Button variant="outline" asChild className="gap-2">
                  <Link to={`/blog/${post.relatedPosts[0].slug}`}>
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
