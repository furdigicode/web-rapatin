
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, Share, DollarSign } from 'lucide-react';

const AppointmentHowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      icon: <Settings />,
      title: 'Set Up Your Service',
      description: 'Konfigurasi jenis appointment, durasi, harga, dan form booking yang diperlukan untuk layanan Anda.'
    },
    {
      number: '02',
      icon: <Share />,
      title: 'Share Your Booking Link',
      description: 'Bagikan link booking personal Anda kepada klien. Mereka bisa langsung booking appointment sesuai availability Anda.'
    },
    {
      number: '03',
      icon: <DollarSign />,
      title: 'Get Paid & Meet',
      description: 'Terima pembayaran otomatis dan meeting link akan dibuat secara otomatis di Zoom atau Google Meet.'
    }
  ];

  return (
    <section id="cara-kerja" className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Cara Kerja Appointment Booking
          </h2>
          <p className="text-lg text-muted-foreground">
            Tiga langkah mudah untuk memulai menerima booking appointment dengan pembayaran otomatis.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="glass hover:shadow-elevation transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 0.2}s`}}>
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary mx-auto">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppointmentHowItWorks;
