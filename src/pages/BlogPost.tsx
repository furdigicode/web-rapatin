
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft } from 'lucide-react';

// Static blog data (same as in Blog.tsx)
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

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
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
            {post.coverImage && (
              <img 
                src={post.coverImage} 
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
                <span>{post.date}</span>
              </div>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                {post.category}
              </span>
            </div>
            
            {/* Content */}
            <div 
              className="prose max-w-none mb-10 text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                fontSize: '16px',
                lineHeight: '1.6'
              }}
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
