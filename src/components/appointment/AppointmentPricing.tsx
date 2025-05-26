
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from 'lucide-react';

const AppointmentPricing: React.FC = () => {
  const handleRegistration = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CTAClick');
    }
  };

  const pricingTiers = [
    {
      name: 'Starter',
      price: '8.000',
      duration: 'per booking appointment',
      description: 'Cocok untuk layanan konsultasi singkat',
      features: [
        'Durasi hingga 30 menit',
        'Integrasi Zoom/Google Meet',
        'Payment collection',
        'Email reminder otomatis',
        'Basic booking form',
        'Client database'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '15.000',
      duration: 'per booking appointment',
      description: 'Ideal untuk konsultasi mendalam',
      features: [
        'Durasi hingga 60 menit',
        'Integrasi Zoom/Google Meet',
        'Payment collection',
        'Email & WhatsApp reminder',
        'Custom booking form',
        'Client database',
        'Calendar sync',
        'Recording cloud storage'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '25.000',
      duration: 'per booking appointment',
      description: 'Untuk layanan premium & workshop',
      features: [
        'Durasi hingga 120 menit',
        'Integrasi Zoom/Google Meet',
        'Payment collection',
        'Email & WhatsApp reminder',
        'Advanced booking form',
        'Client database',
        'Calendar sync',
        'Recording cloud storage',
        'Multi-participant support',
        'Custom branding',
        'Analytics dashboard'
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-accent/30 to-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Harga Transparan Per Booking
          </h2>
          <p className="text-lg text-muted-foreground">
            Tidak ada biaya bulanan. Bayar hanya untuk appointment yang benar-benar di-booking oleh klien Anda.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <Card key={index} className={`glass hover:shadow-elevation transition-all duration-300 animate-fade-in ${tier.popular ? 'ring-2 ring-primary relative' : ''}`} style={{animationDelay: `${index * 0.1}s`}}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Paling Populer
                  </div>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">Rp {tier.price}</span>
                  <span className="text-muted-foreground ml-2">{tier.duration}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check size={16} className="text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  asChild 
                  className={`w-full ${tier.popular ? 'bg-primary hover:bg-primary/90' : 'variant-outline'}`}
                  variant={tier.popular ? 'default' : 'outline'}
                >
                  <a href="https://app.rapatin.id/dashboard/register" onClick={handleRegistration} className="cursor-pointer">
                    Mulai dengan {tier.name}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12 animate-fade-in">
          <p className="text-muted-foreground mb-4">
            <strong>Gratis:</strong> 10 booking appointment pertama untuk mencoba platform
          </p>
          <p className="text-sm text-muted-foreground">
            Biaya payment processing 2.9% + Rp 2.000 per transaksi (ditanggung klien)
          </p>
        </div>
      </div>
    </section>
  );
};

export default AppointmentPricing;
