
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, Users, Clock } from 'lucide-react';

const MainHeroSection: React.FC = () => {
  return (
    <section className="pt-28 pb-12 md:pt-32 md:pb-24 overflow-hidden bg-hero-pattern flex flex-col items-center">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center">
        <div className="inline-flex items-center py-1 px-4 bg-accent/70 rounded-full backdrop-blur-sm mt-0 mb-4 animate-fade-in mx-auto">
          <span className="text-xs font-medium text-primary text-center">Platform terlengkap untuk semua kebutuhan penjadwalan</span>
        </div>
        <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-center mb-4 max-w-4xl animate-fade-in">
          <span className="text-primary">All in one</span> pay as you go scheduling platform
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-center mb-8 animate-fade-in">
          Kelola meeting, event, dan appointment dengan satu platform. Bayar sesuai penggunaan tanpa biaya berlangganan yang memberatkan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-2 mb-8 justify-center animate-fade-in">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-lg h-12 px-8">
            Mulai Gratis Sekarang
          </Button>
          <Button variant="outline" size="lg" className="rounded-lg h-12 px-8">
            Lihat Demo Platform
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-4xl w-full mx-auto pt-2 animate-fade-in">
          <div className="flex items-center gap-2 text-sm justify-center">
            <Calendar size={18} className="text-primary" />
            <span>Meeting Zoom</span>
          </div>
          <div className="flex items-center gap-2 text-sm justify-center">
            <Users size={18} className="text-primary" />
            <span>Event Management</span>
          </div>
          <div className="flex items-center gap-2 text-sm justify-center">
            <Clock size={18} className="text-primary" />
            <span>Appointment</span>
          </div>
          <div className="flex items-center gap-2 text-sm justify-center">
            <CreditCard size={18} className="text-primary" />
            <span>Pay Per Use</span>
          </div>
        </div>
        <div className="max-w-full mt-8 mb-10 animate-slide-in-right">
          <img 
            src="/lovable-uploads/e7e34560-7715-4bb4-9fa9-26f74f4090b8.png" 
            alt="All in One Scheduling Platform" 
            className="w-full rounded-2xl shadow-elevation border border-white/40 bg-white object-cover"
            style={{ background: "rgba(255,255,255,0.9)", maxHeight: "800px" }}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default MainHeroSection;
