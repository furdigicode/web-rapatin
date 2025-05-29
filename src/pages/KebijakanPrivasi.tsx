
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
      content: "Rapatin (\"Rapatin,\" \"kami,\" atau \"kita\") menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan mengungkapkan informasi pribadi Anda saat Anda menggunakan layanan kami.\n\nDengan menggunakan layanan kami, Anda menyetujui praktik yang dijelaskan dalam Kebijakan Privasi ini. Jika Anda tidak setuju dengan kebijakan ini, harap jangan gunakan layanan kami."
    },
    {
      id: "2",
      title: "2. Informasi yang Kami Kumpulkan",
      content: "Kami dapat mengumpulkan beberapa jenis informasi dari dan tentang pengguna layanan kami, termasuk: \n\n- Informasi pribadi seperti nama, alamat email, dan nomor telepon.\n- Informasi pembayaran untuk memproses transaksi.\n- Informasi tentang penggunaan layanan kami, seperti waktu, durasi, dan jumlah peserta rapat.\n- Informasi teknis seperti alamat IP, jenis perangkat, dan jenis browser."
    },
    {
      id: "3",
      title: "3. Bagaimana Kami Menggunakan Informasi Anda",
      content: "Kami menggunakan informasi yang kami kumpulkan untuk:\n\n- Menyediakan, memelihara, dan meningkatkan layanan kami.\n- Memproses pembayaran dan mengelola akun Anda.\n- Mengirimkan informasi tentang layanan, pembaruan, dan peristiwa terkait.\n- Merespons pertanyaan dan menyediakan dukungan pelanggan.\n- Mematuhi kewajiban hukum dan peraturan."
    },
    {
      id: "4",
      title: "4. Berbagi Informasi Anda",
      content: "Kami tidak akan menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Namun, kami dapat membagikan informasi Anda dalam situasi berikut:\n\n- Dengan penyedia layanan pihak ketiga yang membantu kami mengoperasikan layanan kami.\n- Dengan afiliasi kami untuk tujuan yang dijelaskan dalam Kebijakan Privasi ini.\n- Untuk mematuhi kewajiban hukum atau peraturan.\n- Untuk melindungi hak, properti, atau keselamatan kami, pengguna kami, atau orang lain."
    },
    {
      id: "5",
      title: "5. Keamanan Data",
      content: "Kami mengimplementasikan langkah-langkah keamanan yang dirancang untuk melindungi informasi pribadi Anda dari akses yang tidak sah atau pengungkapan. Namun, tidak ada metode transmisi internet atau penyimpanan elektronik yang 100% aman, dan kami tidak dapat menjamin keamanan mutlak."
    },
    {
      id: "6",
      title: "6. Hak Privasi Anda",
      content: "Tergantung pada lokasi Anda, Anda mungkin memiliki hak tertentu terkait dengan informasi pribadi Anda, termasuk:\n\n- Hak untuk mengakses informasi pribadi Anda.\n- Hak untuk memperbaiki informasi yang tidak akurat.\n- Hak untuk menghapus informasi Anda.\n- Hak untuk membatasi pemrosesan informasi Anda.\n- Hak untuk meminta portabilitas data.\n\nUntuk menggunakan hak-hak ini, hubungi kami menggunakan informasi kontak yang disediakan di bawah."
    },
    {
      id: "7",
      title: "7. Kebijakan Cookie",
      content: "Kami menggunakan cookie dan teknologi pelacakan serupa untuk meningkatkan pengalaman Anda dengan layanan kami. Anda dapat mengontrol penggunaan cookie melalui pengaturan browser Anda."
    },
    {
      id: "8",
      title: "8. Perubahan pada Kebijakan Privasi Ini",
      content: "Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan akan diumumkan melalui situs web kami atau melalui email. Kami mendorong Anda untuk meninjau Kebijakan Privasi ini secara berkala."
    },
    {
      id: "9",
      title: "9. Hubungi Kami",
      content: "Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, hubungi kami di:\n\nEmail: admin@rapatin.id"
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
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default KebijakanPrivasi;
