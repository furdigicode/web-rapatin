import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FinalCTA from '@/components/FinalCTA';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, ArrowRight, Tag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Mock blog data - in a real application, you would fetch this from an API
const blogPosts = [
  {
    id: 1,
    title: 'Cara Mengoptimalkan Rapat Online Anda',
    content: `
      <p class="mb-4">Rapat online telah menjadi bagian integral dari kehidupan kerja modern. Namun, banyak dari kita masih menghadapi tantangan dalam memaksimalkan efektivitas rapat virtual. Artikel ini akan membahas strategi praktis untuk meningkatkan produktivitas dan efisiensi rapat online Anda.</p>
      
      <h2 class="text-2xl font-semibold mb-3 mt-6">Persiapan Adalah Kunci</h2>
      <p class="mb-4">Sebelum rapat dimulai, pastikan semua peserta memiliki informasi yang diperlukan. Kirim agenda, dokumen pendukung, dan tujuan rapat sebelumnya. Ini memungkinkan peserta untuk mempersiapkan diri dengan baik dan berkontribusi secara efektif.</p>
      
      <h2 class="text-2xl font-semibold mb-3 mt-6">Tetapkan Aturan Dasar</h2>
      <p class="mb-4">Komunikasikan ekspektasi tentang penggunaan kamera, fungsi mute, dan cara mengajukan pertanyaan. Aturan yang jelas membantu menciptakan lingkungan rapat yang lebih terstruktur dan profesional.</p>
      
      <h2 class="text-2xl font-semibold mb-3 mt-6">Gunakan Fitur Kolaboratif</h2>
      <p class="mb-4">Platform rapat online modern menawarkan berbagai fitur kolaboratif seperti papan virtual, jajak pendapat, dan berbagi layar. Manfaatkan alat-alat ini untuk meningkatkan keterlibatan dan memfasilitasi diskusi yang lebih interaktif.</p>

      <h2 class="text-2xl font-semibold mb-3 mt-6">Rekam dan Bagikan</h2>
      <p class="mb-4">Gunakan fitur rekaman cloud untuk mendokumentasikan rapat dan membagikan rekaman kepada peserta yang tidak dapat hadir atau untuk referensi di kemudian hari. Rekaman juga berguna untuk meninjau poin-poin penting dan keputusan yang dibuat.</p>
    `,
    excerpt: 'Pelajari cara membuat rapat online Anda lebih produktif dan efisien dengan tips dan trik dari para ahli.',
    date: '10 Juni 2023',
    author: 'Budi Setiawan',
    readTime: '5 menit',
    category: 'Tips & Trik',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070'
  },
  {
    id: 2,
    title: 'Mengapa Model Bayar-Sesuai-Pakai Lebih Ekonomis',
    excerpt: 'Analisis mendalam tentang bagaimana model bayar-sesuai-pakai dapat menghemat biaya rapat online Anda secara signifikan.',
    date: '28 Mei 2023',
    author: 'Dewi Lestari',
    readTime: '7 menit',
    category: 'Bisnis',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070'
  },
  {
    id: 3,
    title: 'Fitur Baru: Laporan Peserta yang Ditingkatkan',
    excerpt: 'Jelajahi fitur laporan peserta baru kami yang memberi Anda wawasan lebih mendalam tentang partisipasi rapat.',
    date: '15 Mei 2023',
    author: 'Adi Nugroho',
    readTime: '4 menit',
    category: 'Fitur Baru',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070'
  },
  {
    id: 4,
    title: 'Keamanan Rapat Online: Praktik Terbaik',
    excerpt: 'Lindungi rapat online Anda dari gangguan dan ancaman keamanan dengan praktik terbaik ini.',
    date: '5 Mei 2023',
    author: 'Siti Rahayu',
    readTime: '6 menit',
    category: 'Keamanan',
    image: 'https://images.unsplash.com/photo-1560264292089-90a7e086ee0c?q=80&w=2070'
  },
  {
    id: 5,
    title: 'Studi Kasus: Bagaimana Perusahaan ABC Menghemat 40% Biaya Rapat',
    excerpt: 'Pelajari bagaimana Perusahaan ABC berhasil mengurangi biaya rapat mereka secara signifikan dengan menggunakan Rapatin.',
    date: '22 April 2023',
    author: 'Budi Setiawan',
    readTime: '8 menit',
    category: 'Studi Kasus',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070'
  },
  {
    id: 6,
    title: 'Menggunakan Rekaman Cloud untuk Meningkatkan Produktivitas Tim',
    excerpt: 'Pelajari cara memanfaatkan rekaman cloud untuk meningkatkan kolaborasi dan produktivitas tim Anda.',
    date: '10 April 2023',
    author: 'Dewi Lestari',
    readTime: '5 menit',
    category: 'Produktivitas',
    image: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=2070'
  }
];

const categories = [
  'Tips & Trik',
  'Bisnis',
  'Fitur Baru',
  'Keamanan',
  'Studi Kasus',
  'Produktivitas'
];

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const blogId = parseInt(id || '1');
  
  // Find the current blog post
  const post = blogPosts.find(post => post.id === blogId) || blogPosts[0];
  
  // Get recommended articles (excluding current article)
  const recommendedPosts = blogPosts
    .filter(recommendedPost => recommendedPost.id !== blogId)
    .slice(0, 5);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Categories and Recommended Articles */}
            <div className="lg:w-1/3">
              {/* Categories Section */}
              <div className="glass rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Tag className="mr-2" size={18} />
                  Kategori
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className="px-3 py-1 cursor-default hover:bg-accent transition-colors"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Recommended Articles - Title List Only */}
              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center border-b pb-2">
                  Artikel Terpopuler
                </h3>
                <div className="space-y-4">
                  {recommendedPosts.map((recommendedPost) => (
                    <div key={recommendedPost.id} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center text-muted-foreground text-xs mb-1.5">
                        <Calendar size={12} className="mr-1" />
                        <span>{recommendedPost.date}</span>
                      </div>
                      <h4 className="font-medium line-clamp-2 hover:text-primary transition-colors">
                        <a 
                          href={`/blog/${recommendedPost.id}`} 
                          className="cursor-default"
                        >
                          {recommendedPost.title}
                        </a>
                      </h4>
                    </div>
                  ))}
                  
                  <a 
                    href="/blog" 
                    className="flex items-center text-primary text-sm font-medium mt-4 cursor-default hover:underline"
                  >
                    Lihat semua artikel
                    <ArrowRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Main Content - Blog Post */}
            <div className="lg:w-2/3">
              <div className="glass rounded-lg overflow-hidden">
                {/* Featured Image */}
                <div className="aspect-video w-full bg-primary/10 relative">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6">
                    <Badge className="mb-2">{post.category}</Badge>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{post.title}</h1>
                  </div>
                </div>
                
                {/* Post Meta */}
                <div className="p-6 pb-3 flex flex-wrap items-center justify-between border-b">
                  <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                    <div className="flex items-center">
                      <User size={18} className="mr-2 text-muted-foreground" />
                      <span className="text-sm">{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={18} className="mr-2 text-muted-foreground" />
                      <span className="text-sm">{post.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock size={18} className="mr-2 text-muted-foreground" />
                    <span className="text-sm">Waktu baca: {post.readTime}</span>
                  </div>
                </div>
                
                {/* Post Content */}
                <div className="p-6">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
                  
                  {/* Share and Tags */}
                  <Separator className="my-6" />
                  
                  <div className="flex flex-wrap justify-between items-center">
                    <div className="mb-4 sm:mb-0">
                      <span className="font-medium mr-2">Tag:</span>
                      <Badge variant="outline" className="cursor-default">{post.category}</Badge>
                    </div>
                    
                    <div>
                      <span className="font-medium mr-2">Bagikan:</span>
                      <div className="inline-flex space-x-2">
                        {/* Dummy share buttons */}
                        <button className="w-8 h-8 rounded-full bg-accent flex items-center justify-center cursor-default hover:bg-accent/80">
                          <span className="text-xs">F</span>
                        </button>
                        <button className="w-8 h-8 rounded-full bg-accent flex items-center justify-center cursor-default hover:bg-accent/80">
                          <span className="text-xs">T</span>
                        </button>
                        <button className="w-8 h-8 rounded-full bg-accent flex items-center justify-center cursor-default hover:bg-accent/80">
                          <span className="text-xs">L</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <FinalCTA />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
