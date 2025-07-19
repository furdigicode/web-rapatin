import React from 'react';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Blog = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Blog Rapatin - Artikel & Tips Meeting Online Terbaik Indonesia"
        description="Baca artikel terbaru seputar meeting online, tips produktivitas, panduan Zoom, dan strategi rapat efektif. Update terkini dari platform Rapatin."
        keywords="blog rapatin, artikel meeting online, tips zoom, panduan rapat virtual, produktivitas meeting"
        canonicalUrl="https://rapatin.id/blog"
        type="website"
      />
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              Blog
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Artikel & Tips Meeting Online</h1>
            <p className="text-lg text-muted-foreground">
              Baca artikel terbaru seputar meeting online, tips produktivitas, dan strategi rapat efektif.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="glass p-6 rounded-xl hover:shadow-elevation transition-all duration-300">
              <h3 className="text-xl font-semibold mb-2">5 Tips Meningkatkan Produktivitas Meeting Online</h3>
              <p className="text-muted-foreground">Pelajari cara memaksimalkan efisiensi dan hasil dari setiap meeting virtual Anda.</p>
              <a href="/blog/tips-produktivitas-meeting" className="inline-block mt-4 text-primary hover:underline">Baca Selengkapnya</a>
            </div>
            
            <div className="glass p-6 rounded-xl hover:shadow-elevation transition-all duration-300">
              <h3 className="text-xl font-semibold mb-2">Panduan Lengkap Menggunakan Zoom untuk Pemula</h3>
              <p className="text-muted-foreground">Dapatkan panduan langkah demi langkah untuk memulai dan mengoptimalkan penggunaan Zoom.</p>
              <a href="/blog/panduan-zoom-pemula" className="inline-block mt-4 text-primary hover:underline">Baca Selengkapnya</a>
            </div>
            
            <div className="glass p-6 rounded-xl hover:shadow-elevation transition-all duration-300">
              <h3 className="text-xl font-semibold mb-2">Strategi Rapat Efektif: Dari Perencanaan hingga Tindak Lanjut</h3>
              <p className="text-muted-foreground">Temukan strategi untuk merencanakan, melaksanakan, dan menindaklanjuti rapat agar lebih efektif.</p>
              <a href="/blog/strategi-rapat-efektif" className="inline-block mt-4 text-primary hover:underline">Baca Selengkapnya</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
