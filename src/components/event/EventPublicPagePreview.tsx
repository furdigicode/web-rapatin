import React from 'react';
import SectionContainer from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/badge';
import { Globe, CreditCard, Tag, ClipboardList, Calendar, Share2 } from 'lucide-react';

const previewFeatures = [
  {
    icon: Globe,
    title: "Halaman Landing Profesional",
    description: "Desain profesional otomatis tanpa perlu buat website terpisah"
  },
  {
    icon: CreditCard,
    title: "Pembayaran Terintegrasi",
    description: "Bayar langsung via QRIS, VA, E-Wallet, dan Kartu Kredit"
  },
  {
    icon: Tag,
    title: "Harga Diskon & Early Bird",
    description: "Tampilkan harga coret untuk menarik peserta mendaftar awal"
  },
  {
    icon: ClipboardList,
    title: "Form Registrasi Custom",
    description: "Kumpulkan data peserta dengan form yang bisa disesuaikan"
  },
  {
    icon: Calendar,
    title: "Info Event Lengkap",
    description: "Tanggal, waktu, quota, dan deskripsi ditampilkan jelas"
  },
  {
    icon: Share2,
    title: "Link Shareable",
    description: "Link unik untuk share ke WhatsApp, sosmed, atau embed website"
  }
];

const EventPublicPagePreview: React.FC = () => {
  return (
    <SectionContainer background="accent" className="overflow-hidden">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4 text-sm font-medium">
          Preview Halaman Publik
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Tampilan Halaman Event untuk{' '}
          <span className="text-primary">Peserta Anda</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Setiap event yang Anda buat akan memiliki halaman publik profesional 
          untuk pendaftaran dan pembayaran peserta.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Decorative elements */}
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        
        {/* Preview Image Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-background">
          <img 
            src="/lovable-uploads/event-public-preview.png" 
            alt="Preview halaman publik event - menampilkan halaman registrasi event dengan detail acara, harga, dan form pendaftaran"
            className="w-full h-auto"
            loading="lazy"
          />
          
          {/* Gradient overlay at bottom for smooth fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      </div>

      {/* Feature Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
        {previewFeatures.map((feature, index) => (
          <div 
            key={index}
            className="flex items-start gap-4 p-5 rounded-xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300"
          >
            <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
              <feature.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default EventPublicPagePreview;
