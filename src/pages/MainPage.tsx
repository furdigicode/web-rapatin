
import React from 'react';
import Navbar from '@/components/Navbar';
import MainHeroSection from '@/components/main/MainHeroSection';
import BrandCarousel from '@/components/main/BrandCarousel';
import ProductShowcase from '@/components/main/ProductShowcase';
import TestimonialSection from '@/components/TestimonialSection';
import TabbedPricingSection from '@/components/main/TabbedPricingSection';
import Footer from '@/components/Footer';

const MainPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <MainHeroSection />
      <BrandCarousel />
      <ProductShowcase />
      <TestimonialSection />
      <TabbedPricingSection />
      <Footer />
    </div>
  );
};

export default MainPage;
