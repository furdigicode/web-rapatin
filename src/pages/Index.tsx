
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import PricingSection from '@/components/PricingSection';
import DashboardPreview from '@/components/DashboardPreview';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <PricingSection />
      <DashboardPreview />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
