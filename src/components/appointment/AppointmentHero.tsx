import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, Video, Clock } from 'lucide-react';
import FreeTrialModal from '@/components/ui/free-trial-modal';
import { shouldShowModal, getRedirectUrl } from '@/hooks/useURLParams';

const AppointmentHero: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleRegistration = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CTAClick');
    }
    
    if (shouldShowModal()) {
      setModalOpen(true);
    } else {
      const redirectUrl = getRedirectUrl();
      window.open(redirectUrl, '_blank');
    }
  };

  return (
    <>
      <section className="pt-28 pb-12 md:pt-32 md:pb-24 overflow-hidden bg-hero-pattern flex flex-col items-center">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center">
          <div className="inline-flex items-center py-1 px-4 bg-accent/70 rounded-full backdrop-blur-sm mt-0 mb-4 animate-fade-in mx-auto">
            <span className="text-xs font-medium text-primary text-center">Platform booking appointment berbayar sesuai penggunaan</span>
          </div>
          <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-center mb-4 max-w-4xl animate-fade-in">
            <span className="text-primary">Booking appointment</span> dengan sistem bayar per booking
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-center mb-8 animate-fade-in">
            Buat sistem appointment booking profesional dengan integrasi Zoom/Google Meet. Terima pembayaran otomatis tanpa langganan bulanan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2 mb-8 justify-center animate-fade-in">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-lg h-12 px-8" onClick={handleRegistration}>
              Mulai Booking Appointment
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-lg h-12 px-8">
              <a href="#pricing">Lihat Harga Per Booking</a>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-4xl w-full mx-auto pt-2 animate-fade-in">
            <div className="flex items-center gap-2 text-sm justify-center">
              <CreditCard size={18} className="text-primary" />
              <span>Bayar Per Booking</span>
            </div>
            <div className="flex items-center gap-2 text-sm justify-center">
              <Video size={18} className="text-primary" />
              <span>Zoom/Google Meet</span>
            </div>
            <div className="flex items-center gap-2 text-sm justify-center">
              <Calendar size={18} className="text-primary" />
              <span>Kalender Otomatis</span>
            </div>
            <div className="flex items-center gap-2 text-sm justify-center">
              <Clock size={18} className="text-primary" />
              <span>Reminder Otomatis</span>
            </div>
          </div>
          <div className="max-w-full mt-8 mb-10 animate-slide-in-right">
            <img 
              src="/lovable-uploads/e7e34560-7715-4bb4-9fa9-26f74f4090b8.png" 
              alt="Ilustrasi Appointment Booking" 
              className="w-full rounded-2xl shadow-elevation border border-white/40 bg-white object-cover"
              style={{ background: "rgba(255,255,255,0.9)", maxHeight: "800px" }}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {shouldShowModal() && (
        <FreeTrialModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default AppointmentHero;
