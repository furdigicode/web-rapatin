
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CreditCard, 
  Video, 
  Calendar, 
  Bell, 
  Users, 
  FileText, 
  Clock, 
  Shield 
} from 'lucide-react';

const AppointmentFeatures: React.FC = () => {
  const features = [
    {
      icon: <CreditCard />,
      title: 'No Subscription',
      description: 'Bayar hanya untuk appointment yang di-booking. Tanpa biaya langganan bulanan atau tahunan.'
    },
    {
      icon: <Video />,
      title: 'Multi-Platform Integration',
      description: 'Gunakan akun Zoom atau Google Meet yang sudah ada. Tidak perlu akun premium tambahan.'
    },
    {
      icon: <Calendar />,
      title: 'Payment Collection',
      description: 'Terima pembayaran otomatis dari klien sebelum appointment dimulai.'
    },
    {
      icon: <Bell />,
      title: 'Automated Reminders',
      description: 'Kirim reminder otomatis via email dan WhatsApp kepada klien.'
    },
    {
      icon: <Users />,
      title: 'Client Management',
      description: 'Database klien lengkap dengan riwayat appointment dan informasi pembayaran.'
    },
    {
      icon: <FileText />,
      title: 'Custom Booking Forms',
      description: 'Buat form booking sesuai kebutuhan dengan field khusus untuk setiap layanan.'
    },
    {
      icon: <Clock />,
      title: 'Availability Management',
      description: 'Atur jam kerja, hari libur, dan ketersediaan dengan mudah.'
    },
    {
      icon: <Shield />,
      title: 'Secure & Reliable',
      description: 'Platform aman dengan enkripsi data dan backup otomatis.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-accent/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Fitur Lengkap untuk Appointment Booking
          </h2>
          <p className="text-lg text-muted-foreground">
            Semua yang Anda butuhkan untuk mengelola appointment booking profesional dengan sistem pembayaran terintegrasi.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="glass hover:shadow-elevation transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppointmentFeatures;
