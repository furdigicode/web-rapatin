import React from 'react';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SyaratKetentuan = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Syarat & Ketentuan - Rapatin Platform Meeting Online"
        description="Baca syarat dan ketentuan penggunaan platform meeting online Rapatin. Ketentuan layanan, kebijakan penggunaan, dan aturan platform yang berlaku."
        keywords="syarat ketentuan rapatin, terms of service, aturan penggunaan, kebijakan layanan, legal rapatin"
        url="https://rapatin.id/syarat-ketentuan"
      />
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto py-12 px-4">
          <h1 className="text-3xl font-bold mb-6">Syarat & Ketentuan</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Penerimaan</h2>
            <p>
              Dengan mengakses dan menggunakan platform Rapatin, Anda setuju untuk terikat oleh Syarat & Ketentuan ini. Jika Anda tidak setuju dengan salah satu ketentuan ini, mohon untuk tidak menggunakan layanan kami.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Penggunaan Layanan</h2>
            <p>
              Anda setuju untuk menggunakan layanan Rapatin hanya untuk tujuan yang sah dan sesuai dengan semua hukum dan peraturan yang berlaku. Anda bertanggung jawab penuh atas semua aktivitas yang terjadi di bawah akun Anda.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Akun Pengguna</h2>
            <p>
              Untuk mengakses fitur tertentu dari platform Rapatin, Anda mungkin perlu membuat akun. Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda, termasuk kata sandi Anda.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Pembayaran</h2>
            <p>
              Penggunaan beberapa fitur di Rapatin mungkin memerlukan pembayaran. Anda setuju untuk membayar semua biaya yang berlaku sesuai dengan harga dan ketentuan pembayaran yang berlaku saat itu.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Kekayaan Intelektual</h2>
            <p>
              Semua konten dan materi yang tersedia di platform Rapatin, termasuk namun tidak terbatas pada teks, grafik, logo, dan perangkat lunak, adalah milik Rapatin atau pemberi lisensinya dan dilindungi oleh hukum kekayaan intelektual.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Batasan Tanggung Jawab</h2>
            <p>
              Platform Rapatin disediakan "sebagaimana adanya" dan "sebagaimana tersedia" tanpa jaminan apapun. Kami tidak bertanggung jawab atas kerugian atau kerusakan apapun yang timbul dari penggunaan layanan kami.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Perubahan Syarat & Ketentuan</h2>
            <p>
              Kami berhak untuk mengubah Syarat & Ketentuan ini kapan saja. Perubahan akan berlaku segera setelah diposting di platform Rapatin. Anda bertanggung jawab untuk meninjau Syarat & Ketentuan ini secara berkala.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Hukum yang Berlaku</h2>
            <p>
              Syarat & Ketentuan ini akan diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Kontak</h2>
            <p>
              Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami melalui informasi kontak yang tersedia di situs web kami.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SyaratKetentuan;
