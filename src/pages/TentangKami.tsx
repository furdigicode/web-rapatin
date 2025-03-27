
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Users, Award, TrendingUp, Heart } from 'lucide-react';

const TentangKami = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Tentang Kami</h1>
            <p className="text-lg text-muted-foreground">
              Rapatin hadir untuk menjadikan rapat online lebih mudah dan terjangkau untuk semua orang.
            </p>
          </div>
          
          {/* Our Story */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold mb-6">Kisah Kami</h2>
            <div className="glass p-8 rounded-xl">
              <p className="mb-4">
                Rapatin didirikan pada tahun 2023 oleh sekelompok profesional teknologi yang frustrasi dengan biaya langganan bulanan layanan rapat online yang mahal.
              </p>
              <p className="mb-4">
                Kami percaya bahwa teknologi rapat online seharusnya tersedia untuk semua orang tanpa perlu membayar langganan bulanan yang mahal. Itulah mengapa kami menciptakan model bayar-sesuai-pakai yang inovatif, memungkinkan pengguna untuk membayar hanya untuk rapat yang benar-benar mereka jadwalkan.
              </p>
              <p>
                Sejak itu, misi kami adalah membuat rapat online lebih terjangkau dan fleksibel untuk bisnis dari semua ukuran, pengajar, dan profesional di seluruh Indonesia.
              </p>
            </div>
          </div>
          
          {/* Values */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold mb-6">Nilai-Nilai Kami</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Inovasi</h3>
                <p className="text-muted-foreground">
                  Kami terus berinovasi untuk memberikan solusi terbaik bagi pengguna kami.
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <Award size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Kualitas</h3>
                <p className="text-muted-foreground">
                  Kami berkomitmen untuk menyediakan layanan berkualitas tinggi dengan harga terjangkau.
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Komunitas</h3>
                <p className="text-muted-foreground">
                  Kami membangun komunitas yang inklusif dan mendukung semua pengguna kami.
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <Heart size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Kepedulian</h3>
                <p className="text-muted-foreground">
                  Kami peduli dengan kebutuhan pengguna dan selalu mendengarkan masukan mereka.
                </p>
              </div>
            </div>
          </div>
          
          {/* Team */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Tim Kami</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-xl text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-1">Budi Setiawan</h3>
                <p className="text-sm text-primary mb-2">CEO & Founder</p>
                <p className="text-muted-foreground text-sm">
                  Berpengalaman 10+ tahun di industri teknologi dan telekomunikasi.
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-1">Dewi Lestari</h3>
                <p className="text-sm text-primary mb-2">CTO</p>
                <p className="text-muted-foreground text-sm">
                  Insinyur perangkat lunak dengan pengalaman di perusahaan teknologi global.
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-1">Adi Nugroho</h3>
                <p className="text-sm text-primary mb-2">CPO</p>
                <p className="text-muted-foreground text-sm">
                  Pakar UX/UI dengan fokus pada pengembangan produk yang berpusat pada pengguna.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TentangKami;
