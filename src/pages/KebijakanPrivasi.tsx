
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Default privacy data
const defaultPrivacyData = {
  header: {
    title: "Kebijakan Privasi",
    lastUpdated: "1 Juni 2023",
  },
  sections: [
    {
      id: "1",
      title: "1. Pendahuluan",
      content: "PT Rapatin Teknologi Indonesia (\"Rapatin,\" \"kami,\" atau \"kita\") menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan mengungkapkan informasi pribadi Anda saat Anda menggunakan layanan kami.\n\nDengan menggunakan layanan kami, Anda menyetujui praktik yang dijelaskan dalam Kebijakan Privasi ini. Jika Anda tidak setuju dengan kebijakan ini, harap jangan gunakan layanan kami."
    },
    {
      id: "2",
      title: "2. Informasi yang Kami Kumpulkan",
      content: "Kami dapat mengumpulkan beberapa jenis informasi dari dan tentang pengguna layanan kami, termasuk:\n\n- Informasi pribadi seperti nama, alamat email, dan nomor telepon.\n- Informasi pembayaran untuk memproses transaksi.\n- Informasi tentang penggunaan layanan kami, seperti waktu, durasi, dan jumlah peserta rapat.\n- Informasi teknis seperti alamat IP, jenis perangkat, dan jenis browser."
    }
  ]
};

const KebijakanPrivasi = () => {
  const [privacyData, setPrivacyData] = useState(defaultPrivacyData);

  // Load privacy data from localStorage when component mounts
  useEffect(() => {
    const savedData = localStorage.getItem("privacyData");
    if (savedData) {
      setPrivacyData(JSON.parse(savedData));
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{privacyData.header.title}</h1>
            <p className="text-lg text-muted-foreground">
              Terakhir diperbarui: {privacyData.header.lastUpdated}
            </p>
          </div>
          
          {/* Content */}
          <div className="max-w-4xl mx-auto">
            <div className="glass p-8 rounded-xl space-y-8">
              {privacyData.sections.map((section) => (
                <section key={section.id}>
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  {/* Split paragraphs and render them */}
                  {section.content.split('\n\n').map((paragraph, index) => {
                    // Special handling for lists (lines starting with '- ')
                    if (paragraph.includes('\n- ')) {
                      const [introText, ...listItems] = paragraph.split('\n- ');
                      return (
                        <div key={index} className={index < section.content.split('\n\n').length - 1 ? "mb-3" : ""}>
                          {introText && <p className="mb-3">{introText}</p>}
                          <ul className="list-disc pl-6 space-y-2">
                            {listItems.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    } else {
                      return (
                        <p key={index} className={index < section.content.split('\n\n').length - 1 ? "mb-3" : ""}>
                          {paragraph}
                        </p>
                      );
                    }
                  })}
                </section>
              ))}
              
              {privacyData.sections.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <p>Konten kebijakan privasi belum tersedia.</p>
                </div>
              )}
              
              {/* Contact Section if needed */}
              {privacyData.sections.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Hubungi Kami</h2>
                  <p className="mb-3">
                    Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, hubungi kami di:
                  </p>
                  <p>
                    Email: <a href="mailto:privacy@rapatin.id" className="text-primary">privacy@rapatin.id</a><br />
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

export default KebijakanPrivasi;
