
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import CountdownTimer from '@/components/ui/countdown-timer';
import FreeTrialModal from '@/components/ui/free-trial-modal';
import { formatRupiah } from '@/utils/formatRupiah';
import { useCountdown } from '@/hooks/useCountdown';

const PricingSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { isPromoActive } = useCountdown();

  const handleRegistration = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CTAClick');
    }
    setModalOpen(true);
  };

  const pricingPlans = [
    { name: '100 Peserta', originalPrice: 20000, promoPrice: 10000, popular: true },
    { name: '300 Peserta', originalPrice: 40000, promoPrice: 25000 },
    { name: '500 Peserta', originalPrice: 70000, promoPrice: 55000 },
    { name: '1000 Peserta', originalPrice: 130000, promoPrice: 100000 }
  ];

  return (
    <>
      <section id="pricing" className="py-20 bg-gradient-to-b from-accent/30 to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Harga Transparan <span className="text-primary">Bayar Sesuai Pakai</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Tidak ada langganan bulanan. Bayar hanya untuk rapat yang Anda jadwalkan berdasarkan jumlah peserta.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="glass relative">
              {isPromoActive && (
                <div className="absolute -top-3 left-4 z-10">
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 animate-pulse">
                    🚀 Promo Terbatas Waktu
                  </Badge>
                </div>
              )}
              <CardHeader className="pt-6 text-center">
                <CardTitle className="text-2xl font-bold">Paket Meeting Scheduling</CardTitle>
                <p className="text-muted-foreground mt-2">
                  Harga berlaku per rapat per tanggal. Anda hanya membayar saat menggunakan layanan.
                </p>
                {isPromoActive && (
                  <>
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20 mt-4">
                      <p className="text-sm font-medium text-primary">
                        ⚡ Harga Khusus Masa Launching - Hemat hingga 50%!
                      </p>
                    </div>
                    <div className="mt-6">
                      <CountdownTimer />
                    </div>
                  </>
                )}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Jumlah Peserta</TableHead>
                      <TableHead className="text-center">Harga per Rapat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pricingPlans.map((plan, index) => (
                      <TableRow key={index} className={plan.popular ? 'bg-primary/5 border-primary/20' : ''}>
                        <TableCell className="text-center font-medium">
                          <div>
                            {plan.name}
                            {plan.popular && (
                              <div className="text-xs text-primary font-medium mt-1 flex items-center justify-center gap-1">
                                ⭐ Paling Populer
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            {isPromoActive ? (
                              <>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-xl text-primary">
                                    {formatRupiah(plan.promoPrice)}
                                  </span>
                                  <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                    HEMAT
                                  </Badge>
                                </div>
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatRupiah(plan.originalPrice)}
                                </span>
                              </>
                            ) : (
                              <span className="font-bold text-xl">
                                {formatRupiah(plan.originalPrice)}
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-8 text-center">
                  <Button 
                    size="lg" 
                    className={`px-8 ${isPromoActive ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70' : ''}`}
                    onClick={handleRegistration}
                  >
                    {isPromoActive ? '🚀 Mulai dengan Harga Promo!' : 'Mulai Menjadwalkan Rapat'}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Daftar gratis • Isi saldo sesuai kebutuhan • Bayar per rapat
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <FreeTrialModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default PricingSection;
