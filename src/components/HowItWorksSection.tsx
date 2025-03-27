
import React from 'react';
import { UserPlus, Calendar, Video, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      icon: <UserPlus className="h-6 w-6 text-white" />,
      title: 'Daftar dan Isi Saldo',
      description: 'Buat akun dan isi saldo Anda dengan metode pembayaran yang tersedia.'
    },
    {
      number: 2,
      icon: <Calendar className="h-6 w-6 text-white" />,
      title: 'Jadwalkan Rapat',
      description: 'Buat jadwal rapat Anda dengan detail seperti jumlah peserta dan durasi.'
    },
    {
      number: 3,
      icon: <Video className="h-6 w-6 text-white" />,
      title: 'Pakai Ruang Rapat',
      description: 'Jadi Host rapat untuk melangsungkan rapat dengan fitur lengkap dan tanpa batasan waktu 40 menit.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-accent/20 to-background" id="cara-kerja">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center py-1 px-4 bg-accent rounded-full mb-4">
            <span className="text-xs font-medium text-primary">Mudah Digunakan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-primary">Tiga langkah sederhana</span> menuju rapat online tanpa batas
          </h2>
          <p className="text-muted-foreground text-lg">
            Mulai menggunakan Rapatin dengan cepat dan nikmati pengalaman rapat online yang lebih baik tanpa kerumitan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="glass p-6 rounded-xl transition-all duration-300 hover:shadow-elevation animate-fade-in delay-100">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4 text-white">
                <span className="font-bold">{step.number}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
