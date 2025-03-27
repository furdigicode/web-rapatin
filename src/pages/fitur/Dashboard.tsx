
import React from 'react';
import FeatureLayout from '@/components/FeatureLayout';
import FinalCTA from '@/components/FinalCTA';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutDashboard, Calendar, Users, Clock, Settings, BarChart } from 'lucide-react';

const Dashboard = () => {
  const features = [
    {
      icon: <Calendar />,
      title: 'Penjadwalan Mudah',
      description: 'Buat dan kelola jadwal rapat dengan antarmuka yang intuitif dan mudah digunakan.'
    },
    {
      icon: <Settings />,
      title: 'Kustomisasi Lengkap',
      description: 'Sesuaikan pengaturan rapat seperti passcode, language interpretation, dan fitur lainnya.'
    },
    {
      icon: <Video />,
      title: 'Akses File Rekaman',
      description: 'Lihat dan bagikan akses file rekaman rapat dan dapat langsung diunduh.'
    },
    {
      icon: <FileText />,
      title: 'Laporan Rapat',
      description: 'Dapatkan ringkasan lengkap setiap rapat yang dijalankan, termasuk topik, waktu, dan durasi.'
    },
    {
      icon: <Users2 />,
      title: 'Laporan Peserta',
      description: 'Pantau siapa saja yang hadir dalam rapat Anda lengkap dengan waktu masuk dan durasinya.'
    },
    {
      icon: <ClipboardList />,
      title: 'Ringkasan Rapat',
      description: 'Lihat poin-poin penting dan kesimpulan rapat secara ringkas untuk referensi dan tindak lanjut.'
    }
  ];

  return (
    <FeatureLayout
      title="Dashboard Intuitif"
      description="Buat atau edit jadwal dengan antarmuka modern kami yang dirancang untuk kemudahan penggunaan."
      icon={LayoutDashboard}
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

export default Dashboard;
