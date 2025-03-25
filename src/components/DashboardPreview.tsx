
import React from 'react';
import { Calendar, CheckCircle, Clock, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardPreview: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <section id="dashboard" className="py-20 bg-accent/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left column - text content */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center py-1 px-4 bg-accent rounded-full mb-2">
              <span className="text-xs font-medium text-primary">Antarmuka Intuitif</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dashboard yang simpel untuk <span className="text-primary">manajemen rapat</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Dashboard yang mudah digunakan untuk membuat, mengelola, dan memantau rapat terjadwal Anda.
              Akses rekaman, laporan peserta, dan tautan rapat dalam satu tempat.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1 text-primary">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Pembuatan Rapat Cepat</h3>
                  <p className="text-muted-foreground text-sm">Atur rapat baru dalam waktu kurang dari 30 detik dengan antarmuka yang simpel.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1 text-primary">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Akses Rekaman</h3>
                  <p className="text-muted-foreground text-sm">Dengan mudah unduh dan bagikan rekaman rapat Anda selama 72 jam setelah rapat.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1 text-primary">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Analitik Peserta</h3>
                  <p className="text-muted-foreground text-sm">Lacak kehadiran dan keterlibatan dengan laporan peserta terperinci untuk setiap rapat.</p>
                </div>
              </div>
            </div>
            
            <Button asChild size="lg" className="mt-6 bg-primary hover:bg-primary/90 text-white rounded-full">
              <a href="https://bikinjadwal.id/register">Coba Dashboard Sekarang</a>
            </Button>
          </div>
          
          {/* Right column - illustration */}
          <div className="relative">
            {/* Create Schedule Card */}
            <div className="glass rounded-xl overflow-hidden shadow-elevation border border-white/40 mx-auto max-w-md">
              <div className="bg-white/70 backdrop-blur-sm p-4 border-b border-white/20">
                <h3 className="font-medium">Buat Jadwal</h3>
              </div>
              
              <div className="p-6 space-y-4 bg-white/90">
                <div className="space-y-2">
                  <Label>Kapasitas Rapat*</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih opsi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 Peserta</SelectItem>
                      <SelectItem value="300">300 Peserta</SelectItem>
                      <SelectItem value="500">500 Peserta</SelectItem>
                      <SelectItem value="1000">1000 Peserta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Topik*</Label>
                  <Input placeholder="Masukkan Topik" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tanggal*</Label>
                    <div className="relative">
                      <Input placeholder="25 Mar 2025" />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Waktu*</Label>
                    <div className="relative">
                      <Input placeholder="14:23" />
                      <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-2">
                  <Plus size={18} className="mr-2" /> Buat Jadwal
                </Button>
              </div>
            </div>
            
            {/* Subtle background element for depth */}
            <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full rounded-xl bg-primary/10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
