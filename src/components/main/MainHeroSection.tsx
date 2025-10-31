import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, X, Shield, Infinity } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import AnimatedText from "@/components/ui/animated-text";
import FreeTrialModal from "@/components/ui/free-trial-modal";
import OptimizedImage from "@/components/ui/optimized-image";
import { shouldShowModal, getRedirectUrl } from "@/hooks/useURLParams";

const MainHeroSection: React.FC = () => {
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

  const scrollToProducts = () => {
    const productSection = document.getElementById("product-showcase");
    if (productSection) {
      productSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

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
              Platform terlengkap untuk semua kebutuhan penjadwalan
            </span>
          </div>
          <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-center mb-4 max-w-4xl animate-fade-in">
            Pay-as-you-go <AnimatedText words={["meeting", "event", "appointment"]} className="text-primary" />{" "}
            scheduling platform
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-center mb-8 animate-fade-in">
            Kelola meeting, event, dan appointment dengan satu platform. Bayar sesuai penggunaan tanpa biaya
            berlangganan. Tanpa komitmen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2 mb-8 justify-center animate-fade-in">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white rounded-lg h-12 px-8"
              onClick={handleRegistration}
            >
              Mulai Gratis Sekarang
            </Button>
            <Button variant="outline" size="lg" className="rounded-lg h-12 px-8" onClick={scrollToProducts}>
              Lihat Produk
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-4xl w-full mx-auto pt-2 animate-fade-in">
            <div className="flex items-center gap-2 text-sm justify-center">
              <CreditCard size={18} className="text-primary" />
              <span>Pay as you go</span>
            </div>
            <div className="flex items-center gap-2 text-sm justify-center">
              <X size={18} className="text-primary" />
              <span>Tanpa langganan</span>
            </div>
            <div className="flex items-center gap-2 text-sm justify-center">
              <Shield size={18} className="text-primary" />
              <span>Uji coba gratis</span>
            </div>
            <div className="flex items-center gap-2 text-sm justify-center">
              <Infinity size={18} className="text-primary" />
              <span>All-in-one platform</span>
            </div>
          </div>
          <div className="max-w-full mt-8 mb-10 animate-slide-in-right">
            <OptimizedImage
              src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/dasbor_rapatin.webp"
              alt="All in One Scheduling Platform - Dashboard Rapatin untuk meeting, event, dan appointment"
              width={1200}
              height={675}
              priority
              className="w-full rounded-2xl shadow-elevation border border-white/40 bg-white object-cover"
              style={{ background: "rgba(255,255,255,0.9)", maxHeight: "800px" }}
            />
          </div>

          {/* Brand Carousel Section */}
          <div className="w-full mt-16">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Dipercaya oleh <span className="text-primary">600+</span> perusahaan di Indonesia
              </h2>
              <p className="text-muted-foreground">
                Dari startup hingga perusahaan besar, semua menggunakan platform kami
              </p>
            </div>

            <div className="w-full">
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
                          <OptimizedImage
                            src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/Ruang_Guru_logo.webp"
                            alt="Ruangguru"
                            width={120}
                            height={48}
                            className="h-12 object-contain opacity-70 hover:opacity-100"
                          />
                        </div>
                      </CarouselItem>
                      <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                        <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                          <OptimizedImage
                            src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/logo-if-blue.webp"
                            alt="Indika"
                            width={120}
                            height={48}
                            className="h-12 object-contain opacity-70 hover:opacity-100"
                          />
                        </div>
                      </CarouselItem>
                      <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                        <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                          <OptimizedImage
                            src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/logo_h.webp"
                            alt="Wiseco"
                            width={120}
                            height={48}
                            className="h-12 object-contain opacity-70 hover:opacity-100"
                          />
                        </div>
                      </CarouselItem>
                      <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                        <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                          <OptimizedImage
                            src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/LogoIwakaf.webp"
                            alt="iWakaf"
                            width={120}
                            height={64}
                            className="h-16 object-contain opacity-70 hover:opacity-100"
                          />
                        </div>
                      </CarouselItem>
                      <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                        <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                          <OptimizedImage
                            src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/logo_jmkp.webp"
                            alt="JMKP"
                            width={120}
                            height={48}
                            className="h-12 object-contain opacity-70 hover:opacity-100"
                          />
                        </div>
                      </CarouselItem>
                      <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                        <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                          <OptimizedImage
                            src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/citraurbana.webp"
                            alt="Citra Urbana"
                            width={120}
                            height={48}
                            className="h-12 object-contain opacity-70 hover:opacity-100"
                          />
                        </div>
                      </CarouselItem>
                      <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                        <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                          <OptimizedImage
                            src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/Logo_APKEPI.webp"
                            alt="APKEPI"
                            width={120}
                            height={48}
                            className="h-12 object-contain opacity-70 hover:opacity-100"
                          />
                        </div>
                      </CarouselItem>
                      <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                        <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                          <OptimizedImage
                            src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/iso_jepang.webp"
                            alt="ISO Jepang"
                            width={120}
                            height={48}
                            className="h-12 object-contain opacity-70 hover:opacity-100"
                          />
                        </div>
                      </CarouselItem>
                      <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                        <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                          <OptimizedImage
                            src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/UBH.webp"
                            alt="Universitas Bung Hatta"
                            width={120}
                            height={48}
                            className="h-12 object-contain opacity-70 hover:opacity-100"
                          />
                        </div>
                      </CarouselItem>
                      <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                        <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                          <OptimizedImage
                            src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/Digicode_logo.webp"
                            alt="DigiCode"
                            width={120}
                            height={48}
                            className="h-12 object-contain opacity-70 hover:opacity-100"
                          />
                        </div>
                      </CarouselItem>
                      <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                        <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                          <OptimizedImage
                            src="https://mepznzrijuoyvjcmkspf.supabase.co/storage/v1/object/public/brands/logo-ges-horizontal.webp"
                            alt="Ganeca"
                            width={120}
                            height={64}
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
        </div>
      </section>

      {shouldShowModal() && <FreeTrialModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default MainHeroSection;
