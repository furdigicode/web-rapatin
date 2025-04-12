
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Calendar, User, Tag, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  publishedAt: string;
  seoTitle: string;
  metaDescription: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API based on the slug
    // For now, we'll simulate loading and use mock data
    setTimeout(() => {
      // Mock data based on slug
      if (slug === 'cara-mengoptimalkan-rapat-online-anda') {
        setPost({
          id: 1,
          title: "Cara Mengoptimalkan Rapat Online Anda",
          slug: "cara-mengoptimalkan-rapat-online-anda",
          excerpt: "Pelajari cara membuat rapat online Anda lebih produktif dan efisien dengan tips dan trik dari para ahli.",
          content: `
            <h2>Pendahuluan</h2>
            <p>Rapat online telah menjadi bagian penting dari rutinitas kerja modern. Artikel ini akan membahas cara mengoptimalkan rapat online agar lebih efektif dan efisien.</p>
            
            <h2>Tips Mengoptimalkan Rapat Online</h2>
            <ul>
              <li>Siapkan agenda yang jelas</li>
              <li>Tentukan durasi yang tepat</li>
              <li>Gunakan fitur screen sharing</li>
              <li>Rekam rapat untuk referensi</li>
              <li>Pastikan semua peserta mendapatkan kesempatan berbicara</li>
            </ul>
            
            <h3>1. Siapkan Agenda yang Jelas</h3>
            <p>Agenda rapat yang jelas membantu semua peserta memahami tujuan dan alur diskusi. Bagikan agenda sebelum rapat dimulai agar peserta dapat mempersiapkan diri.</p>
            
            <h3>2. Tentukan Durasi yang Tepat</h3>
            <p>Rapat yang terlalu panjang cenderung membuat peserta kehilangan fokus. Usahakan durasi rapat tidak lebih dari 1 jam untuk menjaga produktivitas.</p>
            
            <h3>3. Gunakan Fitur Screen Sharing</h3>
            <p>Tampilkan visual seperti presentasi atau dokumen untuk memperjelas diskusi dan menjaga perhatian peserta tetap fokus.</p>
            
            <h3>4. Rekam Rapat untuk Referensi</h3>
            <p>Rekaman rapat sangat berguna untuk peserta yang tidak dapat hadir atau untuk mengkaji ulang poin-poin penting yang dibahas.</p>
            
            <h3>5. Pastikan Semua Peserta Mendapatkan Kesempatan Berbicara</h3>
            <p>Libatkan semua peserta dalam diskusi untuk mendapatkan perspektif yang beragam dan membuat semua orang merasa dihargai.</p>
            
            <h2>Kesimpulan</h2>
            <p>Dengan menerapkan tips-tips di atas, Anda dapat menyelenggarakan rapat online yang lebih efektif dan mendapatkan hasil yang maksimal.</p>
          `,
          coverImage: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=627&q=80",
          category: "Tips & Trik",
          author: "Budi Setiawan",
          date: "10 Juni 2023",
          status: "published",
          publishedAt: "2023-06-10T09:00:00",
          seoTitle: "10 Cara Mengoptimalkan Rapat Online untuk Efisiensi Maksimal",
          metaDescription: "Pelajari cara membuat rapat online Anda lebih produktif dan efisien dengan panduan lengkap ini. Dapatkan tips terbaik dari para ahli untuk meningkatkan kolaborasi tim."
        });
      } else if (slug === 'mengapa-model-bayar-sesuai-pakai-lebih-ekonomis') {
        setPost({
          id: 2,
          title: "Mengapa Model Bayar-Sesuai-Pakai Lebih Ekonomis",
          slug: "mengapa-model-bayar-sesuai-pakai-lebih-ekonomis",
          excerpt: "Analisis mendalam tentang bagaimana model bayar-sesuai-pakai dapat menghemat biaya rapat online Anda secara signifikan.",
          content: `
            <h2>Model Bayar-Sesuai-Pakai</h2>
            <p>Dalam model bisnis ini, Anda hanya membayar untuk apa yang Anda gunakan, tidak lebih dan tidak kurang. Ini sangat berbeda dengan model langganan tradisional.</p>
            
            <h2>Keuntungan Ekonomis</h2>
            <ul>
              <li>Tidak ada biaya berlangganan bulanan yang tetap</li>
              <li>Hanya membayar saat menggunakan layanan</li>
              <li>Dapat menyesuaikan penggunaan sesuai kebutuhan</li>
              <li>Lebih transparan dalam pengeluaran</li>
            </ul>
            
            <h3>Analisis Perbandingan Biaya</h3>
            <table class="min-w-full border-collapse border border-gray-300 my-4">
              <thead>
                <tr>
                  <th class="border border-gray-300 px-4 py-2 bg-gray-100">Model Bisnis</th>
                  <th class="border border-gray-300 px-4 py-2 bg-gray-100">Biaya Bulanan</th>
                  <th class="border border-gray-300 px-4 py-2 bg-gray-100">Biaya Tahunan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">Langganan Tradisional</td>
                  <td class="border border-gray-300 px-4 py-2">Rp 500.000</td>
                  <td class="border border-gray-300 px-4 py-2">Rp 6.000.000</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">Bayar-Sesuai-Pakai</td>
                  <td class="border border-gray-300 px-4 py-2">Rp 0 - 300.000</td>
                  <td class="border border-gray-300 px-4 py-2">Rp 0 - 3.600.000</td>
                </tr>
              </tbody>
            </table>
            
            <h2>Kesimpulan</h2>
            <p>Dengan model bayar-sesuai-pakai, bisnis Anda bisa menghemat hingga 40% dari biaya langganan tradisional, terutama jika penggunaan tidak konstan sepanjang tahun.</p>
          `,
          coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=627&q=80",
          category: "Bisnis",
          author: "Dewi Lestari",
          date: "28 Mei 2023",
          status: "published",
          publishedAt: "2023-05-28T10:30:00",
          seoTitle: "Model Bayar-Sesuai-Pakai: Solusi Ekonomis untuk Rapat Online",
          metaDescription: "Temukan bagaimana model bayar-sesuai-pakai dapat menghemat biaya rapat online Anda hingga 40%. Analisis perbandingan dengan model langganan bulanan."
        });
      } else {
        // Post not found
        setPost(null);
      }
      setIsLoading(false);
    }, 800);
  }, [slug]);
  
  // Update meta tags for SEO
  useEffect(() => {
    if (post) {
      // Set page title
      document.title = `${post.seoTitle || post.title} | Rapatin`;
      
      // Check if meta description already exists
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        // Create meta description if it doesn't exist
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      // Set meta description content
      metaDesc.setAttribute('content', post.metaDescription || post.excerpt);
      
      // Set canonical URL
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', `https://rapatin.id/blog/${post.slug}`);
      
      // Set Open Graph tags
      const ogTags = {
        'og:title': post.seoTitle || post.title,
        'og:description': post.metaDescription || post.excerpt,
        'og:image': post.coverImage,
        'og:type': 'article',
        'og:url': `https://rapatin.id/blog/${post.slug}`
      };
      
      Object.entries(ogTags).forEach(([property, content]) => {
        let ogTag = document.querySelector(`meta[property="${property}"]`);
        if (!ogTag) {
          ogTag = document.createElement('meta');
          ogTag.setAttribute('property', property);
          document.head.appendChild(ogTag);
        }
        ogTag.setAttribute('content', content);
      });
      
      // Add BlogPosting schema markup
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.metaDescription || post.excerpt,
        "image": post.coverImage,
        "author": {
          "@type": "Person",
          "name": post.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "Rapatin",
          "logo": {
            "@type": "ImageObject",
            "url": "/lovable-uploads/b85c0fd2-b1c7-4ba8-8938-bf1ac3bdeb28.png"
          }
        },
        "datePublished": post.publishedAt,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://rapatin.id/blog/${post.slug}`
        }
      });
      document.head.appendChild(script);
      
      return () => {
        // Clean up dynamic meta tags
        document.title = "Rapatin - Jadwalkan rapat Zoom tanpa langganan";
        document.head.removeChild(script);
      };
    }
  }, [post]);

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: `https://rapatin.id/blog/${post.slug}`
      });
    } else {
      // Fallback for browsers that don't support the Share API
      // Just copy the URL to clipboard
      if (post) {
        navigator.clipboard.writeText(`https://rapatin.id/blog/${post.slug}`)
          .then(() => {
            alert('URL berhasil disalin ke clipboard!');
          });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-28 pb-20">
          <div className="container mx-auto px-4">
            {/* Loading skeleton */}
            <div className="max-w-3xl mx-auto">
              <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded w-full mb-8 animate-pulse"></div>
              <div className="h-80 bg-gray-200 rounded w-full mb-8 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-28 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
            <p className="mb-8">Maaf, artikel yang Anda cari tidak tersedia.</p>
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
        <article className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="max-w-3xl mx-auto mb-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink as={Link} to="/blog">Blog</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{post.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          {/* Header */}
          <header className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Link to={`/blog?category=${post.category}`} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {post.category}
              </Link>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{post.date}</span>
              </div>
              
              <div className="flex items-center">
                <User size={16} className="mr-1" />
                <span>{post.author}</span>
              </div>
              
              <Button variant="outline" size="sm" className="gap-1" onClick={handleShare}>
                <Share2 size={14} />
                <span>Bagikan</span>
              </Button>
            </div>
          </header>
          
          {/* Cover Image */}
          <div className="max-w-4xl mx-auto mb-8">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-auto rounded-lg shadow-md" 
            />
          </div>
          
          {/* Content */}
          <div className="max-w-3xl mx-auto">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
          
          {/* Tags and sharing */}
          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t flex flex-wrap justify-between items-center">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/blog?category=${post.category}`}>
                  <Tag size={14} className="mr-1" />
                  {post.category}
                </Link>
              </Button>
            </div>
            
            <div>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 size={14} className="mr-2" />
                Bagikan Artikel
              </Button>
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
