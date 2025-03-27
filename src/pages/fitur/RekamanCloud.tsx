
import React from 'react';
import FeatureLayout from '@/components/FeatureLayout';
import { Card, CardContent } from '@/components/ui/card';
import { CloudLightning, Download, Video, Clock, Lock, Share } from 'lucide-react';

const RekamanCloud = () => {
  const features = [
    {
      icon: <Video />,
      title: 'Rekaman Otomatis',
      description: 'Rekam rapat Anda secara otomatis tanpa perlu mengklik tombol rekam.'
    },
    {
      icon: <Download />,
      title: 'Unduh Kapan Saja',
      description: 'Unduh rekaman rapat Anda selama 72 jam setelah rapat selesai.'
    },
    {
      icon: <Clock />,
      title: 'Penyimpanan 72 Jam',
      description: 'Semua rekaman tersimpan di cloud selama 72 jam untuk kemudahan akses.'
    },
    {
      icon: <Lock />,
      title: 'Keamanan Terjamin',
      description: 'Rekaman Anda dilindungi dengan enkripsi untuk menjaga kerahasiaan.'
    },
    {
      icon: <Share />,
      title: 'Berbagi Mudah',
      description: 'Bagikan rekaman rapat dengan peserta atau tim Anda dengan cepat.'
    }
  ];

  return (
    <FeatureLayout
      title="Rekaman Cloud"
      description="Rekaman otomatis disimpan dan tersedia untuk diunduh selama 72 jam melalui dashboard Anda."
      icon={CloudLightning}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <Card key={index} className="glass hover:shadow-elevation transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-16 glass p-8 rounded-xl max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Keunggulan Rekaman Cloud</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-1">
              <span className="text-xs font-bold text-primary">✓</span>
            </div>
            <p>Tidak perlu menginstal software tambahan untuk merekam</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-1">
              <span className="text-xs font-bold text-primary">✓</span>
            </div>
            <p>Hemat penyimpanan di perangkat Anda dengan cloud storage</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-1">
              <span className="text-xs font-bold text-primary">✓</span>
            </div>
            <p>Akses rekaman dari perangkat mana saja melalui dashboard</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-1">
              <span className="text-xs font-bold text-primary">✓</span>
            </div>
            <p>Pembagian hak akses untuk keamanan rekaman</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-1">
              <span className="text-xs font-bold text-primary">✓</span>
            </div>
            <p>Dapatkan notifikasi saat rekaman siap diunduh</p>
          </div>
        </div>
      </div>
    </FeatureLayout>
  );
};

export default RekamanCloud;
