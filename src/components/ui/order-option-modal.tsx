
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, Smartphone, Check, X, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useURLParams } from '@/hooks/useURLParams';

interface OrderOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderOptionModal: React.FC<OrderOptionModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const urlParams = useURLParams();

  const handleQuickOrder = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'QuickOrderSelected');
    }
    // Langsung navigasi - modal akan unmount bersama parent component
    navigate('/quick-order');
  };

  const handleViaApp = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'AppRegistrationSelected');
    }
    
    let url = 'https://app.rapatin.id/dashboard/register';
    if (urlParams.referralCode && urlParams.referralCode !== 'TRIAL25') {
      url += `?ref=${urlParams.referralCode}`;
    }
    
    window.open(url, '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl md:text-2xl font-bold flex items-center justify-center gap-2">
            🎯 Pilih Cara Order Anda
          </DialogTitle>
          <DialogDescription>
            Pilih metode yang paling sesuai dengan kebutuhan Anda
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {/* Via Aplikasi Option - Rekomendasi (Left) */}
          <div className="border-2 border-primary rounded-xl p-5 relative shadow-md bg-primary/5">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                Rekomendasi
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Via Aplikasi</h3>
                <p className="text-xs text-muted-foreground">Fitur Lengkap</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Kelola semua di dashboard
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-foreground">Edit jadwal kapan saja</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-foreground">Akses rekaman cloud</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-foreground">Laporan peserta</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-foreground">Ringkasan rapat (AI)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-foreground">Riwayat semua meeting</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>Perlu daftar akun</span>
              </div>
            </div>
            
            <Button 
              onClick={handleViaApp} 
              className="w-full"
            >
              Daftar & Mulai
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-3">
              Cocok untuk meeting rutin/berulang
            </p>
          </div>

          {/* Quick Order Option (Right) */}
          <div className="border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all bg-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Quick Order</h3>
                <p className="text-xs text-muted-foreground">Praktis & Cepat</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Tanpa perlu daftar akun
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-foreground">Bayar langsung</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-foreground">Link Zoom instan</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-foreground">Tanpa registrasi</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>Tidak bisa edit jadwal</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>Tidak ada akses rekaman</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>Tidak ada laporan peserta</span>
              </div>
            </div>
            
            <Button 
              onClick={handleQuickOrder} 
              variant="outline" 
              className="w-full"
            >
              Pilih Quick Order
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-3">
              Cocok untuk meeting sekali pakai
            </p>
          </div>
        </div>

        {/* Help Footer */}
        <div className="mt-4 pt-4 border-t border-border text-center">
          <a 
            href="https://wa.me/6287788980084" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Butuh bantuan memilih? Hubungi kami via WhatsApp
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderOptionModal;
