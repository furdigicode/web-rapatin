import React from 'react';
import SEO from '@/components/SEO';
import FeatureLayout from '@/components/FeatureLayout';
import FinalCTA from '@/components/FinalCTA';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Users, Clock, Download, BarChart, Filter } from 'lucide-react';

const LaporanPeserta = () => {
  const features = [
    {
      icon: <Users />,
      title: 'Data Kehadiran',
      description: 'Ketahui siapa saja yang hadir dalam rapat Anda dengan detail lengkap.'
    },
    {
      icon: <Clock />,
      title: 'Waktu Partisipasi',
      description: 'Lacak berapa lama setiap peserta bergabung dalam rapat Anda.'
    },
    {
      icon: <Download />,
      title: 'Ekspor Data',
      description: 'Unduh laporan dalam format CSV atau PDF untuk analisis lebih lanjut.'
    },
    {
      icon: <BarChart />,
      title: 'Visualisasi Data',
      description: 'Lihat grafik partisipasi peserta untuk mendapatkan wawasan yang lebih baik.'
    },
    {
      icon: <Filter />,
      title: 'Filter Laporan',
      description: 'Saring laporan berdasarkan tanggal, durasi, atau peserta.'
    }
  ];

  return (
    <>
      <SEO
        title="Laporan Peserta Meeting - Tracking Kehadiran Otomatis | Rapatin"
        description="Laporan kehadiran otomatis dengan data partisipasi lengkap. Ekspor ke CSV/PDF, visualisasi data, filter berdasarkan tanggal dan durasi."
        keywords="laporan peserta meeting, tracking kehadiran rapat, attendance report zoom, analisis partisipasi"
        canonicalUrl="https://rapatin.id/fitur/laporan-peserta"
        type="website"
      />
      <FeatureLayout
        title="Laporan Peserta"
        description="Dapatkan laporan kehadiran otomatis untuk setiap rapat untuk melacak partisipasi."
        icon={FileText}
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
          <h2 className="text-2xl font-bold mb-6">Contoh Laporan Peserta</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary/10">
                  <th className="border p-3 text-left">Nama</th>
                  <th className="border p-3 text-left">Email</th>
                  <th className="border p-3 text-left">Waktu Masuk</th>
                  <th className="border p-3 text-left">Waktu Keluar</th>
                  <th className="border p-3 text-left">Durasi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3">Budi Santoso</td>
                  <td className="border p-3">budi@contoh.com</td>
                  <td className="border p-3">10:00 WIB</td>
                  <td className="border p-3">11:30 WIB</td>
                  <td className="border p-3">1j 30m</td>
                </tr>
                <tr>
                  <td className="border p-3">Siti Rahayu</td>
                  <td className="border p-3">siti@contoh.com</td>
                  <td className="border p-3">10:05 WIB</td>
                  <td className="border p-3">11:30 WIB</td>
                  <td className="border p-3">1j 25m</td>
                </tr>
                <tr>
                  <td className="border p-3">Agus Wijaya</td>
                  <td className="border p-3">agus@contoh.com</td>
                  <td className="border p-3">10:15 WIB</td>
                  <td className="border p-3">11:25 WIB</td>
                  <td className="border p-3">1j 10m</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <FinalCTA />
      </FeatureLayout>
    </>
  );
};

export default LaporanPeserta;
