
import React from 'react';
import FeatureLayout from '@/components/FeatureLayout';
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
      
      <div className="mt-16 glass p-8 rounded-xl max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Cara Kerja</h2>
        <ol className="space-y-6">
          <li className="flex gap-4">
            <span className="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</span>
            <div>
              <h3 className="font-semibold text-lg">Daftar dan Isi Saldo</h3>
              <p className="text-muted-foreground">Buat akun dan isi saldo Anda dengan metode pembayaran yang tersedia.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</span>
            <div>
              <h3 className="font-semibold text-lg">Jadwalkan Rapat</h3>
              <p className="text-muted-foreground">Buat jadwal rapat Anda dengan detail seperti jumlah peserta dan durasi.</p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</span>
            <div>
              <h3 className="font-semibold text-lg">Biaya Sesuai Penggunaan</h3>
              <p className="text-muted-foreground">Biaya akan dipotong dari saldo Anda sesuai dengan penggunaan aktual Anda.</p>
            </div>
          </li>
        </ol>
      </div>
    </FeatureLayout>
  );
};

export default BayarSesuaiPakai;
