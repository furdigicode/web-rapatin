
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
    ctaPrimary: "Mulai Hemat Sekarang",
    ctaSecondary: "Lihat Kalkulator Biaya",
    image: "/lovable-uploads/75085a74-99ab-4c7a-bb7f-9aa9fc2559a6.png",
    imageAlt: "Bayar Sesuai Pakai Rapatin"
  };

  const features = [
    {
      icon: CreditCard,
      title: "Tanpa Langganan Bulanan",
      description: "Tidak ada biaya berulang. Bayar hanya ketika Anda menggunakan layanan meeting online."
    },
    {
      icon: Calculator,
      title: "Transparan & Mudah Diprediksi",
      description: "Hitung biaya meeting dengan mudah. Tarif jelas berdasarkan jumlah peserta dan durasi."
    },
    {
      icon: TrendingDown,
      title: "Hemat Hingga 70%",
      description: "Bandingkan dengan layanan meeting premium lainnya. Rapatin lebih terjangkau untuk semua."
    },
    {
      icon: CheckCircle,
      title: "Fitur Lengkap Tanpa Batas",
      description: "Dapatkan semua fitur premium: rekaman cloud, durasi unlimited, AI companion."
    },
    {
      icon: DollarSign,
      title: "Mulai dari Rp 2.500",
      description: "Tarif mulai rendah untuk meeting kecil. Semakin besar meeting, semakin efisien biayanya."
    },
    {
      icon: BarChart3,
      title: "Laporan Penggunaan Detail",
      description: "Pantau dan analisis penggunaan meeting Anda dengan laporan yang komprehensif."
    },
    {
      icon: PiggyBank,
      title: "Cocok untuk Startup & UKM",
      description: "Model pembayaran yang ramah untuk bisnis kecil dan startup yang ingin menghemat budget."
    },
    {
      icon: Users,
      title: "Skala Sesuai Kebutuhan",
      description: "Mulai dari meeting pribadi hingga webinar besar. Bayar sesuai skala penggunaan Anda."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Daftar Gratis",
      description: "Buat akun Rapatin tanpa biaya. Tidak ada biaya pendaftaran atau setup."
    },
    {
      number: "02", 
      title: "Jadwalkan Meeting",
      description: "Pilih tanggal, waktu, dan jumlah peserta. Sistem akan menghitung biaya otomatis."
    },
    {
      number: "03",
      title: "Bayar Saat Digunakan", 
      description: "Bayar hanya ketika meeting berlangsung. Berbagai metode pembayaran tersedia."
    },
    {
      number: "04",
      title: "Meeting & Hemat",
      description: "Nikmati meeting berkualitas tinggi dengan biaya yang transparan dan hemat."
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="Bayar Sesuai Pakai - Model Pembayaran Fleksibel Meeting Online | Rapatin"
        description="Hemat lebih banyak dengan model bayar sesuai pakai. Tidak ada langganan bulanan, bayar hanya saat menggunakan meeting online. Mulai dari Rp 2.500 per meeting."
        keywords="bayar sesuai pakai, pay as you go meeting, tanpa langganan zoom, hemat biaya rapat, meeting murah, pembayaran fleksibel"
        url="https://rapatin.id/fitur/bayar-sesuai-pakai"
      />
      <ProductPageLayout navbar={<Navbar />}>
        <GenericHeroSection {...heroData} />
        <GenericFeatureGrid 
          title="Mengapa Memilih Bayar Sesuai Pakai?"
          subtitle="Model pembayaran yang adil dan transparan untuk semua kebutuhan meeting Anda"
          features={features}
        />
        <GenericStepsSection
          title="Cara Kerja Bayar Sesuai Pakai"
          subtitle="Prosesnya mudah dan transparan"
          steps={steps}
        />
        <PricingSection />
        <TestimonialSection />
        <FinalCTA />
        <Footer />
      </ProductPageLayout>
    </div>
  );
};

export default BayarSesuaiPakai;
