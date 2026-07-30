
import React from 'react';
import SEO from '@/components/SEO';
import ProductPageLayout from '@/components/layout/ProductPageLayout';
import MeetingSchedulingNavbar from '@/components/MeetingSchedulingNavbar';
import SewaZoomHarianSection from '@/components/meeting/SewaZoomHarianSection';
import PricingSection from '@/components/PricingSection';
import TestimonialSection from '@/components/TestimonialSection';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

const SewaZoomHarian: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Sewa Zoom Harian",
    "description": "Layanan sewa zoom harian tanpa langganan bulanan. Link zoom siap pakai untuk webinar, kelas online, dan rapat penting.",
    "provider": {
      "@type": "Organization",
      "name": "Rapatin",
      "url": "https://rapatin.id"
    },
    "serviceType": "Meeting Platform Rental",
    "areaServed": "Indonesia",
    "offers": {
      "@type": "Offer",
      "price": "15000",
      "priceCurrency": "IDR",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <SEO
        route="/sewa-zoom-harian"
        structuredData={structuredData}
      />
      <ProductPageLayout navbar={<MeetingSchedulingNavbar />}>
        <SewaZoomHarianSection />
        <div id="pricing">
          <PricingSection />
        </div>
        <div id="testimonials">
          <TestimonialSection />
        </div>
        <FinalCTA />
        <Footer />
      </ProductPageLayout>
    </>
  );
};

export default SewaZoomHarian;
