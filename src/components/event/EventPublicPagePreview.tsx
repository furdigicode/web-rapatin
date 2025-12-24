import React from 'react';
import SectionContainer from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/badge';

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
    </SectionContainer>
  );
};

export default EventPublicPagePreview;
