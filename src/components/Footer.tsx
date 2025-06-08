import React from 'react';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <a href="/" className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/2daea350-0851-4dd8-8f79-ee07aaaad905.png" 
                alt="Rapatin Logo" 
                className="h-8" 
              />
            </a>
            <p className="text-muted-foreground mb-4 text-sm">
              Platform terlengkap untuk semua kebutuhan penjadwalan Anda. Kelola meeting, event, dan appointment dalam satu tempat dengan sistem bayar sesuai pakai tanpa komitmen berlangganan.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Fitur</h3>
            <ul className="space-y-2">
              <li><a href="/fitur/bayar-sesuai-pakai" className="text-muted-foreground hover:text-primary text-sm transition-colors">Bayar-Sesuai-Pakai</a></li>
              <li><a href="/fitur/dashboard" className="text-muted-foreground hover:text-primary text-sm transition-colors">Dashboard</a></li>
              <li><a href="/fitur/rekaman-cloud" className="text-muted-foreground hover:text-primary text-sm transition-colors">Rekaman Cloud</a></li>
              <li><a href="/fitur/laporan-peserta" className="text-muted-foreground hover:text-primary text-sm transition-colors">Laporan Peserta</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Sumber Daya</h3>
            <ul className="space-y-2">
              <li><a href="/faq" className="text-muted-foreground hover:text-primary text-sm transition-colors">FAQ</a></li>
              <li><a href="https://help.rapatin.id" className="text-muted-foreground hover:text-primary text-sm transition-colors">Pusat Bantuan</a></li>
              <li><a href="/menjadi-reseller" className="text-muted-foreground hover:text-primary text-sm transition-colors">Menjadi Reseller</a></li>
              <li><a href="/blog" className="text-muted-foreground hover:text-primary text-sm transition-colors">Artikel Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Perusahaan</h3>
            <ul className="space-y-2">
              <li><a href="/tentang-kami" className="text-muted-foreground hover:text-primary text-sm transition-colors">Tentang Kami</a></li>
              <li><a href="/kontak" className="text-muted-foreground hover:text-primary text-sm transition-colors">Kontak Kami</a></li>
              <li><a href="/syarat-ketentuan" className="text-muted-foreground hover:text-primary text-sm transition-colors">Syarat Ketentuan</a></li>
              <li><a href="/kebijakan-privasi" className="text-muted-foreground hover:text-primary text-sm transition-colors">Kebijakan Privasi</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-first items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Rapatin. Seluruh hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
