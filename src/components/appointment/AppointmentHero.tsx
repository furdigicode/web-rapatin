import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, Video, Clock } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import FreeTrialModal from '@/components/ui/free-trial-modal';
import { hasTrialParams } from '@/hooks/useURLParams';

const AppointmentHero: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  
  const autoplay = React.useMemo(
    () => Autoplay({ delay: 2000, stopOnInteraction: true }),
    []
  );

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

        {/* Brand Carousel Section */}
        <div className="mt-16 mb-8">
          <h3 className="text-center text-lg font-medium text-muted-foreground mb-8">
            Dipercaya oleh 600+ perusahaan di Indonesia
          </h3>
          <Carousel
            plugins={[autoplay]}
            className="w-full max-w-6xl mx-auto"
            onMouseEnter={() => autoplay.stop()}
            onMouseLeave={() => autoplay.reset()}
          >
            <CarouselContent className="-ml-1">
              <CarouselItem className="pl-1 basis-1/3 md:basis-1/6">
                <div className="flex items-center justify-center h-16 px-4">
                  <img 
                    src="/lovable-uploads/edbf847f-3513-412d-954a-41d6319fbaf2.png" 
                    alt="PT Waskita Karya" 
                    className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  />
                </div>
              </CarouselItem>
              <CarouselItem className="pl-1 basis-1/3 md:basis-1/6">
                <div className="flex items-center justify-center h-16 px-4">
                  <img 
                    src="/lovable-uploads/60fca5a0-b0eb-4219-b6e6-a27578d426b8.png" 
                    alt="PT Kereta Api Indonesia" 
                    className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  />
                </div>
              </CarouselItem>
              <CarouselItem className="pl-1 basis-1/3 md:basis-1/6">
                <div className="flex items-center justify-center h-16 px-4">
                  <img 
                    src="/lovable-uploads/b85c0fd2-b1c7-4ba8-8938-bf1ac3bdeb28.png" 
                    alt="Komunitas Muslimah" 
                    className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  />
                </div>
              </CarouselItem>
              <CarouselItem className="pl-1 basis-1/3 md:basis-1/6">
                <div className="flex items-center justify-center h-16 px-4">
                  <img 
                    src="/lovable-uploads/f9d05e48-8991-48c0-a45c-a0d34484ac7b.png" 
                    alt="KOTA TANGERANG" 
                    className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  />
                </div>
              </CarouselItem>
              <CarouselItem className="pl-1 basis-1/3 md:basis-1/6">
                <div className="flex items-center justify-center h-16 px-4">
                  <img 
                    src="/lovable-uploads/90dcfcfe-cb9e-46e1-88a3-5cf6472dd222.png" 
                    alt="Ponpes Gontor" 
                    className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  />
                </div>
              </CarouselItem>
              <CarouselItem className="pl-1 basis-1/3 md:basis-1/6">
                <div className="flex items-center justify-center h-16 px-4">
                  <img 
                    src="/lovable-uploads/1de3e82f-cc87-4981-8265-c0756628d701.png" 
                    alt="Brawijaya" 
                    className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  />
                </div>
              </CarouselItem>
              <CarouselItem className="pl-1 basis-1/3 md:basis-1/6">
                <div className="flex items-center justify-center h-16 px-4">
                  <img 
                    src="/lovable-uploads/3789d5f7-4d81-4aef-93f6-e31f8546d541.png" 
                    alt="USG" 
                    className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  />
                </div>
              </CarouselItem>
              <CarouselItem className="pl-1 basis-1/3 md:basis-1/6">
                <div className="flex items-center justify-center h-16 px-4">
                  <img 
                    src="/lovable-uploads/75085a74-99ab-4c7a-bb7f-9aa9fc2559a6.png" 
                    alt="Pesantren Modern Ummul Quro" 
                    className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  />
                </div>
              </CarouselItem>
              <CarouselItem className="pl-1 basis-1/3 md:basis-1/6">
                <div className="flex items-center justify-center h-16 px-4">
                  <img 
                    src="/lovable-uploads/54aa59cb-5574-4e7e-b296-cfd84c43473b.png" 
                    alt="Ruangguru" 
                    className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  />
                </div>
              </CarouselItem>
              <CarouselItem className="pl-1 basis-1/3 md:basis-1/6">
                <div className="flex items-center justify-center h-16 px-4">
                  <img 
                    src="/lovable-uploads/6727be9b-ee09-4c6d-adfe-11182325799c.png" 
                    alt="Indika" 
                    className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  />
                </div>
              </CarouselItem>
              <CarouselItem className="pl-1 basis-1/3 md:basis-1/6">
                <div className="flex items-center justify-center h-16 px-4">
                  <img 
                    src="/lovable-uploads/2daea350-0851-4dd8-8f79-ee07aaaad905.png" 
                    alt="Wiseco" 
                    className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  />
                </div>
              </CarouselItem>
              <CarouselItem className="pl-1 basis-1/3 md:basis-1/6">
                <div className="flex items-center justify-center h-16 px-4">
                  <img 
                    src="/lovable-uploads/c64ceec2-7c79-4671-912e-b179358001aa.png" 
                    alt="iWakaf" 
                    className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  />
                </div>
              </CarouselItem>
              <CarouselItem className="pl-1 basis-1/3 md:basis-1/6">
                <div className="flex items-center justify-center h-16 px-4">
                  <img 
                    src="/lovable-uploads/22bcf4c0-f0a4-46c1-b090-c9832ecc1a3b.png" 
                    alt="Ganeca" 
                    className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  />
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
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

export default AppointmentHero;
