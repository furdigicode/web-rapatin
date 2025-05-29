
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Default terms data
const defaultTermsData = {
  header: {
    title: "Syarat & Ketentuan",
    lastUpdated: "29 Mei 2025",
  },
  sections: [
    {
      id: "1",
      title: "1. Pendahuluan",
      content: "Selamat datang di Rapatin. Syarat & Ketentuan ini mengatur penggunaan Anda atas layanan yang disediakan Rapatin (\"Rapatin,\" \"kami,\" atau \"kita\").\n\nDengan mengakses atau menggunakan layanan kami, Anda setuju untuk terikat oleh Syarat & Ketentuan ini. Jika Anda tidak setuju dengan bagian apa pun dari dokumen ini, Anda tidak boleh mengakses layanan kami."
    },
    {
      id: "2",
      title: "2. Penggunaan Layanan",
      content: "Rapatin menyediakan platform penjadwalan rapat online dengan model bayar-sesuai-pakai. Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda, termasuk kata sandi.\n\nAnda setuju untuk tidak menggunakan layanan kami untuk tujuan ilegal atau yang dilarang oleh Syarat & Ketentuan ini. Anda tidak boleh menggunakan layanan kami dengan cara yang dapat merusak, menonaktifkan, membebani, atau mengganggu layanan kami."
    },
    {
      id: "3",
      title: "3. Platform Meeting Zoom",
      content: "Rapatin menggunakan Zoom sebagai platform meeting pihak ketiga melalui Zoom Developer Platform (API dan komponen lainnya). Rapatin BUKAN bagian dari perusahaan Zoom dan merupakan pengguna Zoom yang memanfaatkan layanan developer mereka.\n\nSemua Meeting ID yang dihasilkan sepenuhnya berada di bawah kontrol Zoom. Jika terjadi pemblokiran, penangguhan (suspend), atau tindakan serupa terhadap akun Zoom, hal tersebut sepenuhnya merupakan wewenang Zoom.\n\nJika Meeting ID diblokir atau ditangguhkan oleh Zoom, Rapatin tidak dapat membantu proses banding untuk reaktivasi akun tersebut. Dalam situasi ini, pengguna dapat membuat akun baru untuk melanjutkan penggunaan layanan."
    },
    {
      id: "4",
      title: "4. Akun dan Pembayaran",
      content: "Untuk menggunakan layanan kami, Anda harus membuat akun dan melakukan top-up saldo. Pembayaran dilakukan melalui metode pembayaran yang kami sediakan. Biaya layanan kami didasarkan pada penggunaan aktual Anda.\n\nKami berhak mengubah harga layanan kami kapan saja. Perubahan harga akan diumumkan melalui situs web atau email. Penggunaan berkelanjutan atas layanan kami setelah perubahan harga merupakan persetujuan Anda terhadap harga baru."
    },
    {
      id: "5",
      title: "5. Hak Kekayaan Intelektual",
      content: "Layanan kami dan konten yang terkait dengannya, termasuk tetapi tidak terbatas pada teks, grafik, logo, ikon, gambar, klip audio, unduhan digital, dan kompilasi data, adalah milik Rapatin atau pemberi lisensinya dan dilindungi oleh hukum hak cipta internasional."
    },
    {
      id: "6",
      title: "6. Privasi",
      content: "Penggunaan Anda atas layanan kami juga diatur oleh Kebijakan Privasi kami, yang tersedia di situs web kami. Dengan menggunakan layanan kami, Anda juga menyetujui Kebijakan Privasi kami."
    },
    {
      id: "7",
      title: "7. Pembatasan Tanggung Jawab",
      content: "Sejauh diizinkan oleh hukum, Rapatin tidak bertanggung jawab atas kerugian tidak langsung, insidental, khusus, konsekuensial, atau hukuman, termasuk kerugian keuntungan, pendapatan, data, atau penggunaan, yang timbul dari atau terkait dengan penggunaan Anda atas layanan kami."
    },
    {
      id: "8",
      title: "8. Penghentian",
      content: "Kami berhak menghentikan atau menangguhkan akses Anda ke layanan kami, tanpa pemberitahuan sebelumnya, karena alasan apa pun, termasuk tanpa batasan jika Anda melanggar Syarat & Ketentuan ini."
    },
    {
      id: "9",
      title: "9. Perubahan",
      content: "Kami berhak, atas kebijakan kami sendiri, untuk mengubah atau mengganti Syarat & Ketentuan ini kapan saja. Perubahan yang signifikan akan diumumkan melalui situs web atau email. Penggunaan berkelanjutan atas layanan kami setelah perubahan tersebut merupakan persetujuan Anda terhadap Syarat & Ketentuan baru."
    },
    {
      id: "10",
      title: "10. Hubungi Kami",
      content: "Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, hubungi kami di:\n\nEmail: ladmin@rapatin.id"
    }
  ]
};

const SyaratKetentuan = () => {
  const [termsData, setTermsData] = useState(defaultTermsData);

  // Load terms data from localStorage when component mounts
  useEffect(() => {
    const savedData = localStorage.getItem("termsData");
    if (savedData) {
      setTermsData(JSON.parse(savedData));
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{termsData.header.title}</h1>
            <p className="text-lg text-muted-foreground">
              Terakhir diperbarui: {termsData.header.lastUpdated}
            </p>
          </div>
          
          {/* Content */}
          <div className="max-w-4xl mx-auto">
            <div className="glass p-8 rounded-xl space-y-8">
              {termsData.sections.map((section) => (
                <section key={section.id}>
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  {/* Split paragraphs and render them */}
                  {section.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className={index < section.content.split('\n\n').length - 1 ? "mb-3" : ""}>
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
              
              {termsData.sections.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <p>Konten syarat dan ketentuan belum tersedia.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SyaratKetentuan;
