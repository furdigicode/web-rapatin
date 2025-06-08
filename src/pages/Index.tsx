
import React from 'react';
import Navbar from '@/components/Navbar';
import MainHeroSection from '@/components/main/MainHeroSection';
import ProductShowcase from '@/components/main/ProductShowcase';
import TestimonialSection from '@/components/TestimonialSection';
import TabbedPricingSection from '@/components/main/TabbedPricingSection';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <MainHeroSection />
      <ProductShowcase />
      <TabbedPricingSection />
      <TestimonialSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
