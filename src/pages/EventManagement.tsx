import React, { useState } from 'react';
import SEO from '@/components/SEO';
import ProductPageLayout from '@/components/layout/ProductPageLayout';
import MeetingSchedulingNavbar from '@/components/MeetingSchedulingNavbar';
import GenericHeroSection from '@/components/shared/GenericHeroSection';
import GenericFeatureGrid from '@/components/shared/GenericFeatureGrid';
import GenericStepsSection from '@/components/shared/GenericStepsSection';
import PlatformOptionsSection from '@/components/shared/PlatformOptionsSection';
import EventPricingSection from '@/components/event/EventPricingSection';
import TestimonialSection from '@/components/TestimonialSection';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import FreeTrialModal from '@/components/ui/free-trial-modal';
import { eventHeroContent, eventFeatureContent, eventHowItWorksContent } from '@/content/eventContent';

const EventManagement: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleRegistration = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CTAClick');
    }
    setModalOpen(true);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Rapatin Event Management System",
    "description": "Platform lengkap untuk membuat, mengelola, dan memonetisasi event online maupun offline dengan sistem pembayaran terintegrasi dan reminder otomatis",
    "url": "https://rapatin.id/event-management",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "1.5",
      "priceCurrency": "IDR",
      "description": "Platform fee 1.5% dari harga tiket yang terjual"
    },
    "features": [
      "Event Builder",
      "Halaman Event Publik",
      "Sistem Pembayaran Terintegrasi",
      "Manajemen Peserta",
      "Reminder Otomatis",
      "Analitik Event"
    ]
  };

  return (
    <>
      <SEO
        title="Event Management System - Kelola Webinar & Event Skala Besar | Rapatin"
        description="Platform lengkap untuk membuat, mengelola, dan memonetisasi event online maupun offline. Sistem pembayaran terintegrasi, reminder otomatis, dan analitik real-time."
        keywords="event management, webinar, workshop, sistem pembayaran event, tiket online, manajemen peserta"
        url="https://rapatin.id/event-management"
        structuredData={structuredData}
      />
      
      <ProductPageLayout navbar={<MeetingSchedulingNavbar />}>
        <div className="-mt-28">
          <GenericHeroSection 
            content={eventHeroContent}
            onPrimaryCTA={handleRegistration}
            showBrands={true}
          />
        </div>
        
        <GenericFeatureGrid content={eventFeatureContent} />
        
        <GenericStepsSection 
          content={eventHowItWorksContent}
          sectionId="how-it-works"
        />
        
        <PlatformOptionsSection />
        
        <EventPricingSection />
        
        <TestimonialSection />
        
        <FinalCTA />
        
        <Footer />
      </ProductPageLayout>

      <FreeTrialModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default EventManagement;