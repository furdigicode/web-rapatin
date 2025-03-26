
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, Video } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="pt-28 pb-12 md:pt-32 md:pb-24 overflow-hidden bg-hero-pattern">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center py-1 px-4 bg-accent/70 rounded-full backdrop-blur-sm">
              <span className="text-xs font-medium text-primary">Aplikasi penjadwalan rapat premium tanpa batas waktu</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
              Jadwalkan <span className="text-primary">rapat online</span> tanpa akun Zoom berbayar
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl text-balance">
              Bayar hanya untuk yang kamu gunakan, dengan harga fleksibel berdasarkan jumlah peserta. Tanpa langganan bulanan, cukup isi saldo dan jadwalkan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full h-12 px-8">
                <a href="https://rapatin.id/register">Daftar & Mulai Menjadwalkan</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full h-12 px-8">
                <a href="#pricing">Lihat Harga</a>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 max-w-md pt-2">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign size={18} className="text-primary" />
                <span>Bayar Sesuai Pemakaian</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Video size={18} className="text-primary" />
                <span>Zoom, Meet, Teams</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={18} className="text-primary" />
                <span>Penjadwalan Mudah</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={18} className="text-primary" />
                <span>Durasi Tidak Terbatas</span>
              </div>
            </div>
          </div>

          <div className="relative animate-slide-in-right">
            <div className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-elevation border border-white/40">
              {/* Header with dots */}
              <div className="bg-white/90 p-3 flex items-center border-b">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto text-sm font-medium">Rapatin Dashboard</div>
              </div>
              
              {/* Main content */}
              <div className="bg-white/90 p-6">
                <div className="mb-8">
                  <h3 className="font-medium text-lg mb-4">Jadwalkan Rapat Baru</h3>
                  
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg flex items-center gap-3 bg-white">
                      <Calendar size={20} className="text-primary" />
                      <span>Besok, 14:00 WIB</span>
                    </div>
                    
                    <div className="p-3 border rounded-lg flex items-center gap-3 bg-white">
                      <Video size={20} className="text-primary" />
                      <span>Rapat Zoom</span>
                    </div>
                    
                    <div className="p-3 border rounded-lg flex items-center gap-3 bg-white">
                      <DollarSign size={20} className="text-primary" />
                      <span>100 Peserta - Rp 20.000</span>
                    </div>
                    
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white cursor-not-allowed opacity-90">
                      Buat Jadwal Rapat
                    </Button>
                  </div>
                </div>
                
                <div className="bg-primary/10 rounded-xl p-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Saldo Anda</h3>
                    <span className="font-bold">Rp 80.000</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Terakhir diisi: 3 hari yang lalu
                  </div>
                </div>
              </div>
            </div>
            
            {/* Subtle background element for depth */}
            <div className="absolute -bottom-4 -right-4 -z-10 w-full h-full rounded-2xl bg-primary/10 animate-float"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
