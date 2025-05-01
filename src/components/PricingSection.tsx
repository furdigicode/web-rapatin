
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, Video, Mic, Users, Globe, Clock, Calendar, BarChart, MessageSquare, Share2, UserPlus, Zap, FileText, Languages, VideoIcon } from 'lucide-react';
import { Card } from "@/components/ui/card";

const PricingSection: React.FC = () => {
  const features = [
    // Core features
    { name: "Rekaman Cloud (akses 72 jam)", icon: <VideoIcon size={18} /> },
    { name: "Durasi rapat tak terbatas", icon: <Clock size={18} /> },
    { name: "Akses seharian (00.00 - 23.59)", icon: <Calendar size={18} /> },
    { name: "Berbagi layar", icon: <Share2 size={18} /> },
    
    // Communication features
    { name: "Interpretasi Bahasa", icon: <Languages size={18} /> },
    { name: "Smart Recording", icon: <Zap size={18} /> },
    { name: "Ringkasan Rapat", icon: <FileText size={18} /> },
    { name: "AI Companion", icon: <MessageSquare size={18} /> },
    
    // Engagement features
    { name: "Polling, Tanya Jawab, Survei", icon: <BarChart size={18} /> },
    { name: "Sistem pendaftaran", icon: <UserPlus size={18} /> },
    { name: "Live streaming ke YouTube", icon: <Video size={18} /> },
    { name: "Tetapkan hingga 99 Co-Host", icon: <Users size={18} /> },
  ];
  
  const plans = [
    { participants: "100 Peserta", price: "Rp 20.000" },
    { participants: "300 Peserta", price: "Rp 40.000", bestSeller: true },
    { participants: "500 Peserta", price: "Rp 70.000" },
    { participants: "1000 Peserta", price: "Rp 130.000" }
  ];
  
  return (
    <section id="pricing" className="py-20 bg-background w-full">
      <div className="container mx-auto px-4 md:px-6 max-w-full">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center py-1 px-4 bg-accent rounded-full mb-4">
            <span className="text-xs font-medium text-primary">Harga Transparan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Harga Bayar-Per-Rapat
          </h2>
          <p className="text-muted-foreground text-lg">
            Tanpa langganan, tanpa komitmen. Hanya bayar untuk rapat yang Anda jadwalkan, berdasarkan jumlah peserta dan jumlah hari.
          </p>
        </div>
        
        <Card className="max-w-7xl mx-auto p-6 md:p-8 animate-fade-in shadow-elevation">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-accent/20 rounded-xl p-6 relative">
              <div className="flex items-center justify-center h-full">
                <div className="relative w-full max-w-md aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-6 shadow-md">
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between bg-primary/10 rounded-t-lg p-2">
                    <div className="flex items-center gap-2">
                      <Video size={16} className="text-primary" />
                      <span className="text-xs font-medium">Rapatin Meeting</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-12">
                    {features.slice(0, 9).map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-center bg-white/80 rounded-full h-10 w-10 shadow-sm mx-auto">
                        <div className="text-primary">
                          {feature.icon}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-4 bg-primary/10 rounded-b-lg p-2">
                    <Mic size={16} className="text-primary" />
                    <Video size={16} className="text-primary" />
                    <Share2 size={16} className="text-primary" />
                    <Users size={16} className="text-primary" />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-4">
                  Semua Fitur Premium
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check size={18} className="mr-2 mt-0.5 text-primary" />
                      <span className="text-sm">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  Harga Rapat
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {plans.map((plan, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border relative ${
                        index === 1 ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      {plan.bestSeller && (
                        <div className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                          Best Seller
                        </div>
                      )}
                      <p className="font-medium text-sm mb-1">{plan.participants}</p>
                      <p className="text-xl font-bold mb-1">{plan.price}</p>
                      <p className="text-xs text-muted-foreground">/rapat/tanggal</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <Button 
                    asChild
                    className="w-full rounded-lg bg-primary hover:bg-primary/90 text-white"
                  >
                    <a href="https://app.rapatin.id/dashboard/register" className="cursor-pointer">Daftar Sekarang</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default PricingSection;
