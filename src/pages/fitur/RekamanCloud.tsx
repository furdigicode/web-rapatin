
import React from 'react';
import FeatureLayout from '@/components/FeatureLayout';
import FinalCTA from '@/components/FinalCTA';
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
      icon: <Mail />,
      title: 'Notifikasi Email',
      description: 'Dapatkan pemberitahuan ke email Anda saat file rekaman tersedia.'
    },
    {
      icon: <Lock />,
      title: 'Keamanan Terjamin',
      description: 'Rekaman Anda dilindungi dengan enkripsi untuk menjaga kerahasiaan.'
    },
    {
      icon: <Share />,
      title: 'Berbagi Mudah',
      description: 'Bagikan link rekaman rapat dengan peserta atau tim Anda dengan cepat.'
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
      <FinalCTA />
    </FeatureLayout>
  );
};

export default RekamanCloud;
