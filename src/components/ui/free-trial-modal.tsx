
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, Gift } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useURLParams } from "@/hooks/useURLParams";
import { formatRupiah } from "@/utils/formatRupiah";

interface FreeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode?: string;
  amount?: number;
}

const FreeTrialModal: React.FC<FreeTrialModalProps> = ({ 
  isOpen, 
  onClose, 
  referralCode: propReferralCode,
  amount: propAmount 
}) => {
  const [copied, setCopied] = useState(false);
  const urlParams = useURLParams();
  
  // Use props if provided, otherwise use URL params
  const referralCode = propReferralCode || urlParams.referralCode;
  const amount = propAmount || urlParams.amount;
  const formattedAmount = formatRupiah(amount);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleTrialStart = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CTAClick');
    }
    window.open('https://app.rapatin.id/dashboard/register', '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Gift className="w-6 h-6 text-primary" />
            Selamat! Anda Mendapat Bonus
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              Saldo Gratis {formattedAmount}
            </div>
            <p className="text-muted-foreground">
              untuk uji coba jadwalkan rapat
            </p>
          </div>
          
          <div className="bg-accent/20 rounded-lg p-4 space-y-3">
            <div className="text-center text-sm font-medium text-muted-foreground">
              Gunakan kode referal:
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="bg-background border-2 border-primary rounded-lg px-4 py-2 font-mono text-lg font-bold text-primary">
                {referralCode}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className={cn(
                  "transition-colors",
                  copied && "bg-green-50 border-green-200 text-green-700"
                )}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
            {copied && (
              <div className="text-center text-sm text-green-600 font-medium">
                Kode berhasil disalin!
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleTrialStart}
              className="w-full bg-primary hover:bg-primary/90 text-white"
              size="lg"
            >
              Uji Coba Sekarang
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Masukkan kode referal saat registrasi untuk mendapatkan saldo gratis, kalau tidak suka, tidak akan rugi
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FreeTrialModal;
