import React from 'react';
import SEO from '@/components/SEO';
import ProductPageLayout from '@/components/layout/ProductPageLayout';
import Navbar from '@/components/Navbar';
import SectionContainer from '@/components/layout/SectionContainer';
import Footer from '@/components/Footer';

const KebijakanPrivasi = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Kebijakan Privasi - Rapatin Lindungi Data Pengguna"
        description="Kebijakan privasi Rapatin untuk melindungi data dan informasi pribadi pengguna. Komitmen kami terhadap keamanan dan privasi data Anda."
        keywords="kebijakan privasi rapatin, privacy policy, perlindungan data, keamanan informasi, GDPR compliance"
        url="https://rapatin.id/kebijakan-privasi"
      />
      <ProductPageLayout navbar={<Navbar />}>
        <SectionContainer id="privacy-policy">
          <div className="container mx-auto py-12 px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-6">Kebijakan Privasi</h1>

            <p className="mb-4">
              Kebijakan Privasi ini menjelaskan bagaimana Rapatin mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat Anda menggunakan layanan kami.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Informasi yang Kami Kumpulkan</h2>
            <p className="mb-4">
              Kami mengumpulkan informasi berikut:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Informasi Kontak: Nama, alamat email, nomor telepon.</li>
              <li>Informasi Akun: Username, password.</li>
              <li>Informasi Pembayaran: Detail kartu kredit atau informasi pembayaran lainnya.</li>
              <li>Informasi Penggunaan: Data tentang bagaimana Anda menggunakan layanan kami, termasuk log aktivitas dan data analitik.</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">Bagaimana Kami Menggunakan Informasi Anda</h2>
            <p className="mb-4">
              Kami menggunakan informasi Anda untuk:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Menyediakan dan memelihara layanan kami.</li>
              <li>Memproses pembayaran Anda.</li>
              <li>Mengirimkan pemberitahuan tentang akun Anda dan layanan kami.</li>
              <li>Menanggapi permintaan dukungan Anda.</li>
              <li>Meningkatkan dan mengembangkan layanan kami.</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">Bagaimana Kami Melindungi Informasi Anda</h2>
            <p className="mb-4">
              Kami mengambil langkah-langkah keamanan yang wajar untuk melindungi informasi pribadi Anda dari akses yang tidak sah, penggunaan, atau pengungkapan.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Berbagi Informasi Anda</h2>
            <p className="mb-4">
              Kami tidak akan membagikan informasi pribadi Anda dengan pihak ketiga kecuali:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Dengan persetujuan Anda.</li>
              <li>Untuk mematuhi hukum atau proses hukum.</li>
              <li>Untuk melindungi hak atau properti kami.</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4">Perubahan pada Kebijakan Privasi Ini</h2>
            <p className="mb-4">
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberitahu Anda tentang perubahan apa pun dengan memposting Kebijakan Privasi yang baru di situs web kami.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Hubungi Kami</h2>
            <p className="mb-4">
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di:
            </p>
            <p>
              Email: support@rapatin.id
            </p>
          </div>
        </SectionContainer>
        <Footer />
      </ProductPageLayout>
    </div>
  );
};

export default KebijakanPrivasi;
