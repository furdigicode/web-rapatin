
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';

// Static blog data
const blogPosts = [
  {
    id: '1',
    title: '5 Tips Efektif untuk Meeting Online yang Produktif',
    slug: '5-tips-efektif-meeting-online-produktif',
    excerpt: 'Pelajari 5 tips terbaik untuk membuat meeting online Anda lebih produktif dan efisien. Dari persiapan hingga follow-up yang tepat.',
    coverImage: '/lovable-uploads/meeting-productivity.jpg',
    category: 'Tips & Tricks',
    author: 'Admin',
    date: '8 Juli 2025',
    content: `
      <h2>Meeting Online yang Lebih Produktif</h2>
      <p>Meeting online telah menjadi bagian integral dari kehidupan kerja modern. Namun, tidak semua meeting online berjalan dengan efektif. Berikut adalah 5 tips yang dapat membantu Anda membuat meeting online yang lebih produktif:</p>
      
      <h3>1. Persiapan yang Matang</h3>
      <p>Sebelum meeting dimulai, pastikan Anda telah:</p>
      <ul>
        <li>Menyiapkan agenda yang jelas</li>
        <li>Mengirim undangan dengan detail lengkap</li>
        <li>Testing audio dan video sebelum meeting</li>
      </ul>
      
      <h3>2. Gunakan Fitur Mute dengan Bijak</h3>
      <p>Mute mikrofon ketika tidak berbicara untuk menghindari noise yang mengganggu. Aktifkan kembali ketika akan berbicara.</p>
      
      <h3>3. Batasi Durasi Meeting</h3>
      <p>Meeting yang efektif sebaiknya tidak lebih dari 60 menit. Untuk diskusi panjang, bagi menjadi beberapa sesi.</p>
      
      <h3>4. Gunakan Fitur Screen Sharing</h3>
      <p>Manfaatkan fitur screen sharing untuk presentasi yang lebih interaktif dan jelas.</p>
      
      <h3>5. Follow-up yang Tepat</h3>
      <p>Setelah meeting, kirim summary dan action items kepada semua peserta untuk memastikan semua poin penting tercatat.</p>
      
      <p>Dengan menerapkan tips-tips di atas, meeting online Anda akan menjadi lebih efektif dan produktif!</p>
    `
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog Rapatin</h1>
            <p className="text-lg text-muted-foreground">
              Artikel dan tips seputar meeting online dan produktivitas
            </p>
          </div>
          
          {/* Blog Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
