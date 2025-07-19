
import React from 'react';
import SEO from '@/components/SEO';
import ProductPageLayout from '@/components/layout/ProductPageLayout';
import Navbar from '@/components/Navbar';
import GenericHeroSection from '@/components/shared/GenericHeroSection';
import GenericFeatureGrid from '@/components/shared/GenericFeatureGrid';
import GenericStepsSection from '@/components/shared/GenericStepsSection';
import TestimonialSection from '@/components/TestimonialSection';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import { 
  Cloud, 
  Play, 
  Download, 
  Shield,
  Search,
  Share2,
  HardDrive,
  Zap
} from 'lucide-react';

const RekamanCloud = () => {
  const heroData = {
    badge: "☁️ Cloud Storage",
    title: "Rekaman Cloud - Simpan & Akses Meeting Kapan Saja",
    subtitle: "Rekam meeting otomatis dan simpan di cloud storage yang aman. Akses, bagikan, dan kelola rekaman meeting dengan mudah dari mana saja.",
    ctaPrimary: "Mulai Rekam Meeting",
    ctaSecondary: "Lihat Demo",
    image: "/lovable-uploads/c64ceec2-7c79-4671-912e-b179358001aa.png",
    imageAlt: "Cloud Recording Storage"
  };

  const features = [
    {
      icon: Cloud,
      title: "Auto Cloud Storage",
      description: "Rekaman meeting otomatis tersimpan di cloud storage yang aman dengan backup redundan."
    },
    {
      icon: Play,
      title: "HD Video Quality", 
      description: "Rekaman berkualitas tinggi dengan audio jernih dan video HD untuk pengalaman viewing terbaik."
    },
    {
      icon: Download,
      title: "Download Fleksibel",
      description: "Download rekaman dalam berbagai format dan kualitas sesuai kebutuhan penyimpanan lokal."
    },
    {
      icon: Shield,
      title: "Keamanan Terjamin",
      description: "Enkripsi end-to-end untuk semua rekaman dengan kontrol akses yang ketat dan audit trail."
    },
    {
      icon: Search,
      title: "Pencarian Cerdas",
      description: "Cari rekaman dengan mudah berdasarkan tanggal, judul, peserta, atau kata kunci dalam transkrip."
    },
    {
      icon: Share2,
      title: "Berbagi Mudah",
      description: "Bagikan rekaman dengan link aman, kontrol akses, dan masa berlaku yang dapat diatur."
    },
    {
      icon: HardDrive,
      title: "Storage Unlimited",
      description: "Kapasitas penyimpanan yang besar tanpa batasan waktu untuk semua rekaman meeting Anda."
    },
    {
      icon: Zap,
      title: "Proses Cepat",
      description: "Rekaman tersedia segera setelah meeting selesai dengan processing time yang minimal."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Aktifkan Recording",
      description: "Nyalakan fitur recording saat membuat meeting atau selama meeting berlangsung."
    },
    {
      number: "02", 
      title: "Meeting Terekam",
      description: "Sistem otomatis merekam seluruh meeting dengan kualitas HD dan audio jernih."
    },
    {
      number: "03",
      title: "Otomatis ke Cloud", 
      description: "Rekaman otomatis diupload dan tersimpan aman di cloud storage setelah meeting."
    },
    {
      number: "04",
      title: "Akses Kapan Saja",
      description: "Akses, tonton, download, atau bagikan rekaman dari dashboard Anda kapan pun dibutuhkan."
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="Rekaman Cloud - Simpan & Akses Meeting Kapan Saja | Rapatin"
        description="Rekam meeting otomatis dan simpan di cloud storage yang aman. Download HD, berbagi dengan link aman, dan akses rekaman meeting dari mana saja kapan saja."
        keywords="rekaman cloud meeting, cloud recording, simpan meeting, rekam zoom, download meeting, cloud storage meeting"
        url="https://rapatin.id/fitur/rekaman-cloud"
      />
      <ProductPageLayout navbar={<Navbar />}>
        <GenericHeroSection {...heroData} />
        <GenericFeatureGrid 
          title="Fitur Rekaman Cloud Terdepan"
          subtitle="Teknologi cloud recording yang aman, cepat, dan mudah digunakan"
          features={features}
        />
        <GenericStepsSection
          title="Cara Kerja Rekaman Cloud"
          subtitle="Proses otomatis yang simpel dan efisien"
          steps={steps}
        />
        <TestimonialSection />
        <FinalCTA />
        <Footer />
      </ProductPageLayout>
    </div>
  );
};

export default RekamanCloud;
