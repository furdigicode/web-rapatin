import React from 'react';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import OptimizedImage from '@/components/ui/optimized-image';
import * as LucideIcons from 'lucide-react';
import { HeroContent } from '@/types/ProductPageTypes';

interface GenericHeroSectionProps {
  content: HeroContent;
  onPrimaryCTA?: () => void;
  showBrands?: boolean;
}

const GenericHeroSection: React.FC<GenericHeroSectionProps> = ({
  content,
  onPrimaryCTA,
  showBrands = true
}) => {
  const autoplayPlugin = React.useMemo(() => Autoplay({
    delay: 3000,
    stopOnInteraction: false,
    rootNode: emblaRoot => emblaRoot.parentElement,
    stopOnMouseEnter: true
  }), []);

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={18} className="text-primary" /> : null;
  };

  return (
    <section className="pt-28 pb-12 md:pt-32 md:pb-24 overflow-hidden bg-hero-pattern flex flex-col items-center">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center">
        <div className="inline-flex items-center py-1 px-4 bg-accent/70 rounded-full backdrop-blur-sm mt-0 mb-4 animate-fade-in mx-auto">
          <span className="text-xs font-medium text-primary text-center">{content.badge}</span>
        </div>
        
        <h1 
          className="text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-center mb-4 max-w-4xl animate-fade-in"
          dangerouslySetInnerHTML={{ __html: content.title }}
        />
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-center mb-8 animate-fade-in">
          {content.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-2 mb-8 justify-center animate-fade-in">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-lg h-12 px-8" onClick={onPrimaryCTA}>
            {content.primaryCTA.text}
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-lg h-12 px-8">
            <a href={content.secondaryCTA.href}>{content.secondaryCTA.text}</a>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-4xl w-full mx-auto pt-2 animate-fade-in">
          {content.highlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-2 text-sm justify-center">
              {getIcon(highlight.icon)}
              <span>{highlight.text}</span>
            </div>
          ))}
        </div>
        
        <div className="max-w-full mt-8 mb-10 animate-slide-in-right">
          <OptimizedImage
            src={content.image.src}
            alt={content.image.alt}
            width={1200}
            height={675}
            priority
            className="w-full rounded-2xl shadow-elevation border border-white/40 object-cover"
            style={{ background: "rgba(255,255,255,0.9)", maxHeight: "800px" }}
          />
        </div>

        {showBrands && (
          <div className="mt-6 md:mt-6 w-full">
            <div className="text-center mb-8 animate-fade-in">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Dipercaya oleh 600+ perusahaan di Indonesia</p>
            </div>
            <Carousel opts={{
              align: "start",
              loop: true,
              dragFree: true,
              containScroll: false
            }} plugins={[autoplayPlugin as any]} className="w-full">
              <CarouselContent className="py-4">
                {[...Array(2)].map((_, copy) => (
                  <React.Fragment key={`copy-${copy}`}>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <OptimizedImage
                          src="/lovable-uploads/e690e2b8-f08c-4ae8-b42e-6754404ab3c1.png"
                          alt="Halodoc"
                          width={120}
                          height={48}
                          className="h-12 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="https://cdn-web-2.ruangguru.com/landing-pages/assets/hs/OPTIMIZE/logo%20rg.svg"
                          alt="Ruangguru"
                          className="h-12 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="https://indikafoundation.org/assets/logo-if-blue.png"
                          alt="Indika"
                          className="h-12 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="https://wiseco.id/site/assets/images/logo_h.png"
                          alt="Wiseco"
                          className="h-12 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="https://iwakaf.or.id/_next/image?url=%2Fassets%2Fimages%2Flogo%2FLogoIwakaf.png&w=256&q=75"
                          alt="iWakaf"
                          className="h-16 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="/lovable-uploads/23a924a5-b5a4-4809-83db-42ea8ae871b7.png"
                          alt="JMKP"
                          className="h-12 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="https://citraurbana.com/wp-content/uploads/2024/03/logo-horizontal-500.svg"
                          alt="Citra Urbana"
                          className="h-12 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="/lovable-uploads/3789d5f7-4d81-4aef-93f6-e31f8546d541.png"
                          alt="APKEPI"
                          className="h-12 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="/lovable-uploads/75085a74-99ab-4c7a-bb7f-9aa9fc2559a6.png"
                          alt="ISO Jepang"
                          className="h-12 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="/lovable-uploads/22bcf4c0-f0a4-46c1-b090-c9832ecc1a3b.png"
                          alt="Universitas Bung Hatta"
                          className="h-12 object-contain opacity-70 hover:opacity-100"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                      <div className="flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300">
                        <img
                          src="/lovable-uploads/1de3e82f-cc87-4981-8265-c0756628d701.png"
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
        )}
      </div>
    </section>
  );
};

export default GenericHeroSection;
