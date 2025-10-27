import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, Video, BadgeDollarSign } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import OptimizedImage from "@/components/ui/optimized-image";
import FreeTrialModal from "@/components/ui/free-trial-modal";
import { shouldShowModal, getRedirectUrl } from "@/hooks/useURLParams";

const IllustSrc = "/lovable-uploads/e7e34560-7715-4bb4-9fa9-26f74f4090b8.png";

const HeroSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const autoplayPlugin = React.useMemo(
    () =>
      Autoplay({
        delay: 3000,
        stopOnInteraction: false,
        rootNode: (emblaRoot) => emblaRoot.parentElement,
        stopOnMouseEnter: true,
      }),
    [],
  );

  const handleRegistration = () => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "CTAClick");
    }

    if (shouldShowModal()) {
      setModalOpen(true);
    } else {
      const redirectUrl = getRedirectUrl();
      window.open(redirectUrl, "_blank");
    }
  };

  return (
    <>
      <section className="pt-28 pb-12 md:pt-32 md:pb-24 overflow-hidden bg-hero-pattern flex flex-col items-center">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center">
          <div className="inline-flex items-center py-1 px-4 bg-accent/70 rounded-full backdrop-blur-sm mt-0 mb-4 animate-fade-in mx-auto">
            <span className="text-xs font-medium text-primary text-center">
              Aplikasi penjadwalan rapat premium tanpa batas waktu
            </span>
          </div>
          <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-center mb-4 max-w-4xl animate-fade-in">
            Jadwalkan <span className="text-primary">rapat online</span> tanpa akun Zoom berbayar
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-center mb-8 animate-fade-in">
            Bayar hanya untuk yang kamu gunakan, dengan harga fleksibel berdasarkan jumlah peserta. Tanpa langganan
            bulanan, cukup isi saldo dan jadwalkan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2 mb-8 justify-center animate-fade-in">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white rounded-lg h-12 px-8"
              onClick={handleRegistration}
            >
              Mulai Menjadwalkan
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-lg h-12 px-8">
              <a href="#pricing">Lihat Harga</a>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-4xl w-full mx-auto pt-2 animate-fade-in">
            <div className="flex items-center gap-2 text-sm justify-center">
              <BadgeDollarSign size={18} className="text-primary" />
              <span>Bayar Setiap Rapat</span>
            </div>
            <div className="flex items-center gap-2 text-sm justify-center">
              <Video size={18} className="text-primary" />
              <span>Kualitas Video Full HD</span>
            </div>
            <div className="flex items-center gap-2 text-sm justify-center">
              <Calendar size={18} className="text-primary" />
              <span>Penjadwalan Mudah</span>
            </div>
            <div className="flex items-center gap-2 text-sm justify-center">
              <Clock size={18} className="text-primary" />
              <span>Durasi Tidak Terbatas</span>
            </div>
          </div>
          <div className="max-w-full mt-8 mb-10 animate-slide-in-right">
            <OptimizedImage
              src={IllustSrc}
              alt="Ilustrasi Rapatin - Platform penjadwalan meeting online tanpa batas waktu"
              width={1200}
              height={675}
              priority
              className="w-full rounded-2xl shadow-elevation border border-white/40 bg-white object-cover"
              style={{ background: "rgba(255,255,255,0.9)", maxHeight: "800px" }}
            />
          </div>
          <div className="mt-6 md:mt-6 w-full">
            <div className="text-center mb-8 animate-fade-in">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                DIPERCAYA OLEH 120+ BRAND
              </p>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: true,
                dragFree: true,
                containScroll: false,
              }}
              plugins={[autoplayPlugin as any]}
              className="w-full"
            >
              <CarouselContent className="py-4">
                {[...Array(2)].map((_, copy) => (
                  <React.Fragment key={`copy-${copy}`}>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/Ruang_Guru_logo.webp"
                          alt="Ruangguru"
                          className="h-12 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/logo-if-blue.webp"
                          alt="Indika"
                          className="h-12 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/logo_h.webp"
                          alt="Wiseco"
                          className="h-12 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/LogoIwakaf.webp"
                          alt="iWakaf"
                          className="h-16 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/logo_jmkp.webp"
                          alt="JMKP"
                          className="h-12 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/citraurbana.webp"
                          alt="Citra Urbana"
                          className="h-12 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/Logo_APKEPI.webp"
                          alt="APKEPI"
                          className="h-12 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/iso_jepang.webp"
                          alt="ISO Jepang"
                          className="h-12 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/UBH.webp"
                          alt="Universitas Bung Hatta"
                          className="h-12 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/Digicode_logo.webp"
                          alt="DigiCode"
                          className="h-12 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/logo-ges-horizontal.webp"
                          alt="Ganeca"
                          className="h-16 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                  </React.Fragment>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </section>

      {shouldShowModal() && <FreeTrialModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default HeroSection;
