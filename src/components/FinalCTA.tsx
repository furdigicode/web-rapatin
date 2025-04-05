
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { useUrlData } from "@/hooks/use-url-data";

const FinalCTA: React.FC = () => {
  const { urls, loading } = useUrlData();
  
  const handleRegistration = () => {
    // Track registration click with Facebook Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CompleteRegistration');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto glass rounded-2xl p-8 md:p-12 shadow-elevation border border-white/40 animate-scale-in">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Siap untuk menjadwalkan rapat pertama Anda?</h2>
              <p className="text-muted-foreground mb-6">
                Bergabunglah dengan ribuan pengguna yang sudah menikmati fleksibilitas platform rapat bayar-sesuai-penggunaan kami.
              </p>
              <Button asChild size="lg" className="rounded-lg bg-primary hover:bg-primary/90 text-white">
                <a href={urls.cta.registerButton} onClick={handleRegistration} target="_blank" rel="noopener noreferrer">
                  Daftar & Mulai Menjadwalkan
                  <ArrowRight size={16} className="ml-2" />
                </a>
              </Button>
            </div>
            <div className="rounded-xl bg-primary/5 p-6 space-y-4">
              <h3 className="font-medium text-lg">Yang akan Anda dapatkan:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-5 h-5 flex-none shrink-0 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-sm">Pengaturan rapat instan tanpa akun Zoom berbayar</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex-none shrink-0 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-sm">Bayar hanya untuk rapat yang benar-benar Anda jadwalkan</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex-none shrink-0 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-sm">Rekaman cloud dan laporan peserta</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex-none shrink-0 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-sm">Akses penuh ke fitur rapat premium</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 flex-none shrink-0 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-primary">✓</span>
                  </div>
                  <span className="text-sm">Dukungan khusus untuk semua pertanyaan Anda</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
