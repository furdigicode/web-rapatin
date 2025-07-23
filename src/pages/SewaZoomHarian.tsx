
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
        title="Sewa Zoom Harian - Link Zoom Tanpa Langganan Bulanan | Rapatin"
        description="Sewa zoom harian mulai Rp 20.000. Link zoom siap pakai tanpa langganan bulanan. Cocok untuk webinar, kelas online, rapat penting. Kapasitas 100-1000 peserta."
        keywords="sewa zoom harian, link zoom harian, zoom tanpa langganan, booking zoom harian, rental zoom meeting, webinar tanpa langganan, kelas online zoom, rapat zoom harian, sewa akun zoom"
        url="https://rapatin.id/sewa-zoom-harian"
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
