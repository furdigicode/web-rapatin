
import React from 'react';
import ProductPageLayout from '@/components/layout/ProductPageLayout';
import MeetingSchedulingNavbar from '@/components/MeetingSchedulingNavbar';
import MeetingHeroSection from '@/components/meeting/MeetingHeroSection';
import MeetingFeatureSection from '@/components/meeting/MeetingFeatureSection';
import MeetingHowItWorksSection from '@/components/meeting/MeetingHowItWorksSection';
import PricingSection from '@/components/PricingSection';
import TestimonialSection from '@/components/TestimonialSection';
import DashboardPreview from '@/components/DashboardPreview';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

const MeetingScheduling: React.FC = () => {
  return (
    <ProductPageLayout navbar={<MeetingSchedulingNavbar />}>
      <MeetingHeroSection />
      <MeetingFeatureSection />
      <MeetingHowItWorksSection />
      <div id="pricing">
        <PricingSection />
      </div>
      <div id="testimonials">
        <TestimonialSection />
      </div>
      <DashboardPreview />
      <FinalCTA />
      <Footer />
    </ProductPageLayout>
  );
};

export default MeetingScheduling;
