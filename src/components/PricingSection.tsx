
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

interface PricingPlanProps {
  participants: string;
  price: string;
  isPrimary?: boolean;
  delay: string;
}

const PricingPlan: React.FC<PricingPlanProps> = ({ participants, price, isPrimary = false, delay }) => {
  const features = [
    "Rekaman Cloud (akses 72 jam)",
    "Durasi rapat tak terbatas",
    "Akses untuk seluruh hari (00.00 - 23.59)",
    "Berbagi layar",
    "AI Companion",
    "Polling, Tanya Jawab, Survei",
    "Sistem pendaftaran",
    "Live streaming ke YouTube",
    "Tetapkan hingga 99 Co-Host"
  ];

  return (
    <div 
      className={`rounded-xl p-1 animate-fade-in ${delay} ${
        isPrimary ? "bg-gradient-to-br from-primary/80 to-primary" : "bg-white"
      }`}
    >
      <div 
        className={`h-full rounded-lg p-6 ${
          isPrimary ? "bg-card shadow-elevation" : "glass"
        }`}
      >
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{participants}</h3>
          <div className="flex items-end mb-2">
            <span className="text-3xl font-bold">{price}</span>
            <span className="text-muted-foreground ml-1 text-sm">/rapat</span>
          </div>
          <p className="text-sm text-muted-foreground">Pembayaran sekali per rapat terjadwal</p>
        </div>
        
        <div className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check 
                size={18} 
                className={`mr-2 mt-0.5 ${
                  isPrimary ? "text-primary" : "text-primary/80"
                }`} 
              />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
        
        <Button 
          asChild
          className={`w-full rounded-lg ${
            isPrimary 
              ? "bg-primary hover:bg-primary/90 text-white" 
              : "bg-white hover:bg-white/90 text-primary border border-primary/20"
          }`}
        >
          <a href="https://rapatin.id/register">Beli & Jadwalkan Sekarang</a>
        </Button>
      </div>
    </div>
  );
};

const PricingSection: React.FC = () => {
  const plans = [
    { participants: "100 Peserta", price: "Rp 20.000", isPrimary: false, delay: "delay-0" },
    { participants: "300 Peserta", price: "Rp 35.000", isPrimary: true, delay: "delay-100" },
    { participants: "500 Peserta", price: "Rp 60.000", isPrimary: false, delay: "delay-200" },
    { participants: "1000 Peserta", price: "Rp 100.000", isPrimary: false, delay: "delay-300" }
  ];
  
  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center py-1 px-4 bg-accent rounded-full mb-4">
            <span className="text-xs font-medium text-primary">Harga Transparan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Harga Bayar-Per-Rapat
          </h2>
          <p className="text-muted-foreground text-lg">
            Tanpa langganan, tanpa komitmen. Hanya bayar untuk rapat yang Anda jadwalkan, berdasarkan jumlah peserta.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <PricingPlan
              key={index}
              participants={plan.participants}
              price={plan.price}
              isPrimary={plan.isPrimary}
              delay={plan.delay}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center max-w-3xl mx-auto animate-fade-in delay-400">
          <p className="text-muted-foreground mb-6">
            Semua harga sudah termasuk pajak dan biaya. Saldo akun Anda dikurangi hanya ketika Anda menjadwalkan rapat.
          </p>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <a href="#features">Lihat Semua Fitur</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
