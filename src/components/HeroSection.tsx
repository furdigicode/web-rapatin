import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, Video, BadgeDollarSign } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const IllustSrc = "/lovable-uploads/e7e34560-7715-4bb4-9fa9-26f74f4090b8.png";

const HeroSection: React.FC = () => {
  const autoplayPlugin = React.useMemo(() => Autoplay({
    delay: 5000,
    stopOnInteraction: false,
    rootNode: emblaRoot => emblaRoot.parentElement,
    stopOnMouseEnter: true
  }), []);

  return (
    <section className="pt-28 pb-12 md:pt-32 md:pb-24 overflow-hidden bg-hero-pattern flex flex-col items-center">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center">
        <div className="inline-flex items-center py-1 px-4 bg-accent/70 rounded-full backdrop-blur-sm mt-0 mb-4 animate-fade-in mx-auto">
          <span className="text-xs font-medium text-primary text-center">Aplikasi penjadwalan rapat premium tanpa batas waktu</span>
        </div>
        <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-center mb-4 max-w-4xl animate-fade-in">
          Jadwalkan <span className="text-primary">rapat online</span> tanpa akun Zoom berbayar
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-center mb-8 animate-fade-in">
          Bayar hanya untuk yang kamu gunakan, dengan harga fleksibel berdasarkan jumlah peserta. Tanpa langganan bulanan, cukup isi saldo dan jadwalkan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-2 mb-8 justify-center animate-fade-in">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-lg h-12 px-8">
            <a href="https://app.rapatin.id/dashboard/register" onClick={handleRegistration} className="cursor-pointer">Mulai Menjadwalkan</a>
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
          <img 
            src={IllustSrc} 
            alt="Ilustrasi Rapatin" 
            className="w-full rounded-2xl shadow-elevation border border-white/40 bg-white object-cover"
            style={{ background: "rgba(255,255,255,0.9)", maxHeight: "800px" }}
            loading="lazy"
          />
        </div>
        <div className="mt-6 md:mt-6 w-full">
          <div className="text-center mb-8 animate-fade-in">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">DIPERCAYA OLEH 120+ BRAND</p>
          </div>
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" width="100" height="30" className="opacity-70 hover:opacity-100">
                      <path d="M79.246 13.636c0 1.755-1.078 2.837-2.832 2.837-1.752 0-2.83-1.082-2.83-2.837 0-1.753 1.078-2.835 2.83-2.835 1.754 0 2.832 1.082 2.832 2.835m-8.318 0c0 3.265 2.226 5.493 5.486 5.493 3.262 0 5.488-2.228 5.488-5.493 0-3.261-2.226-5.489-5.488-5.489-3.26 0-5.486 2.228-5.486 5.489M62.6 8.8h2.5v2.3h.1c.7-1.5 2-2.6 3.9-2.6 1.4 0 2.5.5 3.2 1.6.8-1 2.1-1.6 3.6-1.6 2.9 0 4.1 1.9 4.1 4.6v6h-2.6v-5.5c0-1.4-.6-2.4-2-2.4-1.8 0-2.5 1.3-2.5 3.1v4.8h-2.6v-5.5c0-1.5-.6-2.4-2-2.4-1.8 0-2.5 1.3-2.5 3v4.9h-2.6V8.8zm-6.8.3c3.3 0 5.5 2.2 5.5 5.5s-2.2 5.5-5.5 5.5-5.5-2.2-5.5-5.5 2.2-5.5 5.5-5.5m0 8.4c1.8 0 2.8-1.1 2.8-2.9s-1-2.9-2.8-2.9-2.8 1.1-2.8 2.9 1 2.9 2.8 2.9m-8.9-8.7h2.6v10.3h-2.6V8.8zm1.3-4.7c.9 0 1.6.7 1.6 1.6s-.7 1.6-1.6 1.6-1.6-.7-1.6-1.6.7-1.6 1.6-1.6M33.5 8.8h2.5v1.7h.1c.7-1.3 2.2-2 3.6-2 3.7 0 5.1 2.8 5.1 5.8 0 2.7-1.5 5.2-4.4 5.2-1.7 0-3.1-.7-3.9-1.9H36.2v5.4h-2.6V8.8zm5.4 8c1.7 0 2.6-1.3 2.6-2.8s-.9-2.9-2.6-2.9-2.8 1.1-2.8 2.9 1 2.9 2.8 2.9" fill="#2166b0" />
                    </svg>
                  </div>
                </CarouselItem>
                <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                  <div className="flex items-center justify-center h-12 grayscale hover:grayscale-0 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 246 60" width="90" height="30" className="opacity-70 hover:opacity-100">
                      <path d="M61.3 10h19.9v5.6H67.8v7.8h11.3v5.3H67.8v7.9h13.7v5.6H61.3V10zm33.2 17.4L87 10h7.3l3.8 11.4L102 10h7l-7.5 17.4v14.8h-7V27.4zm34.9 0c0 10.4-7.4 15.7-16.4 15.7-9 0-16.3-5.3-16.3-15.7S104.9 10 112.9 10c9 0 16.4 7.4 16.4 17.4zm-7-.1c0-6.4-3.8-11.7-9.4-11.7s-9.3 5.3-9.3 11.7 3.8 10.2 9.3 10.2 9.4-3.8 9.4-10.2zm9-14.5c1.8-1.8 4.9-2.8 8.3-2.8 7.3 0 11.8 3.4 11.8 11.4v21h-5.7v-3.2c-1.9 2.5-5.1 3.8-8.5 3.8-5.2 0-9.4-2.7-9.4-8 0-5.3 4.1-7.9 9.3-8.8l8.2-1.4v-.8c0-3.9-2.3-5.4-6-5.4-2.6 0-4.9.7-7 2.8l-1 .9-3.6-3.7 3.5-4zm9.6 23c2.1 0 3.9-.7 5.2-2 1.1-1.1 1.6-2.4 1.6-4.2v-2.3l-6.5 1.2c-3.3.6-4.8 1.7-4.8 3.9 0 2.2 1.7 3.4 4.5 3.4zm14.8-14.8h7.1v4.2h.3c.9-2.8 3.4-4.8 7.4-4.8.8 0 1.5.1 2.3.3v6.2c-.9-.3-1.9-.4-2.9-.4-4.2 0-6.7 2.2-6.7 7v11.3h-7.5V21.1z" fill="#008ccf" />
                    </svg>
                  </div>
                </CarouselItem>
                <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                  <div className="flex items-center justify-center h-12 grayscale hover:grayscale-0 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" width="90" height="30" className="opacity-70 hover:opacity-100">
                      <path d="M15.8 8c-5.4 0-9.8 4.4-9.8 9.8s4.4 9.8 9.8 9.8 9.8-4.4 9.8-9.8S21.2 8 15.8 8zm0 16.8c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z" fill="#006341" />
                      <path d="M45 11.2h-4.7v13.5h4.7c3.7 0 6.7-3 6.7-6.7s-3-6.8-6.7-6.8zm0 10.5h-1.7v-7.5H45c2.1 0 3.8 1.7 3.8 3.8-.1 2-1.7 3.7-3.8 3.7zM56.7 11.2h-3v13.5h3v-5.1h5.2v-3h-5.2v-2.4h5.9v-3zM70 11.2l-5.9 13.5h3.3l1.2-2.8h5.8l1.1 2.8h3.3L73 11.2H70zm-.3 7.7l1.8-4.3 1.8 4.3h-3.6zM83.6 11.2h-3v13.5h8.9v-3h-5.9z" fill="#006341" />
                    </svg>
                  </div>
                </CarouselItem>
                <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                  <div className="flex items-center justify-center h-12 grayscale hover:grayscale-0 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 35" width="85" height="30" className="opacity-70 hover:opacity-100">
                      <path d="M25 4.5C13.7 4.5 4.5 13.7 4.5 25s9.2 20.5 20.5 20.5S45.5 36.3 45.5 25 36.3 4.5 25 4.5zm0 38c-9.7 0-17.5-7.8-17.5-17.5S15.3 7.5 25 7.5 42.5 15.3 42.5 25 34.7 42.5 25 42.5z" fill="#FFC700" />
                      <path d="M25 10.5c-8 0-14.5 6.5-14.5 14.5S17 39.5 25 39.5 39.5 33 39.5 25 33 10.5 25 10.5zm0 26c-6.4 0-11.5-5.1-11.5-11.5S18.6 13.5 25 13.5 36.5 18.6 36.5 25 31.4 36.5 25 36.5z" fill="#FFC700" />
                      <path d="M25 16.5c-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5 8.5-3.8 8.5-8.5-3.8-8.5-8.5-8.5zm0 14c-3 0-5.5-2.5-5.5-5.5s2.5-5.5 5.5-5.5 5.5 2.5 5.5 5.5-2.5 5.5-5.5 5.5z" fill="#FFC700" />
                      <path d="M54 14h3.5v14H54zM62 14h3.5l6 8.5V14H75v14h-3.5l-6-8.4V28H62zM78 14h9c2.8 0 4.5 1.7 4.5 4.2 0 1.8-1 3.1-2.5 3.7 1.3.5 2 1.7 2 3.3v2.8h-3.5v-2.4c0-1.2-.6-1.8-1.9-1.8h-4.1V28H78V14zm3.5 6.8H86c1.2 0 1.9-.6 1.9-1.6 0-1-.7-1.6-1.9-1.6h-4.5v3.2z" fill="#FFC700" />
                    </svg>
                  </div>
                </CarouselItem>
                <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                  <div className="flex items-center justify-center h-12 grayscale hover:grayscale-0 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 35" width="100" height="30" className="opacity-70 hover:opacity-100">
                      <path d="M21.2 10c-4.2 0-7.6 3.4-7.6 7.6s3.4 7.6 7.6 7.6 7.6-3.4 7.6-7.6-3.4 7.6-7.6-7.6zm0 12.8c-2.9 0-5.2-2.3-5.2-5.2s2.3-5.2 5.2-5.2 5.2 2.3 5.2 5.2-2.3 5.2-5.2 5.2zM36.5 10.4h-3v14.3h10.1v-2.9h-7.1zM51.9 10.4l-6.6 14.3h3.2l1.3-2.8h6.2l1.3 2.8h3.2l-6.6-14.3zm-.4 8.6l1.9-4.1 1.9 4.1h-3.8zM66.3 10.4h-3v14.3h3v-5.7h6.3v-2.9h-6.3zM83.8 10.4h-11v2.9h4v11.4h3V13.3h4zM91.7 10.4h-3v14.3h10.1v-2.9h-7.1z" fill="#005BAA" />
                    </svg>
                  </div>
                </CarouselItem>
                <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                  <div className="flex items-center justify-center h-12 grayscale hover:grayscale-0 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" width="90" height="30" className="opacity-70 hover:opacity-100">
                      <path d="M22.5 7.9L18.2 22h-3l-3.6-9.8L7.9 22H5L.6 7.9h3l3 10.3 3.7-10.3h2.8l3.7 10.3 3-10.3zM30.7 7.9l8.4 14.1h-3.4l-1.8-3h-8.3l-1.8 3h-3.4L29 7.9h1.7zm1.7 8.1l-2.5-4.3-2.5 4.3h5zM48.9 22.3c-4.1 0-7.3-3.2-7.3-7.3s3.2-7.3 7.3-7.3c2.5 0 4.8 1.3 6.1 3.3l-2.5 1.5c-.8-1.2-2.1-2-3.6-2-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5c1.5 0 2.8-.7 3.6-2l2.5 1.5c-1.3 2-3.6 3.3-6.1 3.3z" fill="#e4002b" />
                    </svg>
                  </div>
                </CarouselItem>
                <CarouselItem className="basis-1/2 md:basis-1/5 lg:basis-1/7 pl-4">
                  <div className="flex items-center justify-center h-12 grayscale hover:grayscale-0 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 35" width="100" height="30" className="opacity-70 hover:opacity-100">
                      <path d="M30 8.7c-4.8 0-8.7 3.9-8.7 8.7s3.9 8.7 8.7 8.7 8.7-3.9 8.7-8.7-3.9 8.7-8.7-8.7zm0 14.5c-3.2 0-5.8-2.6-5.8-5.8s2.6-5.8 5.8-5.8 5.8 2.6 5.8 5.8-2.6 5.8-5.8 5.8z" fill="#00539B" />
                      <path d="M46.1 9h3.5v12.6h6.2v3H46.1zM61.9 9h3.5l6.9 15.6h-3.8l-1.3-3H61l-1.3 3h-3.8L61.9 9zm4.3 9.6l-2.5-6-2.5 6h5zM76.1 9h3.5v10.1l7.4-10.1h3.5v15.6h-3.5V14.4L79.6 24.6h-3.5z" fill="#00539B" />
                      <ellipse cx="30" cy="17.4" rx="2.9" ry="2.9" fill="#00539B" />
                    </svg>
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

export default HeroSection;
