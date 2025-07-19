import React from 'react';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Briefcase,
  Users,
  TrendingUp,
  Headphones,
  ShieldCheck,
  Handshake,
  Lightbulb,
  MessageSquare
} from 'lucide-react';

const MenjadiReseller = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Menjadi Reseller Rapatin - Program Kemitraan Menguntungkan"
        description="Bergabung dengan program reseller Rapatin dan dapatkan komisi menarik. Peluang bisnis meeting online dengan dukungan penuh dan training gratis."
        keywords="reseller rapatin, program kemitraan, bisnis meeting online, peluang usaha, komisi reseller, partner rapatin"
        url="https://rapatin.id/menjadi-reseller"
      />
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary text-white py-24">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Menjadi Reseller Rapatin
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Raih peluang bisnis meeting online dengan program kemitraan yang menguntungkan.
            </p>
            <a
              href="#benefits"
              className="bg-accent hover:bg-accent-foreground text-primary font-bold py-3 px-8 rounded-full inline-block"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-16">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Keuntungan Menjadi Reseller
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Briefcase className="text-primary w-8 h-8 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Komisi Menarik</h3>
                <p className="text-gray-700">
                  Dapatkan komisi kompetitif untuk setiap penjualan dan referral.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Users className="text-primary w-8 h-8 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Dukungan Penuh</h3>
                <p className="text-gray-700">
                  Tim kami siap membantu Anda dengan materi pemasaran dan dukungan teknis.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <TrendingUp className="text-primary w-8 h-8 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Peluang Pertumbuhan</h3>
                <p className="text-gray-700">
                  Pasar meeting online terus berkembang, memberikan potensi pendapatan yang besar.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Headphones className="text-primary w-8 h-8 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Training Gratis</h3>
                <p className="text-gray-700">
                  Ikuti sesi training eksklusif untuk meningkatkan kemampuan penjualan Anda.
                </p>
              </div>

              {/* Benefit 5 */}
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <ShieldCheck className="text-primary w-8 h-8 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Produk Terpercaya</h3>
                <p className="text-gray-700">
                  Tawarkan solusi meeting online yang handal dan inovatif kepada pelanggan Anda.
                </p>
              </div>

              {/* Benefit 6 */}
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Handshake className="text-primary w-8 h-8 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Kemitraan Jangka Panjang</h3>
                <p className="text-gray-700">
                  Bangun hubungan yang kuat dengan Rapatin untuk kesuksesan bersama.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How to Join Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Cara Bergabung
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Step 1 */}
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Lightbulb className="text-primary w-8 h-8 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Isi Formulir</h3>
                <p className="text-gray-700">
                  Kunjungi halaman pendaftaran dan isi formulir dengan informasi yang benar.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <MessageSquare className="text-primary w-8 h-8 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Verifikasi</h3>
                <p className="text-gray-700">
                  Tim kami akan menghubungi Anda untuk proses verifikasi dan wawancara.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Users className="text-primary w-8 h-8 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Mulai Berjualan</h3>
                <p className="text-gray-700">
                  Setelah disetujui, Anda dapat langsung mulai menawarkan Rapatin kepada pelanggan Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Siap Menjadi Bagian dari Rapatin?
            </h2>
            <p className="text-lg md:text-xl mb-8">
              Bergabunglah sekarang dan raih kesuksesan bersama kami.
            </p>
            <a
              href="#"
              className="bg-accent hover:bg-accent-foreground text-primary font-bold py-3 px-8 rounded-full inline-block"
            >
              Daftar Sekarang
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MenjadiReseller;
