
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import BrandLogosSection from '@/components/BrandLogosSection';
import FeatureSection from '@/components/FeatureSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import PricingSection from '@/components/PricingSection';
import TestimonialSection from '@/components/TestimonialSection';
import DashboardPreview from '@/components/DashboardPreview';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <BrandLogosSection />
      <FeatureSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialSection />
      <DashboardPreview />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
