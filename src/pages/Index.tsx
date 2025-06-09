
import React from 'react';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import MainHeroSection from '@/components/main/MainHeroSection';
import ProductShowcase from '@/components/main/ProductShowcase';
import TestimonialSection from '@/components/TestimonialSection';
import TabbedPricingSection from '@/components/main/TabbedPricingSection';
import IndexFinalCTA from '@/components/main/IndexFinalCTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Rapatin - Platform Meeting Online Terlengkap Indonesia"
        description="Platform lengkap untuk meeting, event, dan appointment booking. Bayar sesuai penggunaan dengan harga fleksibel. Zoom scheduling, event management, dan appointment booking dalam satu platform."
        keywords="meeting online, zoom scheduling, event management, appointment booking, platform meeting indonesia, bayar sesuai pakai, jadwal rapat"
        url="https://rapatin.id"
      />
      <Navbar />
      <MainHeroSection />
      <ProductShowcase />
      <TabbedPricingSection />
      <TestimonialSection />
      <IndexFinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
