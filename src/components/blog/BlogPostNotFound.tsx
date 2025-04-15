
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const BlogPostNotFound = () => {
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
};

export default BlogPostNotFound;
