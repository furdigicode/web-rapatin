
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SyaratKetentuan = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Syarat & Ketentuan</h1>
            <p className="text-lg text-muted-foreground">
              Terakhir diperbarui: 1 Juni 2023
            </p>
          </div>
          
          {/* Content */}
          <div className="max-w-4xl mx-auto">
            <div className="glass p-8 rounded-xl space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Pendahuluan</h2>
                <p className="mb-3">
                  Selamat datang di Rapatin. Syarat & Ketentuan ini mengatur penggunaan Anda atas layanan yang disediakan oleh PT Rapatin Teknologi Indonesia ("Rapatin," "kami," atau "kita").
                </p>
                <p>
                  Dengan mengakses atau menggunakan layanan kami, Anda setuju untuk terikat oleh Syarat & Ketentuan ini. Jika Anda tidak setuju dengan bagian apa pun dari dokumen ini, Anda tidak boleh mengakses layanan kami.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">2. Penggunaan Layanan</h2>
                <p className="mb-3">
                  Rapatin menyediakan platform penjadwalan rapat online dengan model bayar-sesuai-pakai. Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda, termasuk kata sandi.
                </p>
                <p className="mb-3">
                  Anda setuju untuk tidak menggunakan layanan kami untuk tujuan ilegal atau yang dilarang oleh Syarat & Ketentuan ini. Anda tidak boleh menggunakan layanan kami dengan cara yang dapat merusak, menonaktifkan, membebani, atau mengganggu layanan kami.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">3. Akun dan Pembayaran</h2>
                <p className="mb-3">
                  Untuk menggunakan layanan kami, Anda harus membuat akun dan melakukan top-up saldo. Pembayaran dilakukan melalui metode pembayaran yang kami sediakan. Biaya layanan kami didasarkan pada penggunaan aktual Anda.
                </p>
                <p className="mb-3">
                  Kami berhak mengubah harga layanan kami kapan saja. Perubahan harga akan diumumkan melalui situs web atau email. Penggunaan berkelanjutan atas layanan kami setelah perubahan harga merupakan persetujuan Anda terhadap harga baru.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">4. Hak Kekayaan Intelektual</h2>
                <p className="mb-3">
                  Layanan kami dan konten yang terkait dengannya, termasuk tetapi tidak terbatas pada teks, grafik, logo, ikon, gambar, klip audio, unduhan digital, dan kompilasi data, adalah milik Rapatin atau pemberi lisensinya dan dilindungi oleh hukum hak cipta internasional.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">5. Privasi</h2>
                <p className="mb-3">
                  Penggunaan Anda atas layanan kami juga diatur oleh Kebijakan Privasi kami, yang tersedia di situs web kami. Dengan menggunakan layanan kami, Anda juga menyetujui Kebijakan Privasi kami.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">6. Pembatasan Tanggung Jawab</h2>
                <p className="mb-3">
                  Sejauh diizinkan oleh hukum, Rapatin tidak bertanggung jawab atas kerugian tidak langsung, insidental, khusus, konsekuensial, atau hukuman, termasuk kerugian keuntungan, pendapatan, data, atau penggunaan, yang timbul dari atau terkait dengan penggunaan Anda atas layanan kami.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">7. Penghentian</h2>
                <p className="mb-3">
                  Kami berhak menghentikan atau menangguhkan akses Anda ke layanan kami, tanpa pemberitahuan sebelumnya, karena alasan apa pun, termasuk tanpa batasan jika Anda melanggar Syarat & Ketentuan ini.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">8. Perubahan</h2>
                <p className="mb-3">
                  Kami berhak, atas kebijakan kami sendiri, untuk mengubah atau mengganti Syarat & Ketentuan ini kapan saja. Perubahan yang signifikan akan diumumkan melalui situs web atau email. Penggunaan berkelanjutan atas layanan kami setelah perubahan tersebut merupakan persetujuan Anda terhadap Syarat & Ketentuan baru.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">9. Hubungi Kami</h2>
                <p className="mb-3">
                  Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, hubungi kami di:
                </p>
                <p>
                  Email: <a href="mailto:legal@rapatin.id" className="text-primary">legal@rapatin.id</a><br />
                  Telepon: +62 812 3456 7890<br />
                  Alamat: Jl. Sudirman No. 123, Jakarta Selatan, 12190, Indonesia
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SyaratKetentuan;
