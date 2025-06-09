
import React from 'react';
import MeetingSchedulingNavbar from '@/components/MeetingSchedulingNavbar';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import PricingSection from '@/components/PricingSection';
import TestimonialSection from '@/components/TestimonialSection';
import DashboardPreview from '@/components/DashboardPreview';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

const MeetingScheduling = () => {
  return (
    <div className="min-h-screen">
      <MeetingSchedulingNavbar />
      <HeroSection />
      <div id="features">
        <FeatureSection />
      </div>
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <div id="pricing">
        <PricingSection />
      </div>
      <div id="testimonials">
        <TestimonialSection />
      </div>
      <DashboardPreview />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default MeetingScheduling;
