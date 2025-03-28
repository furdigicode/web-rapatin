
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Default terms data
const defaultTermsData = {
  header: {
    title: "Syarat & Ketentuan",
    lastUpdated: "1 Juni 2023",
  },
  sections: [
    {
      id: "1",
      title: "1. Pendahuluan",
      content: "Selamat datang di Rapatin. Syarat & Ketentuan ini mengatur penggunaan Anda atas layanan yang disediakan oleh PT Rapatin Teknologi Indonesia (\"Rapatin,\" \"kami,\" atau \"kita\").\n\nDengan mengakses atau menggunakan layanan kami, Anda setuju untuk terikat oleh Syarat & Ketentuan ini. Jika Anda tidak setuju dengan bagian apa pun dari dokumen ini, Anda tidak boleh mengakses layanan kami."
    },
    {
      id: "2",
      title: "2. Penggunaan Layanan",
      content: "Rapatin menyediakan platform penjadwalan rapat online dengan model bayar-sesuai-pakai. Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda, termasuk kata sandi.\n\nAnda setuju untuk tidak menggunakan layanan kami untuk tujuan ilegal atau yang dilarang oleh Syarat & Ketentuan ini. Anda tidak boleh menggunakan layanan kami dengan cara yang dapat merusak, menonaktifkan, membebani, atau mengganggu layanan kami."
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
              
              {/* Contact Section if needed */}
              {termsData.sections.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Hubungi Kami</h2>
                  <p className="mb-3">
                    Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, hubungi kami di:
                  </p>
                  <p>
                    Email: <a href="mailto:legal@rapatin.id" className="text-primary">legal@rapatin.id</a><br />
                    Telepon: +62 812 3456 7890<br />
                    Alamat: Jl. Sudirman No. 123, Jakarta Selatan, 12190, Indonesia
                  </p>
                </section>
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
