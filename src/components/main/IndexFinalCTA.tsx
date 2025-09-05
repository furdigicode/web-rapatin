import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Users, CreditCard, Zap, Clock, Shield } from 'lucide-react';
import FreeTrialModal from '@/components/ui/free-trial-modal';
import { hasTrialParams } from '@/hooks/useURLParams';

const IndexFinalCTA = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleRegistration = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CTAClick');
    }
    
    if (!hasTrialParams()) {
      window.open('https://app.rapatin.id/dashboard/register', '_blank');
      return;
    }
    
    setModalOpen(true);
  };

  const products = [
    {
      icon: Calendar,
      title: "Meeting Scheduling",
      description: "Jadwalkan rapat dengan integrasi Zoom otomatis"
    },
    {
      icon: Users,
      title: "Event Management", 
      description: "Kelola acara besar dengan kapasitas ribuan peserta"
    },
    {
      icon: CreditCard,
      title: "Appointment Booking",
      description: "Sistem booking dengan integrasi pembayaran"
    }
  ];

  const benefits = [
    {
      icon: Zap,
      text: "Bayar sesuai pemakaian, tanpa langganan bulanan"
    },
    {
      icon: Clock,
      text: "Setup instan dalam hitungan menit"
    },
    {
      icon: Shield,
      text: "Keamanan tingkat enterprise"
    }
  ];

  return (
    <>
      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="glass rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Satu Platform untuk Semua Kebutuhan Penjadwalan Anda
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Rapatin menyediakan solusi lengkap untuk meeting, event, dan appointment. 
              Mulai dengan fitur yang sudah tersedia dan dapatkan akses awal ke fitur terbaru.
            </p>

            {/* Products Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {products.map((product, index) => (
                <div key={index} className="glass rounded-xl p-6 hover:scale-105 transition-transform">
                  <product.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center justify-center gap-2 text-sm">
                  <benefit.icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-primary text-white hover:bg-primary/90 px-8 py-3"
                onClick={handleRegistration}
              >
                Mulai dengan Platform Lengkap
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="px-8 py-3"
              >
                <a 
                  href="https://app.rapatin.id/dashboard/login" 
                  className="cursor-pointer"
                >
                  Sudah Punya Akun? Masuk
                </a>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Tanpa biaya setup • Tanpa kontrak • Bayar sesuai penggunaan
            </p>
          </div>
        </div>
      </section>

      {hasTrialParams() && (
        <FreeTrialModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default IndexFinalCTA;
