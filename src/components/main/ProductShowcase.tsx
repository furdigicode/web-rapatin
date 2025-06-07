
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Clock, CreditCard, Users, BarChart, MessageSquare, Settings } from 'lucide-react';

const ProductShowcase: React.FC = () => {
  const products = [
    {
      id: 'meeting',
      title: 'Meeting Scheduling',
      subtitle: 'Jadwalkan meeting dengan integrasi Zoom yang mudah',
      description: 'Platform meeting scheduling yang terintegrasi dengan Zoom untuk meeting profesional tanpa perlu akun berbayar.',
      image: '/lovable-uploads/e7e34560-7715-4bb4-9fa9-26f74f4090b8.png',
      features: [
        { icon: Video, text: 'Zoom integration built-in' },
        { icon: Calendar, text: 'Easy scheduling interface' },
        { icon: Clock, text: 'Calendar sync otomatis' },
        { icon: MessageSquare, text: 'Automated reminders' }
      ]
    },
    {
      id: 'event',
      title: 'Event Management System',
      subtitle: 'Kelola event besar dengan sistem yang powerful',
      description: 'Sistem manajemen event lengkap untuk webinar, workshop, dan acara virtual dengan kapasitas besar.',
      image: '/lovable-uploads/f9d05e48-8991-48c0-a45c-a0d34484ac7b.png',
      features: [
        { icon: Users, text: 'Large event hosting' },
        { icon: Settings, text: 'Registration management' },
        { icon: BarChart, text: 'Attendee tracking' },
        { icon: Video, text: 'Live streaming capabilities' }
      ]
    },
    {
      id: 'appointment',
      title: 'Appointment Bookings',
      subtitle: 'Sistem booking appointment dengan payment otomatis',
      description: 'Platform appointment booking untuk konsultasi, coaching, atau layanan profesional dengan sistem pembayaran terintegrasi.',
      image: '/lovable-uploads/6727be9b-ee09-4c6d-adfe-11182325799c.png',
      features: [
        { icon: Clock, text: 'One-on-one meetings' },
        { icon: Calendar, text: 'Booking calendar integration' },
        { icon: Users, text: 'Client management' },
        { icon: CreditCard, text: 'Payment processing' }
      ]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tiga Produk Utama dalam <span className="text-primary">Satu Platform</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Semua kebutuhan penjadwalan Anda tersedia dalam satu platform yang mudah digunakan
          </p>
        </div>
        
        <div className="space-y-20">
          {products.map((product, index) => (
            <div key={product.id} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 animate-fade-in`} style={{animationDelay: `${index * 0.2}s`}}>
              <div className="lg:w-1/2">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full rounded-2xl shadow-elevation border border-white/40 bg-white"
                />
              </div>
              <div className="lg:w-1/2 space-y-6">
                <div>
                  <h3 className="text-3xl font-bold mb-2">{product.title}</h3>
                  <p className="text-xl text-primary mb-4">{product.subtitle}</p>
                  <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <feature.icon size={16} className="text-primary" />
                      </div>
                      <span className="text-sm font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Coba {product.title}
                  </Button>
                  <Button variant="outline" size="lg">
                    Pelajari Lebih Lanjut
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
