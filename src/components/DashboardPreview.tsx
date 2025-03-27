
import React from 'react';
import { Calendar, CheckCircle, Clock, BarChart, FileText, Users, Video, Play, Download, List, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardPreview: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <section id="dashboard" className="py-20 bg-accent/20 w-full">
      <div className="container mx-auto px-4 md:px-6 max-w-full">
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
              <a href="https://bikinjadwal.id/register">Daftar Sekarang</a>
            </Button>
          </div>
          
          {/* Right column - Dashboard illustration */}
          <div className="relative">
            <div className="glass rounded-xl overflow-hidden shadow-elevation border border-white/40 mx-auto max-w-md">
              <div className="bg-white/70 backdrop-blur-sm p-4 border-b border-white/20">
                <h3 className="font-medium flex items-center">
                  <span>Dashboard Rapat</span>
                  <div className="ml-auto flex space-x-2">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Aktif</span>
                  </div>
                </h3>
              </div>
              
              <div className="p-6 space-y-6 bg-white/90">
                {/* Recent Meetings List */}
                <div className="space-y-3">
                  <div className="flex justify-start items-center">
                    <h4 className="font-medium text-sm">Rapat Mendatang</h4>
                  </div>
                  
                  {/* Meeting Item */}
                  <div className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm">
                    <div className="flex justify-start mb-2">
                      <span className="font-medium">Rapat Tim Marketing</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Calendar size={12} className="mr-1" /> 
                        <span>27 Januari 2025</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" /> 
                        <span>14:00 - 15:00</span>
                      </div>
                      <div className="flex items-center">
                        <Users size={12} className="mr-1" /> 
                        <span>100 Peserta</span>
                      </div>
                    </div>
                    <div className="flex mt-3 space-x-2">
                      <button className="flex items-center justify-center bg-primary text-white text-xs px-3 py-1 rounded-lg">
                        <Play size={12} className="mr-1" /> Mulai
                      </button>
                      <button className="flex items-center justify-center bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-lg">
                        <List size={12} className="mr-1" /> Detail
                      </button>
                    </div>
                  </div>
                  
                  {/* Meeting Item */}
                  <div className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm">
                    <div className="flex justify-start mb-2">
                      <span className="font-medium">Diskusi Proyek Baru</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" /> 
                        <span>10:00 - 11:30</span>
                      </div>
                      <div className="flex items-center">
                        <Users size={12} className="mr-1" /> 
                        <span>8 Peserta</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Recent Recordings */}
                <div className="space-y-3">
                  <div className="flex justify-start items-center">
                    <h4 className="font-medium text-sm">Rekaman Terakhir</h4>
                  </div>
                  
                  <div className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Rapat Mingguan</span>
                      <span className="text-xs text-gray-500">2 jam yang lalu</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <Calendar size={12} className="mr-1" /> 
                      <span>25 Mar 2023</span>
                      <span className="mx-2">•</span>
                      <span>01:24:36</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex items-center justify-center bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-lg">
                        <Play size={12} className="mr-1" /> Putar
                      </button>
                      <button className="flex items-center justify-center bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-lg">
                        <Download size={12} className="mr-1" /> Unduh
                      </button>
                      <button className="flex items-center justify-center bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-lg">
                        <FileText size={12} className="mr-1" /> Ringkasan
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Analytics Snapshot */}
                <div className="space-y-3">
                  <div className="flex justify-start items-center">
                    <h4 className="font-medium text-sm">Analitik Peserta</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm text-center">
                      <div className="text-2xl font-bold text-primary">24</div>
                      <div className="text-xs text-gray-500">Rapat Bulan Ini</div>
                    </div>
                    <div className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm text-center">
                      <div className="text-2xl font-bold text-primary">239</div>
                      <div className="text-xs text-gray-500">Jumlah Peserta</div>
                    </div>
                  </div>
                </div>
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
