
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
    primaryCTA: {
      text: "Mulai Rekam Meeting",
      href: "#"
    },
    secondaryCTA: {
      text: "Lihat Demo",
      href: "#"
    },
    highlights: [
      { icon: "Cloud", text: "Auto Storage" },
      { icon: "Play", text: "HD Quality" },
      { icon: "Download", text: "Download Fleksibel" },
      { icon: "Shield", text: "Keamanan Terjamin" }
    ],
    image: {
      src: "/lovable-uploads/c64ceec2-7c79-4671-912e-b179358001aa.png",
      alt: "Cloud Recording Storage"
    }
  };

  const featureContent = {
    badge: "☁️ Fitur Unggulan",
    title: "Fitur Cloud Recording Terdepan",
    subtitle: "Solusi penyimpanan dan akses rekaman meeting yang aman dan mudah",
    features: [
      {
        icon: "Cloud",
        title: "Auto Cloud Storage",
        description: "Rekaman meeting otomatis tersimpan di cloud storage yang aman dengan backup redundan.",
        delay: "delay-100"
      },
      {
        icon: "Play",
        title: "HD Video Quality", 
        description: "Rekaman berkualitas tinggi dengan audio jernih dan video HD untuk pengalaman viewing terbaik.",
        delay: "delay-200"
      },
      {
        icon: "Download",
        title: "Download Fleksibel",
        description: "Download rekaman dalam berbagai format dan kualitas sesuai kebutuhan penyimpanan lokal.",
        delay: "delay-300"
      },
      {
        icon: "Shield",
        title: "Keamanan Terjamin",
        description: "Enkripsi end-to-end untuk semua rekaman dengan kontrol akses yang ketat dan audit trail.",
        delay: "delay-100"
      },
      {
        icon: "Search",
        title: "Pencarian Cerdas",
        description: "Cari rekaman dengan mudah berdasarkan tanggal, judul, peserta, atau kata kunci dalam transkrip.",
        delay: "delay-200"
      },
      {
        icon: "Share2",
        title: "Berbagi Mudah",
        description: "Bagikan rekaman dengan link aman, kontrol akses, dan masa berlaku yang dapat diatur.",
        delay: "delay-300"
      }
    ],
    useCases: {
      title: "Perfect untuk <span class='text-primary'>Semua Kebutuhan</span>",
      items: [
        { icon: "Building", title: "Corporate" },
        { icon: "GraduationCap", title: "Training" },
        { icon: "Users", title: "Webinar" },
        { icon: "FileText", title: "Documentation" }
      ]
    }
  };

  const stepsContent = {
    badge: "🎬 Proses Mudah",
    title: "Cara Kerja Rekaman Cloud",
    subtitle: "Otomatis, aman, dan mudah diakses",
    steps: [
      {
        number: 1,
        icon: "Record",
        title: "Aktifkan Recording",
        description: "Nyalakan fitur recording saat membuat meeting atau selama meeting berlangsung."
      },
      {
        number: 2,
        icon: "Video", 
        title: "Meeting Terekam",
        description: "Sistem otomatis merekam seluruh meeting dengan kualitas HD dan audio jernih."
      },
      {
        number: 3,
        icon: "Upload",
        title: "Otomatis ke Cloud", 
        description: "Rekaman otomatis diupload dan tersimpan aman di cloud storage setelah meeting."
      },
      {
        number: 4,
        icon: "Play",
        title: "Akses Kapan Saja",
        description: "Akses, tonton, download, atau bagikan rekaman dari dashboard Anda kapan pun dibutuhkan."
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Rekaman Cloud - Simpan & Akses Meeting Kapan Saja | Rapatin"
        description="Rekam meeting otomatis dan simpan di cloud storage yang aman. Download HD, berbagi dengan link aman, dan akses rekaman meeting dari mana saja kapan saja."
        keywords="rekaman cloud meeting, cloud recording, simpan meeting, rekam zoom, download meeting, cloud storage meeting"
        url="https://rapatin.id/fitur/rekaman-cloud"
      />
      <ProductPageLayout navbar={<Navbar />}>
        <GenericHeroSection content={heroData} />
        <GenericFeatureGrid content={featureContent} />
        <GenericStepsSection content={stepsContent} />
        <TestimonialSection />
        <FinalCTA />
        <Footer />
      </ProductPageLayout>
    </div>
  );
};

export default RekamanCloud;
