
import React from 'react';
import FeatureLayout from '@/components/FeatureLayout';
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
      icon: <Users />,
      title: 'Manajemen Peserta',
      description: 'Undang, tambah, atau hapus peserta rapat dengan beberapa klik saja.'
    },
    {
      icon: <Clock />,
      title: 'Pengingat Otomatis',
      description: 'Kirim pengingat otomatis kepada peserta rapat untuk memastikan kehadiran.'
    },
    {
      icon: <Settings />,
      title: 'Kustomisasi Lengkap',
      description: 'Sesuaikan pengaturan rapat seperti password, waiting room, dan fitur lainnya.'
    },
    {
      icon: <BarChart />,
      title: 'Analisis Penggunaan',
      description: 'Lihat statistik penggunaan rapat Anda dengan visualisasi yang jelas.'
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

      <div className="mt-16 max-w-4xl mx-auto">
        <img 
          src="/lovable-uploads/edbf847f-3513-412d-954a-41d6319fbaf2.png" 
          alt="Dashboard Preview" 
          className="w-full rounded-xl shadow-elevation border border-white/40" 
        />
      </div>
    </FeatureLayout>
  );
};

export default Dashboard;
