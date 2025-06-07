
import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const BrandCarousel: React.FC = () => {
  const autoplayPlugin = React.useMemo(() => Autoplay({
    delay: 3000,
    stopOnInteraction: false,
    rootNode: emblaRoot => emblaRoot.parentElement,
    stopOnMouseEnter: true
  }), []);

  return (
    <section className="py-16 bg-accent/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Dipercaya oleh <span className="text-primary">1000+</span> perusahaan di Indonesia
          </h2>
          <p className="text-muted-foreground">
            Dari startup hingga perusahaan besar, semua menggunakan platform kami
          </p>
        </div>
        
        <div className="w-full">
          <Carousel opts={{
            align: "start",
            loop: true,
            dragFree: true,
            containScroll: false
          }} plugins={[autoplayPlugin]} className="w-full">
            <CarouselContent className="py-4">
              {[...Array(2)].map((_, copy) => <React.Fragment key={`copy-${copy}`}>
                <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                  <div className="flex items-center justify-center h-12 grayscale hover:grayscale-0 transition-all duration-300">
                    <img
                      src="/lovable-uploads/e690e2b8-f08c-4ae8-b42e-6754404ab3c1.png"
                      alt="Halodoc"
                      className="h-8 object-contain opacity-70 hover:opacity-100"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                  <div className="flex items-center justify-center h-12 grayscale hover:grayscale-0 transition-all duration-300">
                    <img
                      src="/lovable-uploads/6727be9b-ee09-4c6d-adfe-11182325799c.png"
                      alt="Papaya"
                      className="h-8 object-contain opacity-70 hover:opacity-100"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                  <div className="flex items-center justify-center h-12 grayscale hover:grayscale-0 transition-all duration-300">
                    <img
                      src="/lovable-uploads/f9d05e48-8991-48c0-a45c-a0d34484ac7b.png"
                      alt="FHP Law School"
                      className="h-8 object-contain opacity-70 hover:opacity-100"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                  <div className="flex items-center justify-center h-12 grayscale hover:grayscale-0 transition-all duration-300">
                    <img
                      src="/lovable-uploads/23a924a5-b5a4-4809-83db-42ea8ae871b7.png"
                      alt="JMKP"
                      className="h-8 object-contain opacity-70 hover:opacity-100"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                  <div className="flex items-center justify-center h-12 grayscale hover:grayscale-0 transition-all duration-300">
                    <img
                      src="https://citraurbana.com/wp-content/uploads/2024/03/logo-horizontal-500.svg"
                      alt="Citra Urbana"
                      className="h-8 object-contain opacity-70 hover:opacity-100"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                  <div className="flex items-center justify-center h-12 grayscale hover:grayscale-0 transition-all duration-300">
                    <img
                      src="/lovable-uploads/3789d5f7-4d81-4aef-93f6-e31f8546d541.png"
                      alt="APKEPI"
                      className="h-8 object-contain opacity-70 hover:opacity-100"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                  <div className="flex items-center justify-center h-12 grayscale hover:grayscale-0 transition-all duration-300">
                    <img
                      src="/lovable-uploads/75085a74-99ab-4c7a-bb7f-9aa9fc2559a6.png"
                      alt="ISO Jepang"
                      className="h-8 object-contain opacity-70 hover:opacity-100"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                  <div className="flex items-center justify-center h-12 grayscale hover:grayscale-0 transition-all duration-300">
                    <img
                      src="/lovable-uploads/22bcf4c0-f0a4-46c1-b090-c9832ecc1a3b.png"
                      alt="Universitas Bung Hatta"
                      className="h-8 object-contain opacity-70 hover:opacity-100"
                    />
                  </div>
                </CarouselItem>
                <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                  <div className="flex items-center justify-center h-12 grayscale hover:grayscale-0 transition-all duration-300">
                    <img
                      src="/lovable-uploads/1de3e82f-cc87-4981-8265-c0756628d701.png"
                      alt="DigiCode"
                      className="h-8 object-contain opacity-70 hover:opacity-100"
                    />
                  </div>
                </CarouselItem>
              </React.Fragment>)}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
