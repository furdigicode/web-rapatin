
import React, { lazy, Suspense } from 'react';
import SEO from '@/components/SEO';
import ProductPageLayout from '@/components/layout/ProductPageLayout';
import MeetingSchedulingNavbar from '@/components/MeetingSchedulingNavbar';
import MeetingHeroSection from '@/components/meeting/MeetingHeroSection';
import { LazySection } from '@/components/LazySection';

// Lazy load below-the-fold components
const MeetingFeatureSection = lazy(() => import('@/components/meeting/MeetingFeatureSection'));
const MeetingHowItWorksSection = lazy(() => import('@/components/meeting/MeetingHowItWorksSection'));
const PricingSection = lazy(() => import('@/components/PricingSection'));
const TestimonialSection = lazy(() => import('@/components/TestimonialSection'));
const DashboardPreview = lazy(() => import('@/components/DashboardPreview'));
const FinalCTA = lazy(() => import('@/components/FinalCTA'));
const Footer = lazy(() => import('@/components/Footer'));

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
        
        <LazySection fallbackHeight="600px">
          <Suspense fallback={<div className="h-[600px] animate-pulse bg-muted/10" />}>
            <MeetingFeatureSection />
          </Suspense>
        </LazySection>
        
        <LazySection fallbackHeight="500px">
          <Suspense fallback={<div className="h-[500px] animate-pulse bg-muted/10" />}>
            <MeetingHowItWorksSection />
          </Suspense>
        </LazySection>
        
        <div id="pricing">
          <LazySection fallbackHeight="700px">
            <Suspense fallback={<div className="h-[700px] animate-pulse bg-muted/10" />}>
              <PricingSection />
            </Suspense>
          </LazySection>
        </div>
        
        <div id="testimonials">
          <LazySection fallbackHeight="600px">
            <Suspense fallback={<div className="h-[600px] animate-pulse bg-muted/10" />}>
              <TestimonialSection />
            </Suspense>
          </LazySection>
        </div>
        
        <LazySection fallbackHeight="500px">
          <Suspense fallback={<div className="h-[500px] animate-pulse bg-muted/10" />}>
            <DashboardPreview />
          </Suspense>
        </LazySection>
        
        <LazySection fallbackHeight="400px">
          <Suspense fallback={<div className="h-[400px] animate-pulse bg-muted/10" />}>
            <FinalCTA />
          </Suspense>
        </LazySection>
        
        <LazySection fallbackHeight="300px">
          <Suspense fallback={<div className="h-[300px] animate-pulse bg-muted/10" />}>
            <Footer />
          </Suspense>
        </LazySection>
      </ProductPageLayout>
    </>
  );
};

export default MeetingScheduling;
