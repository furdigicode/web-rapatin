
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, Clock } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Cara Mengoptimalkan Rapat Online Anda',
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
      image: 'https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=2070'
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
    'Semua',
    'Tips & Trik',
    'Bisnis',
    'Fitur Baru',
    'Keamanan',
    'Studi Kasus',
    'Produktivitas'
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog Rapatin</h1>
            <p className="text-lg text-muted-foreground">
              Wawasan, tips, dan berita terbaru tentang rapat online dan produktivitas.
            </p>
          </div>
          
          {/* Categories */}
          <div className="mb-10 overflow-x-auto">
            <div className="flex justify-center">
            <div className="flex space-x-2 min-w-max">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    index === 0
                      ? 'bg-primary text-white'
                      : 'bg-accent/50 text-foreground hover:bg-accent'
                  } cursor-default`}
                >
                  {category}
                </button>
              ))}
            </div>
            </div>
          </div>
          
          {/* Blog Posts */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {blogPosts.map((post) => (
              <Card key={post.id} className="glass hover:shadow-elevation transition-all duration-300 overflow-hidden">
                <Link to={`/blog/${post.id}`} className="cursor-default">
                  <div className="aspect-video w-full bg-primary/10 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">
                    <Link to={`/blog/${post.id}`} className="hover:text-primary transition-colors cursor-default">
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <User size={14} className="mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
