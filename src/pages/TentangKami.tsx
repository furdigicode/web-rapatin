
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Users, Award, TrendingUp, Heart, Book } from 'lucide-react';

// Default about data
const defaultAboutData = {
  header: {
    title: "Tentang Kami",
    description: "Rapatin hadir untuk menjadikan rapat online lebih mudah dan terjangkau untuk semua orang."
  },
  story: {
    title: "Kisah Kami",
    content: "Rapatin didirikan pada tahun 2023 oleh sekelompok profesional teknologi yang frustrasi dengan biaya langganan bulanan layanan rapat online yang mahal.\n\nKami percaya bahwa teknologi rapat online seharusnya tersedia untuk semua orang tanpa perlu membayar langganan bulanan yang mahal. Itulah mengapa kami menciptakan model bayar-sesuai-pakai yang inovatif, memungkinkan pengguna untuk membayar hanya untuk rapat yang benar-benar mereka jadwalkan.\n\nSejak itu, misi kami adalah membuat rapat online lebih terjangkau dan fleksibel untuk bisnis dari semua ukuran, pengajar, dan profesional di seluruh Indonesia."
  },
  values: {
    title: "Nilai-Nilai Kami",
    values: [
      { 
        id: 1, 
        icon: "trending-up", 
        title: "Inovasi", 
        description: "Kami terus berinovasi untuk memberikan solusi terbaik bagi pengguna kami."
      },
      { 
        id: 2, 
        icon: "award", 
        title: "Kualitas", 
        description: "Kami berkomitmen untuk menyediakan layanan berkualitas tinggi dengan harga terjangkau."
      },
      { 
        id: 3, 
        icon: "users", 
        title: "Komunitas", 
        description: "Kami membangun komunitas yang inklusif dan mendukung semua pengguna kami."
      },
      { 
        id: 4, 
        icon: "heart", 
        title: "Kepedulian", 
        description: "Kami peduli dengan kebutuhan pengguna dan selalu mendengarkan masukan mereka."
      }
    ]
  },
  team: {
    title: "Tim Kami",
    members: [
      { 
        id: 1, 
        name: "Budi Setiawan", 
        position: "CEO & Founder", 
        bio: "Berpengalaman 10+ tahun di industri teknologi dan telekomunikasi.",
        avatarUrl: ""
      },
      { 
        id: 2, 
        name: "Dewi Lestari", 
        position: "CTO", 
        bio: "Insinyur perangkat lunak dengan pengalaman di perusahaan teknologi global.",
        avatarUrl: ""
      },
      { 
        id: 3, 
        name: "Adi Nugroho", 
        position: "CPO", 
        bio: "Pakar UX/UI dengan fokus pada pengembangan produk yang berpusat pada pengguna.",
        avatarUrl: ""
      }
    ]
  }
};

const TentangKami = () => {
  const [aboutData, setAboutData] = useState(defaultAboutData);

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('aboutPageData');
    if (savedData) {
      try {
        setAboutData(JSON.parse(savedData));
      } catch (e) {
        console.error('Error parsing saved about page data:', e);
      }
    }
  }, []);

  // Function to render paragraphs with line breaks
  const renderParagraphs = (text) => {
    return text.split('\n\n').map((paragraph, index) => (
      <p key={index} className={index > 0 ? "mb-4" : ""}>
        {paragraph}
      </p>
    ));
  };

  // Get icon component by name
  const getIconComponent = (iconName, size = 24) => {
    switch (iconName) {
      case 'trending-up':
        return <TrendingUp size={size} />;
      case 'award':
        return <Award size={size} />;
      case 'users':
        return <Users size={size} />;
      case 'heart':
        return <Heart size={size} />;
      case 'book':
        return <Book size={size} />;
      default:
        return <TrendingUp size={size} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{aboutData.header.title}</h1>
            <p className="text-lg text-muted-foreground">
              {aboutData.header.description}
            </p>
          </div>
          
          {/* Our Story */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold mb-6">{aboutData.story.title}</h2>
            <div className="glass p-8 rounded-xl">
              {renderParagraphs(aboutData.story.content)}
            </div>
          </div>
          
          {/* Values */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold mb-6">{aboutData.values.title}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {aboutData.values.values.map((value) => (
                <div key={value.id} className="glass p-6 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    {getIconComponent(value.icon)}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TentangKami;
