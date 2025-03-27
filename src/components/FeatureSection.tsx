
import React from 'react';
import { 
  Calendar, 
  CloudLightning, 
  CreditCard, 
  Download, 
  FileText, 
  LayoutDashboard, 
  LifeBuoy, 
  Video,
  GraduationCap,
  Users,
  Briefcase,
  Mic
} from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, delay }) => {
  return (
    <div className={`glass p-6 rounded-xl transition-all duration-300 hover:shadow-elevation animate-fade-in ${delay}`}>
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: <CreditCard size={22} />,
      title: "Model Bayar Sesuai Pakai",
      description: "Top up saldo akun Anda dan bayar hanya untuk rapat yang Anda jadwalkan. Tanpa langganan bulanan atau biaya tersembunyi.",
      delay: "delay-0"
    },
    {
      icon: <LayoutDashboard size={22} />,
      title: "Dashboard Intuitif",
      description: "Buat atau edit jadwal dengan antarmuka modern kami yang dirancang untuk kemudahan penggunaan.",
      delay: "delay-100"
    },
    {
      icon: <CloudLightning size={22} />,
      title: "Rekaman Cloud",
      description: "Rekaman otomatis disimpan dan tersedia untuk diunduh selama 72 jam melalui dashboard Anda.",
      delay: "delay-200"
    },
    {
      icon: <FileText size={22} />,
      title: "Laporan Peserta",
      description: "Dapatkan laporan kehadiran otomatis untuk setiap rapat untuk melacak partisipasi.",
      delay: "delay-300"
    },
    {
      icon: <Video size={22} />,
      title: "Tanpa Akun Zoom Berbayar",
      description: "Jadwalkan rapat tanpa memerlukan akun Zoom berbayar. Berfungsi langsung untuk semua orang.",
      delay: "delay-400"
    },
    {
      icon: <LifeBuoy size={22} />,
      title: "Dukungan Khusus",
      description: "Tim dukungan kami siap membantu dengan masalah teknis apa pun yang mungkin Anda temui.",
      delay: "delay-500"
    },
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-accent/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center py-1 px-4 bg-accent rounded-full mb-4">
            <span className="text-xs font-medium text-primary">Fitur Unggulan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Semua yang Anda butuhkan untuk <span className="text-primary">rapat online</span> yang lancar
          </h2>
          <p className="text-muted-foreground text-lg">
            Platform kami menggabungkan fleksibilitas dengan fitur canggih untuk membuat rapat online Anda mudah dan produktif.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Feature 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>

        <div className="mt-20 max-w-3xl mx-auto glass p-8 rounded-xl animate-fade-in shadow-soft">
          <h3 className="text-2xl font-bold mb-6 text-center">
            <span className="text-primary">Rapatin </span>Cocok Untuk
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                <GraduationCap size={18} />
              </div>
              <p className="font-medium text-sm">Guru & Dosen</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                <Briefcase size={18} />
              </div>
              <p className="font-medium text-sm">Bisnis & Startup</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                <Mic size={18} />
              </div>
              <p className="font-medium text-sm">Coach & Trainer</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                <Users size={18} />
              </div>
              <p className="font-medium text-sm">Komunitas & Organisasi</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                <GraduationCap size={18} />
              </div>
              <p className="font-medium text-sm">Guru & Dosen</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                <Briefcase size={18} />
              </div>
              <p className="font-medium text-sm">Bisnis & Startup</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                <Mic size={18} />
              </div>
              <p className="font-medium text-sm">Coach & Trainer</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                <Users size={18} />
              </div>
              <p className="font-medium text-sm">Komunitas & Organisasi</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
