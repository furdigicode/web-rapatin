
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  const whatsappUrl = `https://wa.me/+6287788980084?text=${encodeURIComponent("Halo saya ingin daftar ke Rapatin")}`;
  
  const handleRegistration = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CompleteRegistration');
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-primary/10 to-background pt-36 pb-14 md:pt-40 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center relative">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
          Jadwalkan Rapat Zoom <br className="hidden md:inline" />
          <span className="text-primary">Tanpa Langganan</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in">
          Bayar hanya untuk yang kamu gunakan, dengan harga fleksibel berdasarkan jumlah peserta. Bisa pakai per hari. Tanpa langganan bulanan.
        </p>
        <Button 
          asChild 
          size="lg" 
          className="mt-8 rounded-lg bg-primary text-white hover:bg-primary/90"
        >
          <a
            href={whatsappUrl}
            onClick={handleRegistration}
            target="_blank"
            rel="noopener noreferrer"
          >
            Daftar Sekarang
            <ArrowRight size={16} className="ml-2" />
          </a>
        </Button>
        
        <div className="mt-16 w-full max-w-5xl mx-auto relative animate-fade-in">
          <div className="aspect-video rounded-xl overflow-hidden shadow-elevation border border-white/40 glass flex flex-col items-center justify-center bg-white">
            <img 
              src="/lovable-uploads/e5209dfb-81fe-448a-97d3-dcf8e0f111fc.png"
              alt="Rapatin Dashboard"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 animate-fade-in">
          <div className="flex flex-col items-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100+</div>
            <p className="text-sm text-muted-foreground text-center">Rapat Terjadwal Setiap Hari</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5.000+</div>
            <p className="text-sm text-muted-foreground text-center">Pengguna Aktif</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">99%</div>
            <p className="text-sm text-muted-foreground text-center">Tingkat Kepuasan</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
            <p className="text-sm text-muted-foreground text-center">Dukungan Pelanggan</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

