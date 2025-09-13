
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, Users, Clock } from 'lucide-react';
import ComingSoonModal from '@/components/ui/coming-soon-modal';
import FreeTrialModal from '@/components/ui/free-trial-modal';
import { formatRupiah } from '@/utils/formatRupiah';
import { hasTrialParams } from '@/hooks/useURLParams';

const TabbedPricingSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [freeTrialModalOpen, setFreeTrialModalOpen] = useState(false);

  const handleOpenModal = (productName: string) => {
    setSelectedProduct(productName);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct('');
  };

  const handleFreeTrialRegistration = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CTAClick');
    }
    
    if (!hasTrialParams()) {
      window.open('https://app.rapatin.id/dashboard/register', '_blank');
      return;
    }
    
    setFreeTrialModalOpen(true);
  };

  const pricingData = {
    meeting: {
      title: 'Meeting Scheduling',
      features: [
        'Rekaman Cloud (akses 72 jam)',
        'Durasi rapat tak terbatas',
        'Akses seharian (00.00 - 23.59)',
        'Berbagi layar',
        'Interpretasi Bahasa',
        'Smart Recording',
        'Ringkasan Rapat',
        'AI Companion',
        'Polling, Tanya Jawab, Survei',
        'Sistem pendaftaran',
        'Live streaming ke YouTube',
        'Tetapkan hingga 99 Co-Host'
      ],
      plans: [
        { name: '100 Peserta', originalPrice: 30000, promoPrice: 20000, popular: true },
        { name: '300 Peserta', originalPrice: 50000, promoPrice: 40000 },
        { name: '500 Peserta', originalPrice: 80000, promoPrice: 70000 },
        { name: '1000 Peserta', originalPrice: 160000, promoPrice: 130000 }
      ]
    },
    event: {
      title: 'Event Management',
      features: [
        'Ruang Zoom siap pakai & semua fitur premiumnya',
        'Kustomisasi halaman pendaftaran acara',
        'Pembayaran otomatis dan metode pembayaran lengkap',
        'Distribusi otomatis Zoom link dan passcode',
        'Event reminder email atau WhatsApp',
        'Digital certificate by Certifier',
        'Laporan kehadiran peserta',
        'Statistik & analisis acara'
      ],
      pricing: {
        platformFee: '1.5%',
        description: 'Biaya platform dari harga tiket event',
        paymentGateway: [
          { method: 'QRIS', fee: '0.77%' },
          { method: 'Virtual Account', fee: 'Rp 4.440' },
          { method: 'Credit Card', fee: '2.9% + Rp 2.000' },
          { method: 'E-Wallet', fee: '1,7%' }
        ]
      }
    },
    appointment: {
      title: 'Appointment Booking',
      features: [
        'Durasi hingga 30 menit per sesi',
        'Integrasi Zoom/Google Meet otomatis',
        'Payment collection terintegrasi',
        'Email & WhatsApp reminder otomatis',
        'Custom booking form',
        'Client database dan manajemen',
        'Calendar sync multi-platform',
        'Recording cloud storage',
        'Multi-participant support',
        'Custom branding',
        'Analytics dashboard lengkap',
        'Mobile-friendly booking page'
      ],
      pricing: {
        platformFee: 'Rp 10.000',
        description: 'Biaya flat per booking appointment (30 menit)',
        paymentGateway: [
          { method: 'QRIS', fee: '0.77%' },
          { method: 'Virtual Account', fee: 'Rp 4.440' },
          { method: 'Credit Card', fee: '2.9% + Rp 2.000' },
          { method: 'E-Wallet', fee: '1,7%' }
        ]
      }
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-accent/30 to-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Harga Transparan untuk <span className="text-primary">Setiap Produk</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Pilih produk yang sesuai kebutuhan Anda. Bayar hanya untuk yang Anda gunakan.
          </p>
        </div>
        
        <Tabs defaultValue="meeting" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-12 h-auto p-1 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger 
              value="meeting" 
              className="flex flex-col items-center justify-center gap-1 px-2 py-3 sm:px-4 sm:py-4 h-auto min-h-[60px] text-xs sm:text-sm md:text-base data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="leading-tight text-center">
                <span className="hidden sm:inline">Meeting Scheduling</span>
                <span className="sm:hidden">Meeting</span>
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="event" 
              className="flex flex-col items-center justify-center gap-1 px-2 py-3 sm:px-4 sm:py-4 h-auto min-h-[60px] text-xs sm:text-sm md:text-base data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="leading-tight text-center">
                <span className="hidden sm:inline">Event Management</span>
                <span className="sm:hidden">Event</span>
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="appointment" 
              className="flex flex-col items-center justify-center gap-1 px-2 py-3 sm:px-4 sm:py-4 h-auto min-h-[60px] text-xs sm:text-sm md:text-base data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="leading-tight text-center">
                <span className="hidden sm:inline">Appointment Booking</span>
                <span className="sm:hidden">Appointment</span>
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="meeting">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Features Column */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Fitur yang Anda Dapatkan</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pricingData.meeting.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check size={16} className="text-primary mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Pricing Column */}
              <Card className="glass relative">
                <div className="absolute -top-3 left-4 z-10">
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 animate-pulse">
                    🚀 Promo Launching
                  </Badge>
                </div>
                <CardHeader className="pt-6">
                  <CardTitle className="text-xl font-semibold">Pilih Paket</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Harga berlaku per rapat per tanggal. Anda hanya membayar saat menggunakan layanan.
                  </p>
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium text-primary">
                      ⚡ Harga Khusus Masa Launching - Hemat hingga 50%!
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Peserta</TableHead>
                        <TableHead>Harga</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pricingData.meeting.plans.map((plan, index) => (
                        <TableRow key={index} className={plan.popular ? 'bg-primary/5 border-primary/20' : ''}>
                          <TableCell className="font-medium">
                            {plan.name}
                            {plan.popular && (
                              <div className="text-xs text-primary font-medium mt-1 flex items-center gap-1">
                                ⭐ Paling Populer
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col items-start">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-lg text-primary">
                                  {formatRupiah(plan.promoPrice)}
                                </span>
                                <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                  HEMAT
                                </Badge>
                              </div>
                              <span className="text-sm text-muted-foreground line-through">
                                {formatRupiah(plan.originalPrice)}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-6 text-center">
                    <Button 
                      size="lg" 
                      className="w-full md:w-auto px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      onClick={handleFreeTrialRegistration}
                    >
                      🚀 Buat Jadwal Sekarang!
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="event">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Features Column */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Fitur yang Anda Dapatkan</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pricingData.event.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check size={16} className="text-primary mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Updated Pricing Column for event with modal trigger */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Biaya Berbasis Penggunaan</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Anda hanya dikenakan biaya ketika peserta membeli tiket event berbayar. Event gratis tidak dikenakan biaya.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Platform Fee */}
                    <div className="border-b pb-4">
                      <h3 className="font-semibold text-lg mb-2">Biaya Platform</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Biaya platform dari harga tiket</span>
                        <span className="font-bold text-xl text-primary">{pricingData.event.pricing.platformFee}</span>
                      </div>
                    </div>

                    {/* Payment Gateway Fees */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Biaya Payment Gateway</h3>
                      <div className="space-y-2">
                        {pricingData.event.pricing.paymentGateway.map((gateway, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-muted last:border-b-0">
                            <span className="text-sm">{gateway.method}</span>
                            <span className="font-medium">{gateway.fee}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Important Note */}
                    <div className="bg-accent/20 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Catatan:</strong> Biaya payment gateway dapat diatur apakah ditanggung oleh pembeli tiket atau organizer event.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button 
                      size="lg" 
                      className="w-full md:w-auto px-8"
                      onClick={() => handleOpenModal('Event Management')}
                    >
                      Mulai Buat Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="appointment">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Features Column */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Fitur yang Anda Dapatkan</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pricingData.appointment.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check size={16} className="text-primary mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Updated Pricing Column for appointment with modal trigger */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Biaya Flat Per Booking</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Anda hanya dikenakan biaya ketika klien melakukan booking appointment berbayar. Tidak ada biaya bulanan.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Platform Fee */}
                    <div className="border-b pb-4">
                      <h3 className="font-semibold text-lg mb-2">Biaya Platform</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Biaya flat per booking appointment</span>
                        <span className="font-bold text-xl text-primary">{pricingData.appointment.pricing.platformFee}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Untuk sesi hingga 30 menit</p>
                    </div>

                    {/* Payment Gateway Fees */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Biaya Payment Gateway</h3>
                      <div className="space-y-2">
                        {pricingData.appointment.pricing.paymentGateway.map((gateway, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-muted last:border-b-0">
                            <span className="text-sm">{gateway.method}</span>
                            <span className="font-medium">{gateway.fee}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Important Note */}
                    <div className="bg-accent/20 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Catatan:</strong> Biaya payment gateway dapat diatur apakah ditanggung oleh klien atau service provider.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button 
                      size="lg" 
                      className="w-full md:w-auto px-8"
                      onClick={() => handleOpenModal('Appointment Booking')}
                    >
                      Mulai Appointment Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <ComingSoonModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          productName={selectedProduct}
        />

        {hasTrialParams() && (
          <FreeTrialModal
            isOpen={freeTrialModalOpen}
            onClose={() => setFreeTrialModalOpen(false)}
          />
        )}
      </div>
    </section>
  );
};

export default TabbedPricingSection;
