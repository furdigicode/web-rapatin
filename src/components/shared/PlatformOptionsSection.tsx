import React from 'react';
import SectionContainer from '@/components/layout/SectionContainer';
import { Video, Users, CheckCircle2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PlatformOptionsSection: React.FC = () => {
  return (
    <SectionContainer id="platforms" background="accent">
      <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
        <div className="inline-flex items-center py-1 px-4 bg-primary/10 rounded-full mb-4">
          <span className="text-xs font-medium text-primary">Platform Webinar</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Fleksibilitas Platform <span className="text-primary">Sesuai Kebutuhan</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          Rapatin menyediakan Zoom gratis atau Anda bisa menggunakan platform pilihan sendiri
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Zoom Disediakan Rapatin */}
        <div className="glass p-8 rounded-xl transition-all duration-300 hover:shadow-elevation animate-fade-in relative">
          <Badge variant="highlight" className="uppercase tracking-wide absolute -top-3 -right-3 ring-2 ring-background">GRATIS</Badge>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Video className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-4">Zoom Disediakan Rapatin</h3>
          <p className="text-muted-foreground mb-6">
            Tidak perlu berlangganan Zoom sendiri. Kami sediakan gratis untuk semua event Anda.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Tanpa Akun Zoom Berlangganan</p>
                <p className="text-sm text-muted-foreground">Rapatin menyediakan lisensi Zoom untuk event Anda</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Kapasitas Hingga 1.000 Peserta</p>
                <p className="text-sm text-muted-foreground">Opsional sesuai paket yang dipilih</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Terintegrasi Penuh</p>
                <p className="text-sm text-muted-foreground">Rekaman cloud, laporan peserta, dan ringkasan acara (AI Companion)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Lain */}
        <div className="glass p-8 rounded-xl transition-all duration-300 hover:shadow-elevation animate-fade-in delay-100">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <ExternalLink className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-4">Platform Lain (Opsional)</h3>
          <p className="text-muted-foreground mb-6">
            Gunakan Google Meet, Microsoft Teams, Webex, atau platform pilihan Anda sendiri.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Platform Fleksibel</p>
                <p className="text-sm text-muted-foreground">Google Meet, MS Teams, Webex, atau lainnya</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Anda Sediakan Link Meeting</p>
                <p className="text-sm text-muted-foreground">Lisensi/akses platform tidak disediakan otomatis</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Manajemen Event Tetap Rapatin</p>
                <p className="text-sm text-muted-foreground">Pendaftaran, reminder, dan distribusi akses dikelola Rapatin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default PlatformOptionsSection;