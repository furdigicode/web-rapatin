
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const BlogPostSkeleton = () => {
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
};

export default BlogPostSkeleton;
