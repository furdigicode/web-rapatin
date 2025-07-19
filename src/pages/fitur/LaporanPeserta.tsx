
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
  FileText, 
  BarChart3, 
  Download, 
  Clock,
  Users,
  TrendingUp,
  Filter,
  Calendar
} from 'lucide-react';

const LaporanPeserta = () => {
  const heroData = {
    badge: "📊 Analytics Detail",
    title: "Laporan Peserta - Insights Meeting yang Mendalam",
    subtitle: "Dapatkan laporan lengkap tentang partisipasi peserta, durasi kehadiran, dan analytics meeting untuk evaluasi yang lebih baik.",
    primaryCTA: {
      text: "Lihat Demo Laporan",
      href: "#"
    },
    secondaryCTA: {
      text: "Mulai Gratis",
      href: "#"
    },
    highlights: [
      { icon: "FileText", text: "Laporan Detail" },
      { icon: "BarChart3", text: "Analytics Visual" },
      { icon: "Download", text: "Export Multi Format" },
      { icon: "Clock", text: "Real-time Tracking" }
    ],
    image: {
      src: "/lovable-uploads/e7e34560-7715-4bb4-9fa9-26f74f4090b8.png",
      alt: "Laporan Peserta Meeting"
    }
  };

  const featureContent = {
    badge: "📈 Fitur Analytics",
    title: "Fitur Laporan yang Powerful",
    subtitle: "Analytics mendalam untuk evaluasi meeting yang lebih efektif",
    features: [
      {
        icon: "FileText",
        title: "Laporan Komprehensif",
        description: "Laporan detail tentang setiap peserta: waktu masuk, keluar, durasi kehadiran, dan tingkat partisipasi.",
        delay: "delay-100"
      },
      {
        icon: "BarChart3",
        title: "Analytics Visual",
        description: "Grafik dan chart yang mudah dipahami untuk melihat tren partisipasi dan engagement peserta.",
        delay: "delay-200"
      },
      {
        icon: "Download",
        title: "Export Multi Format",
        description: "Download laporan dalam format PDF, Excel, atau CSV untuk analisis lebih lanjut atau dokumentasi.",
        delay: "delay-300"
      },
      {
        icon: "Clock",
        title: "Tracking Waktu Real-time",
        description: "Pelacakan waktu kehadiran secara real-time dengan akurasi tinggi untuk setiap peserta.",
        delay: "delay-100"
      },
      {
        icon: "Users",
        title: "Profil Peserta Detail",
        description: "Informasi lengkap peserta termasuk frekuensi kehadiran dan tingkat engagement historical.",
        delay: "delay-200"
      },
      {
        icon: "TrendingUp",
        title: "Analisis Tren",
        description: "Identifikasi pola kehadiran dan engagement untuk meningkatkan efektivitas meeting mendatang.",
        delay: "delay-300"
      }
    ],
    useCases: {
      title: "Ideal untuk <span class='text-primary'>Berbagai Kebutuhan</span>",
      items: [
        { icon: "Building", title: "HR & Training" },
        { icon: "GraduationCap", title: "Education" },
        { icon: "Users", title: "Team Lead" },
        { icon: "BarChart3", title: "Analytics" }
      ]
    }
  };

  const stepsContent = {
    badge: "⚡ Otomatis",
    title: "Cara Kerja Laporan Peserta",
    subtitle: "Otomatis dan akurat untuk setiap meeting",
    steps: [
      {
        number: 1,
        icon: "Play",
        title: "Meeting Berlangsung",
        description: "Sistem otomatis merekam data partisipasi setiap peserta selama meeting berlangsung."
      },
      {
        number: 2,
        icon: "Database", 
        title: "Data Ter-compile",
        description: "Setelah meeting selesai, semua data partisipasi dikompilasi menjadi laporan terstruktur."
      },
      {
        number: 3,
        icon: "FileBarChart",
        title: "Generate Laporan", 
        description: "Akses laporan melalui dashboard dengan berbagai format visualisasi yang informatif."
      },
      {
        number: 4,
        icon: "TrendingUp",
        title: "Analisis & Action",
        description: "Gunakan insights dari laporan untuk meningkatkan engagement dan efektivitas meeting."
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Laporan Peserta - Analytics Meeting yang Mendalam | Rapatin"
        description="Dapatkan laporan lengkap tentang partisipasi peserta, durasi kehadiran, dan analytics meeting. Export ke PDF/Excel untuk evaluasi yang lebih baik."
        keywords="laporan peserta meeting, analytics meeting, tracking kehadiran, report attendance, evaluasi meeting, partisipasi peserta"
        url="https://rapatin.id/fitur/laporan-peserta"
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

export default LaporanPeserta;
