
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, CreditCard, Users } from 'lucide-react';

const AppointmentCTA: React.FC = () => {
  const handleRegistration = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CTAClick');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto glass rounded-2xl p-8 md:p-12 shadow-elevation border border-white/40 animate-scale-in">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Mulai Terima Booking Appointment Hari Ini</h2>
              <p className="text-muted-foreground mb-6">
                Bergabunglah dengan ribuan profesional yang sudah meningkatkan pendapatan dengan sistem appointment booking otomatis.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Calendar size={16} className="text-primary" />
                  </div>
                  <span className="text-sm">10 booking appointment gratis untuk trial</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <CreditCard size={16} className="text-primary" />
                  </div>
                  <span className="text-sm">Setup dalam 5 menit, langsung terima pembayaran</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users size={16} className="text-primary" />
                  </div>
                  <span className="text-sm">Support 24/7 untuk semua pertanyaan Anda</span>
                </div>
              </div>
              <Button asChild size="lg" className="rounded-lg bg-primary hover:bg-primary/90 text-white">
                <a href="https://app.rapatin.id/dashboard/register" onClick={handleRegistration} className="cursor-pointer">
                  Daftar & Mulai Booking
                  <ArrowRight size={16} className="ml-2" />
                </a>
              </Button>
            </div>
            <div className="rounded-xl bg-primary/5 p-6 space-y-4">
              <h3 className="font-medium text-lg">Yang akan Anda dapatkan:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-5 h-5 flex-none shrink-0 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-sm">Link booking personal untuk semua layanan Anda</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex-none shrink-0 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-sm">Payment gateway terintegrasi untuk terima pembayaran</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex-none shrink-0 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-sm">Otomatis buat meeting Zoom/Google Meet</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex-none shrink-0 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-sm">Dashboard analytics untuk track performance</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex-none shrink-0 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-sm">Client database dengan riwayat lengkap</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentCTA;
