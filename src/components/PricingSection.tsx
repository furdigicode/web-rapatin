
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Video, Mic, Users, Globe, Clock, Calendar, BarChart, MessageSquare, Share2, UserPlus, Zap, FileText, Languages, VideoIcon } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrderOptionModal from '@/components/ui/order-option-modal';
import CountdownTimer from '@/components/ui/countdown-timer';
import { formatRupiah } from '@/utils/formatRupiah';

const PricingSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // Set promo end date to July 31, 2025, 23:59
  const promoEndDate = new Date('2025-07-31T23:59:59');
  const isPromoActive = new Date() < promoEndDate;

  const features = [
    // Core features
    { name: "Rekaman Cloud (akses 72 jam)", icon: <VideoIcon size={22} /> },
    { name: "Durasi rapat tak terbatas", icon: <Clock size={22} /> },
    { name: "Akses seharian (00.00 - 23.59)", icon: <Calendar size={22} /> },
    { name: "Berbagi layar", icon: <Share2 size={22} /> },
    { name: "Kualitas Video Full HD 1080p", icon: <Share2 size={22} /> },
    
    // Communication features
    { name: "Interpretasi Bahasa", icon: <Languages size={22} /> },
    { name: "Smart Recording", icon: <Zap size={22} /> },
    { name: "Ringkasan Rapat", icon: <FileText size={22} /> },
    { name: "AI Companion", icon: <MessageSquare size={22} /> },
    
    // Engagement features
    { name: "Polling, Tanya Jawab, Survei", icon: <BarChart size={22} /> },
    { name: "Sistem pendaftaran", icon: <UserPlus size={22} /> },
    { name: "Live streaming ke YouTube", icon: <Video size={22} /> },
    { name: "Tetapkan hingga 99 Co-Host", icon: <Users size={22} /> },
  ];
  
  const plans = [
    { participants: "100 Peserta", originalPrice: 40000, appPrice: 20000, quickOrderPrice: 25000, popular: true },
    { participants: "300 Peserta", originalPrice: 80000, appPrice: 40000, quickOrderPrice: 45000 },
    { participants: "500 Peserta", originalPrice: 140000, appPrice: 70000, quickOrderPrice: 75000 },
    { participants: "1000 Peserta", originalPrice: 260000, appPrice: 130000, quickOrderPrice: 135000 }
  ];

  const handleRegistration = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CTAClick');
    }
    setModalOpen(true);
  };
  
  return (
    <>
      <section id="pricing" className="py-12 md:py-20 bg-background w-full">
        <div className="container mx-auto px-4 md:px-6 max-w-full">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 animate-fade-in">
            <div className="inline-flex items-center py-1 px-4 bg-accent rounded-full mb-4">
              <span className="text-xs font-medium text-primary">Harga Transparan</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Harga Bayar-Per-Rapat
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Tanpa langganan, tanpa komitmen. Hanya bayar untuk rapat yang Anda jadwalkan, berdasarkan jumlah peserta dan jumlah hari.
            </p>
          </div>
          
          <Card className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 animate-fade-in shadow-elevation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Mobile: Show pricing first, Desktop: Show features first */}
              <div className="order-2 md:order-1">
                <div className="bg-accent/20 rounded-xl p-4 md:p-6 relative">
                  <div className="flex flex-col h-full">
                    <div className="mt-4">
                      <h3 className="text-lg md:text-xl font-bold mb-4 text-center">
                        Akses ke Semua Fitur Premium
                      </h3>
                      <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-start">
                            <Check size={18} className="mr-3 mt-0.5 text-primary flex-shrink-0" />
                            <span className="text-sm">{feature.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="order-1 md:order-2">
                {isPromoActive && (
                  <div className="mb-6 text-center">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 md:p-4 rounded-lg mb-4">
                      <h3 className="font-bold text-base md:text-lg mb-2">🚀 Promo Launching - Hemat hingga 50%!</h3>
                      <p className="text-xs md:text-sm mb-3">Penawaran terbatas berakhir dalam:</p>
                      <CountdownTimer targetDate={promoEndDate} className="scale-75 md:scale-100" />
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4">
                    Harga Rapat Zoom
                  </h3>
                  <div className="grid grid-cols-1 gap-3 md:gap-4 mb-6">
                    {plans.map((plan, index) => (
                      <div 
                        key={index} 
                        className={`p-3 md:p-4 rounded-lg border relative ${
                          plan.popular ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-2 md:-top-3 -right-2 md:-right-3 bg-orange-500 text-white text-xs font-medium px-2 md:px-3 py-1 rounded-full shadow-sm">
                            Best Seller
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm mb-1">{plan.participants}</p>
                            <p className="text-xs text-muted-foreground">/rapat/tanggal</p>
                          </div>
                          <div className="text-right">
                            {isPromoActive && (
                              <p className="text-xs text-muted-foreground line-through mb-1">
                                {formatRupiah(plan.originalPrice)}
                              </p>
                            )}
                            <div className="space-y-0.5">
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-xs text-muted-foreground">Via Aplikasi</span>
                                <span className="font-bold text-sm text-green-600 dark:text-green-400">
                                  {formatRupiah(plan.appPrice)}
                                </span>
                              </div>
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-xs text-muted-foreground">Quick Order</span>
                                <span className="font-bold text-sm text-orange-500 dark:text-orange-400">
                                  {formatRupiah(plan.quickOrderPrice)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 md:mt-8">
                    <Button 
                      className="w-full rounded-lg bg-primary hover:bg-primary/90 text-white text-sm md:text-base h-11 md:h-12"
                      onClick={handleRegistration}
                    >
                      {isPromoActive ? '🚀 Daftar Sekarang - Harga Promo!' : 'Daftar Sekarang'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <OrderOptionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default PricingSection;
