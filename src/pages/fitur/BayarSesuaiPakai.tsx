
import React from 'react';
import SEO from '@/components/SEO';
import ProductPageLayout from '@/components/layout/ProductPageLayout';
import Navbar from '@/components/Navbar';
import GenericHeroSection from '@/components/shared/GenericHeroSection';
import GenericFeatureGrid from '@/components/shared/GenericFeatureGrid';
import GenericStepsSection from '@/components/shared/GenericStepsSection';
import PricingSection from '@/components/PricingSection';
import TestimonialSection from '@/components/TestimonialSection';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import { 
  CreditCard, 
  Calculator, 
  TrendingDown, 
  CheckCircle,
  DollarSign,
  BarChart3,
  PiggyBank,
  Users
} from 'lucide-react';

const BayarSesuaiPakai = () => {
  const heroData = {
    badge: "💰 Hemat & Fleksibel",
    title: "Bayar Sesuai Pakai - Solusi Meeting Hemat",
    subtitle: "Tidak ada langganan bulanan! Bayar hanya saat menggunakan meeting online. Hemat hingga 70% dari biaya meeting konvensional.",
    primaryCTA: {
      text: "Mulai Hemat Sekarang",
      href: "#"
    },
    secondaryCTA: {
      text: "Lihat Kalkulator Biaya",
      href: "#"
    },
    highlights: [
      { icon: "CreditCard", text: "Tanpa Langganan" },
      { icon: "Calculator", text: "Transparan" },
      { icon: "TrendingDown", text: "Hemat 70%" },
      { icon: "CheckCircle", text: "Fitur Lengkap" }
    ],
    image: {
      src: "/lovable-uploads/75085a74-99ab-4c7a-bb7f-9aa9fc2559a6.png",
      alt: "Bayar Sesuai Pakai Rapatin"
    }
  };

  const featureContent = {
    badge: "💰 Keunggulan",
    title: "Mengapa Memilih Bayar Sesuai Pakai?",
    subtitle: "Model pembayaran yang adil dan transparan untuk semua kebutuhan meeting Anda",
    features: [
      {
        icon: "CreditCard",
        title: "Tanpa Langganan Bulanan",
        description: "Tidak ada biaya berulang. Bayar hanya ketika Anda menggunakan layanan meeting online.",
        delay: "delay-100"
      },
      {
        icon: "Calculator",
        title: "Transparan & Mudah Diprediksi",
        description: "Hitung biaya meeting dengan mudah. Tarif jelas berdasarkan jumlah peserta dan durasi.",
        delay: "delay-200"
      },
      {
        icon: "TrendingDown",
        title: "Hemat Hingga 70%",
        description: "Bandingkan dengan layanan meeting premium lainnya. Rapatin lebih terjangkau untuk semua.",
        delay: "delay-300"
      },
      {
        icon: "CheckCircle",
        title: "Fitur Lengkap Tanpa Batas",
        description: "Dapatkan semua fitur premium: rekaman cloud, durasi unlimited, AI companion.",
        delay: "delay-100"
      },
      {
        icon: "DollarSign",
        title: "Mulai dari Rp 2.500",
        description: "Tarif mulai rendah untuk meeting kecil. Semakin besar meeting, semakin efisien biayanya.",
        delay: "delay-200"
      },
      {
        icon: "BarChart3",
        title: "Laporan Penggunaan Detail",
        description: "Pantau dan analisis penggunaan meeting Anda dengan laporan yang komprehensif.",
        delay: "delay-300"
      }
    ],
    useCases: {
      title: "Cocok untuk Berbagai <span class='text-primary'>Kebutuhan</span>",
      items: [
        { icon: "PiggyBank", title: "Startup & UKM" },
        { icon: "Users", title: "Tim Remote" },
        { icon: "Building", title: "Perusahaan" },
        { icon: "GraduationCap", title: "Pendidikan" }
      ]
    }
  };

  const stepsContent = {
    badge: "🚀 Mudah Dimulai",
    title: "Cara Kerja Bayar Sesuai Pakai",
    subtitle: "Prosesnya mudah dan transparan",
    steps: [
      {
        number: 1,
        icon: "UserPlus",
        title: "Daftar Gratis",
        description: "Buat akun Rapatin tanpa biaya. Tidak ada biaya pendaftaran atau setup."
      },
      {
        number: 2,
        icon: "Calendar", 
        title: "Jadwalkan Meeting",
        description: "Pilih tanggal, waktu, dan jumlah peserta. Sistem akan menghitung biaya otomatis."
      },
      {
        number: 3,
        icon: "CreditCard",
        title: "Bayar Saat Digunakan", 
        description: "Bayar hanya ketika meeting berlangsung. Berbagai metode pembayaran tersedia."
      },
      {
        number: 4,
        icon: "CheckCircle",
        title: "Meeting & Hemat",
        description: "Nikmati meeting berkualitas tinggi dengan biaya yang transparan dan hemat."
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Bayar Sesuai Pakai - Model Pembayaran Fleksibel Meeting Online | Rapatin"
        description="Hemat lebih banyak dengan model bayar sesuai pakai. Tidak ada langganan bulanan, bayar hanya saat menggunakan meeting online. Mulai dari Rp 2.500 per meeting."
        keywords="bayar sesuai pakai, pay as you go meeting, tanpa langganan zoom, hemat biaya rapat, meeting murah, pembayaran fleksibel"
        url="https://rapatin.id/fitur/bayar-sesuai-pakai"
      />
      <ProductPageLayout navbar={<Navbar />}>
        <GenericHeroSection content={heroData} />
        <GenericFeatureGrid content={featureContent} />
        <GenericStepsSection content={stepsContent} />
        <PricingSection />
        <TestimonialSection />
        <FinalCTA />
        <Footer />
      </ProductPageLayout>
    </div>
  );
};

export default BayarSesuaiPakai;
