
import React from 'react';
import { UserPlus, Calendar, Video, DollarSign } from 'lucide-react';

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
    <section className="py-16 bg-secondary/5" id="cara-kerja">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Cara Kerja</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tiga langkah sederhana untuk memulai penggunaan Rapatin untuk kebutuhan rapat online Anda.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex mb-10 last:mb-0">
              <div className="mr-6 flex flex-col items-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white font-bold text-xl">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-full bg-primary/20 mt-4"></div>
                )}
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
