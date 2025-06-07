
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check } from 'lucide-react';

const TabbedPricingSection: React.FC = () => {
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
        { name: '100 Peserta', price: '20.000' },
        { name: '300 Peserta', price: '40.000', popular: true },
        { name: '500 Peserta', price: '70.000' },
        { name: '1000 Peserta', price: '130.000' }
      ]
    },
    event: {
      title: 'Event Management',
      features: [
        'Semua fitur Zoom meeting',
        'Customizable event registration page',
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
      plans: [
        {
          name: 'Basic',
          price: '8.000',
          duration: 'per booking',
          features: ['Durasi hingga 30 menit', 'Payment collection', 'Email reminder', 'Client database']
        },
        {
          name: 'Professional',
          price: '15.000',
          duration: 'per booking',
          features: ['Durasi hingga 60 menit', 'Payment collection', 'Email reminder', 'Client database', 'WhatsApp reminder', 'Custom forms'],
          popular: true
        },
        {
          name: 'Premium',
          price: '25.000',
          duration: 'per booking',
          features: ['Durasi hingga 120 menit', 'Payment collection', 'Email reminder', 'Client database', 'WhatsApp reminder', 'Custom forms', 'Recording storage', 'Analytics dashboard']
        }
      ]
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
          <TabsList className="grid w-full grid-cols-3 mb-12">
            <TabsTrigger value="meeting" className="text-sm md:text-base">Meeting Scheduling</TabsTrigger>
            <TabsTrigger value="event" className="text-sm md:text-base">Event Management</TabsTrigger>
            <TabsTrigger value="appointment" className="text-sm md:text-base">Appointment Booking</TabsTrigger>
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
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Pilih Paket</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Harga berlaku per rapat per tanggal. Anda hanya membayar saat menggunakan layanan.
                  </p>
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
                        <TableRow key={index} className={plan.popular ? 'bg-primary/5' : ''}>
                          <TableCell className="font-medium">
                            {plan.name}
                            {plan.popular && (
                              <div className="text-xs text-primary font-medium mt-1">
                                Paling Populer
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-bold">
                            Rp {plan.price}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-6 text-center">
                    <Button size="lg" className="w-full md:w-auto px-8">
                      Daftar Sekarang
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

              {/* Pricing Column */}
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
                    <Button size="lg" className="w-full md:w-auto px-8">
                      Mulai Buat Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="appointment">
            <div className="grid md:grid-cols-3 gap-8">
              {pricingData.appointment.plans.map((plan, index) => (
                <Card key={index} className={`glass hover:shadow-elevation transition-all duration-300 animate-fade-in ${plan.popular ? 'ring-2 ring-primary relative' : ''}`} style={{animationDelay: `${index * 0.1}s`}}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                        Paling Populer
                      </div>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">Rp {plan.price}</span>
                      <span className="text-muted-foreground ml-2">{plan.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check size={16} className="text-primary mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Mulai dengan {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default TabbedPricingSection;
