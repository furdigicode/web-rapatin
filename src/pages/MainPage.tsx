
import React, { lazy, Suspense } from 'react';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import MainHeroSection from '@/components/main/MainHeroSection';
import { LazySection } from '@/components/LazySection';

// Lazy load below-the-fold components
const ProductShowcase = lazy(() => import('@/components/main/ProductShowcase'));
const TestimonialSection = lazy(() => import('@/components/TestimonialSection'));
const TabbedPricingSection = lazy(() => import('@/components/main/TabbedPricingSection'));
const Footer = lazy(() => import('@/components/Footer'));

const MainPage = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Rapatin - Platform Meeting Online Terlengkap Indonesia"
        description="Platform lengkap untuk meeting, event, dan appointment booking. Bayar sesuai penggunaan dengan harga fleksibel. Zoom scheduling, event management, dan appointment booking dalam satu platform."
        keywords="meeting online, zoom scheduling, event management, appointment booking, platform meeting indonesia, bayar sesuai pakai, jadwal rapat"
        url="https://rapatin.id/main-page"
      />
      <Navbar />
      <MainHeroSection />
      
      <LazySection fallbackHeight="600px">
        <Suspense fallback={<div className="h-[600px] animate-pulse bg-muted/10" />}>
          <ProductShowcase />
        </Suspense>
      </LazySection>
      
      <LazySection fallbackHeight="600px">
        <Suspense fallback={<div className="h-[600px] animate-pulse bg-muted/10" />}>
          <TestimonialSection />
        </Suspense>
      </LazySection>
      
      <LazySection fallbackHeight="800px">
        <Suspense fallback={<div className="h-[800px] animate-pulse bg-muted/10" />}>
          <TabbedPricingSection />
        </Suspense>
      </LazySection>
      
      <LazySection fallbackHeight="300px">
        <Suspense fallback={<div className="h-[300px] animate-pulse bg-muted/10" />}>
          <Footer />
        </Suspense>
      </LazySection>
    </div>
  );
};

export default MainPage;
