
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const KebijakanPrivasi = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Kebijakan Privasi</h1>
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
                  PT Rapatin Teknologi Indonesia ("Rapatin," "kami," atau "kita") menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan mengungkapkan informasi pribadi Anda saat Anda menggunakan layanan kami.
                </p>
                <p>
                  Dengan menggunakan layanan kami, Anda menyetujui praktik yang dijelaskan dalam Kebijakan Privasi ini. Jika Anda tidak setuju dengan kebijakan ini, harap jangan gunakan layanan kami.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">2. Informasi yang Kami Kumpulkan</h2>
                <p className="mb-3">
                  Kami dapat mengumpulkan beberapa jenis informasi dari dan tentang pengguna layanan kami, termasuk:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Informasi pribadi seperti nama, alamat email, dan nomor telepon.</li>
                  <li>Informasi pembayaran untuk memproses transaksi.</li>
                  <li>Informasi tentang penggunaan layanan kami, seperti waktu, durasi, dan jumlah peserta rapat.</li>
                  <li>Informasi teknis seperti alamat IP, jenis perangkat, dan jenis browser.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">3. Bagaimana Kami Menggunakan Informasi Anda</h2>
                <p className="mb-3">
                  Kami menggunakan informasi yang kami kumpulkan untuk:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Menyediakan, memelihara, dan meningkatkan layanan kami.</li>
                  <li>Memproses pembayaran dan mengelola akun Anda.</li>
                  <li>Mengirimkan informasi tentang layanan, pembaruan, dan peristiwa terkait.</li>
                  <li>Merespons pertanyaan dan menyediakan dukungan pelanggan.</li>
                  <li>Mematuhi kewajiban hukum dan peraturan.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">4. Berbagi Informasi Anda</h2>
                <p className="mb-3">
                  Kami tidak akan menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Namun, kami dapat membagikan informasi Anda dalam situasi berikut:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Dengan penyedia layanan pihak ketiga yang membantu kami mengoperasikan layanan kami.</li>
                  <li>Dengan afiliasi kami untuk tujuan yang dijelaskan dalam Kebijakan Privasi ini.</li>
                  <li>Untuk mematuhi kewajiban hukum atau peraturan.</li>
                  <li>Untuk melindungi hak, properti, atau keselamatan kami, pengguna kami, atau orang lain.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">5. Keamanan Data</h2>
                <p className="mb-3">
                  Kami mengimplementasikan langkah-langkah keamanan yang dirancang untuk melindungi informasi pribadi Anda dari akses yang tidak sah atau pengungkapan. Namun, tidak ada metode transmisi internet atau penyimpanan elektronik yang 100% aman, dan kami tidak dapat menjamin keamanan mutlak.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">6. Hak Privasi Anda</h2>
                <p className="mb-3">
                  Tergantung pada lokasi Anda, Anda mungkin memiliki hak tertentu terkait dengan informasi pribadi Anda, termasuk:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Hak untuk mengakses informasi pribadi Anda.</li>
                  <li>Hak untuk memperbaiki informasi yang tidak akurat.</li>
                  <li>Hak untuk menghapus informasi Anda.</li>
                  <li>Hak untuk membatasi pemrosesan informasi Anda.</li>
                  <li>Hak untuk meminta portabilitas data.</li>
                </ul>
                <p className="mt-3">
                  Untuk menggunakan hak-hak ini, hubungi kami menggunakan informasi kontak yang disediakan di bawah.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">7. Kebijakan Cookie</h2>
                <p className="mb-3">
                  Kami menggunakan cookie dan teknologi pelacakan serupa untuk meningkatkan pengalaman Anda dengan layanan kami. Anda dapat mengontrol penggunaan cookie melalui pengaturan browser Anda.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">8. Perubahan pada Kebijakan Privasi Ini</h2>
                <p className="mb-3">
                  Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan akan diumumkan melalui situs web kami atau melalui email. Kami mendorong Anda untuk meninjau Kebijakan Privasi ini secara berkala.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold mb-4">9. Hubungi Kami</h2>
                <p className="mb-3">
                  Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, hubungi kami di:
                </p>
                <p>
                  Email: <a href="mailto:privacy@rapatin.id" className="text-primary">privacy@rapatin.id</a><br />
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

export default KebijakanPrivasi;
