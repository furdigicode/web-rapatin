
import React from 'react';
import SEO from '@/components/SEO';
import ProductPageLayout from '@/components/layout/ProductPageLayout';
import Navbar from '@/components/Navbar';
import GenericHeroSection from '@/components/shared/GenericHeroSection';
import GenericFeatureGrid from '@/components/shared/GenericFeatureGrid';
import GenericStepsSection from '@/components/shared/GenericStepsSection';
import DashboardPreview from '@/components/DashboardPreview';
import TestimonialSection from '@/components/TestimonialSection';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import { 
  BarChart3, 
  Calendar, 
  Settings, 
  Users,
  FileText,
  Bell,
  Zap,
  Shield
} from 'lucide-react';

const Dashboard = () => {
  const heroData = {
    badge: "🎯 Kontrol Penuh",
    title: "Dashboard Intuitif - Kelola Meeting dengan Mudah",
    subtitle: "Dashboard modern dan user-friendly untuk mengelola semua kebutuhan meeting online Anda. Penjadwalan, laporan, dan kontrol penuh dalam satu tempat.",
    primaryCTA: {
      text: "Lihat Demo Dashboard",
      href: "#"
    },
    secondaryCTA: {
      text: "Mulai Gratis",
      href: "#"
    },
    highlights: [
      { icon: "BarChart3", text: "Analytics" },
      { icon: "Calendar", text: "Penjadwalan" },
      { icon: "Settings", text: "Kustomisasi" },
      { icon: "Shield", text: "Keamanan" }
    ],
    image: {
      src: "/lovable-uploads/90dcfcfe-cb9e-46e1-88a3-5cf6472dd222.png",
      alt: "Dashboard Rapatin Interface"
    }
  };

  const featureContent = {
    badge: "⚡ Fitur Lengkap",
    title: "Fitur Dashboard yang Powerful",
    subtitle: "Semua yang Anda butuhkan untuk mengelola meeting dengan efisien",
    features: [
      {
        icon: "BarChart3",
        title: "Analytics & Laporan",
        description: "Pantau statistik meeting, partisipasi peserta, dan analisis mendalam tentang performa meeting Anda.",
        delay: "delay-100"
      },
      {
        icon: "Calendar",
        title: "Manajemen Jadwal",
        description: "Kelola semua jadwal meeting dalam satu tempat. Kalender terintegrasi dengan reminder otomatis.",
        delay: "delay-200"
      },
      {
        icon: "Settings",
        title: "Kustomisasi Lengkap",
        description: "Atur preferensi meeting, template, dan pengaturan sesuai kebutuhan organisasi Anda.",
        delay: "delay-300"
      },
      {
        icon: "Users",
        title: "Manajemen Peserta",
        description: "Kelola daftar peserta, undangan, dan hak akses dengan mudah dan terorganisir.",
        delay: "delay-100"
      },
      {
        icon: "FileText",
        title: "Riwayat Meeting",
        description: "Akses semua rekaman, notulen, dan file meeting yang tersimpan dengan pencarian cepat.",
        delay: "delay-200"
      },
      {
        icon: "Bell",
        title: "Notifikasi Real-time",
        description: "Dapatkan pemberitahuan penting tentang meeting, peserta, dan aktivitas lainnya.",
        delay: "delay-300"
      }
    ],
    useCases: {
      title: "Perfect untuk <span class='text-primary'>Semua Tim</span>",
      items: [
        { icon: "Building", title: "Corporate" },
        { icon: "Users", title: "Remote Team" },
        { icon: "GraduationCap", title: "Education" },
        { icon: "Briefcase", title: "Freelancer" }
      ]
    }
  };

  const stepsContent = {
    badge: "🎯 Cara Pakai",
    title: "Cara Menggunakan Dashboard",
    subtitle: "Mulai kelola meeting Anda dengan mudah",
    steps: [
      {
        number: 1,
        icon: "LogIn",
        title: "Login ke Dashboard",
        description: "Akses dashboard Rapatin dengan akun Anda. Interface yang bersih dan mudah dipahami."
      },
      {
        number: 2,
        icon: "Settings", 
        title: "Atur Preferensi",
        description: "Kustomisasi dashboard sesuai kebutuhan. Atur template meeting dan notifikasi."
      },
      {
        number: 3,
        icon: "Calendar",
        title: "Kelola Meeting", 
        description: "Jadwalkan meeting baru, kelola peserta, dan pantau semua aktivitas dari satu tempat."
      },
      {
        number: 4,
        icon: "BarChart3",
        title: "Analisis & Laporan",
        description: "Pantau performa meeting dengan analytics dan buat laporan untuk evaluasi."
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Dashboard Intuitif - Kelola Meeting Online dengan Mudah | Rapatin"
        description="Dashboard modern dan user-friendly untuk mengelola semua kebutuhan meeting online Anda. Analytics, penjadwalan, laporan, dan kontrol penuh dalam satu platform."
        keywords="dashboard meeting, kelola rapat online, manajemen meeting, kontrol rapat, analytics meeting, dashboard zoom"
        url="https://rapatin.id/fitur/dashboard"
      />
      <ProductPageLayout navbar={<Navbar />}>
        <GenericHeroSection content={heroData} />
        <GenericFeatureGrid content={featureContent} />
        <DashboardPreview />
        <GenericStepsSection content={stepsContent} />
        <TestimonialSection />
        <FinalCTA />
        <Footer />
      </ProductPageLayout>
    </div>
  );
};

export default Dashboard;
