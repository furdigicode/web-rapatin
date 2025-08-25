import React from 'react';
import SectionContainer from '@/components/layout/SectionContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Smartphone, Building2, Wallet } from 'lucide-react';

const EventPricingSection: React.FC = () => {
  const handleRegistration = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CTAClick');
    }
    window.location.href = 'https://app.rapatin.id/dashboard/register';
  };

  const features = [
    "Unlimited jumlah event",
    "Halaman event publik otomatis",
    "Sistem pembayaran terintegrasi",
    "Reminder email & WhatsApp",
    "Manajemen peserta real-time",
    "Analitik dan laporan lengkap",
    "Tiket digital otomatis",
    "Custom branding event",
    "Export data peserta",
    "Support 24/7"
  ];

  const paymentMethods = [
    {
      icon: Smartphone,
      name: "QRIS",
      fee: "0.77%",
      description: "Semua e-wallet & bank"
    },
    {
      icon: Building2,
      name: "Virtual Account",
      fee: "Rp 4.440",
      description: "BCA, BNI, BRI, Mandiri"
    },
    {
      icon: CreditCard,
      name: "Credit Card",
      fee: "2.9% + Rp 2.000",
      description: "Visa, Mastercard"
    },
    {
      icon: Wallet,
      name: "E-Wallet",
      fee: "1.7%",
      description: "GoPay, OVO, DANA"
    }
  ];

  return (
    <>
      <SectionContainer id="pricing" background="gradient-up">
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center py-1 px-4 bg-accent rounded-full mb-4">
            <span className="text-xs font-medium text-primary">Harga Transparan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Harga yang <span className="text-primary">Fair & Transparan</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Bayar hanya ketika Anda menjual tiket. Tidak ada biaya bulanan atau setup.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Platform Fee */}
          <Card className="glass animate-fade-in delay-100">
            <CardHeader className="text-center pb-4">
              <Badge variant="default" className="w-fit mx-auto mb-2">
                Platform Fee
              </Badge>
              <CardTitle className="text-2xl">1.5%</CardTitle>
              <p className="text-muted-foreground">dari harga tiket yang terjual</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {features.slice(0, 5).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  * Platform fee dibebankan kepada organizer
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Gateway Fees */}
          <Card className="glass animate-fade-in delay-200">
            <CardHeader className="text-center pb-4">
              <Badge variant="default" className="w-fit mx-auto mb-2">
                Payment Gateway
              </Badge>
              <CardTitle className="text-2xl">Bervariasi</CardTitle>
              <p className="text-muted-foreground">sesuai metode pembayaran</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <method.icon className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{method.name}</span>
                        <span className="text-sm font-semibold text-primary">{method.fee}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  * Payment gateway fee dapat dibebankan ke peserta atau organizer
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 animate-fade-in delay-300">
          <Card className="glass max-w-2xl mx-auto p-6">
            <h3 className="text-xl font-semibold mb-4">Siap Mulai Event Pertama Anda?</h3>
            <p className="text-muted-foreground mb-6">
              Buat event gratis sekarang dan mulai jual tiket dalam hitungan menit
            </p>
            <Button 
              size="lg" 
              onClick={handleRegistration}
              className="w-full sm:w-auto"
            >
              Mulai Buat Event Gratis
            </Button>
          </Card>
        </div>
      </SectionContainer>
    </>
  );
};

export default EventPricingSection;