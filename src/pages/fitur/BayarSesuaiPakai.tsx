
import React from 'react';
import FeatureLayout from '@/components/FeatureLayout';
import FinalCTA from '@/components/FinalCTA';
import { Card, CardContent } from '@/components/ui/card';
import { BadgeDollarSign, DollarSign, CreditCard, Wallet, Receipt, BarChart, RotateCcw, CalendarClock } from 'lucide-react';

const BayarSesuaiPakai = () => {
  const features = [
    {
      icon: <DollarSign />,
      title: 'Tanpa Langganan Bulanan',
      description: 'Bayar hanya untuk rapat yang benar-benar Anda jadwalkan, tanpa biaya langganan tetap.'
    },
    {
      icon: <CreditCard />,
      title: 'Isi Saldo Akun',
      description: 'Isi saldo akun Anda dan gunakan untuk menjadwalkan rapat sesuai kebutuhan Anda.'
    },
    {
      icon: <Wallet />,
      title: 'Harga Transparan',
      description: 'Harga berdasarkan jumlah peserta dan durasi rapat, tanpa biaya tersembunyi.'
    },
    {
      icon: <Receipt />,
      title: 'Riwayat Transaksi',
      description: 'Pantau pengeluaran Anda dengan riwayat transaksi yang lengkap dan transparan.'
    },
    {
      icon: <CalendarClock />,
      title: 'Bebas Ganti Jadwal',
      description: 'Atur ulang jadwal rapat tanpa biaya tambahan jika belum pernah digunakan.'
    },
    {
      icon: <RotateCcw />,
      title: 'Batal Tanpa Rugi',
      description: 'Jika rapat yang sudah dijadwalkan tidak jadi digunakan, saldo Anda akan dikembalikan.'
    }
  ];

  return (
    <FeatureLayout
      title="Model Bayar Sesuai Pakai"
      description="Top up saldo akun Anda dan bayar hanya untuk rapat yang Anda jadwalkan. Tanpa langganan bulanan atau biaya tersembunyi."
      icon={BadgeDollarSign}
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

export default BayarSesuaiPakai;
