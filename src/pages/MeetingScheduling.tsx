
import React from 'react';
import SEO from '@/components/SEO';
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
    <>
      <SEO
        title="Meeting Scheduling - Jadwalkan Rapat Zoom Tanpa Langganan | Rapatin"
        description="Jadwalkan rapat Zoom dengan mudah tanpa langganan bulanan. Bayar sesuai penggunaan berdasarkan jumlah peserta. Fitur lengkap: rekaman cloud, durasi unlimited, AI companion."
        keywords="zoom meeting, jadwal rapat, meeting scheduling, zoom tanpa langganan, bayar per rapat, rekaman cloud, rapat online"
        url="https://rapatin.id/meeting-scheduling"
      />
      <ProductPageLayout navbar={<MeetingSchedulingNavbar />}>
        <div className="-mt-28">
          <MeetingHeroSection />
        </div>
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
    </>
  );
};

export default MeetingScheduling;
