
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { Card } from "@/components/ui/card";

const PricingSection: React.FC = () => {
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
  
  const plans = [
    { participants: "100 Peserta", price: "Rp 20.000" },
    { participants: "300 Peserta", price: "Rp 35.000" },
    { participants: "500 Peserta", price: "Rp 60.000" },
    { participants: "1000 Peserta", price: "Rp 100.000" }
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
        
        <Card className="max-w-4xl mx-auto p-8 animate-fade-in shadow-elevation">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">
                Semua Fitur Premium
              </h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check 
                      size={18} 
                      className="mr-2 mt-0.5 text-primary" 
                    />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6">
                Pilihan Harga
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {plans.map((plan, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border ${
                      index === 1 ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <p className="font-medium text-sm mb-1">{plan.participants}</p>
                    <p className="text-xl font-bold mb-1">{plan.price}</p>
                    <p className="text-xs text-muted-foreground mb-4">/rapat</p>
                    
                    <Button 
                      asChild
                      className={`w-full rounded-lg ${
                        index === 1 
                          ? "bg-primary hover:bg-primary/90 text-white" 
                          : "bg-white hover:bg-white/90 text-primary border border-primary/20"
                      }`}
                      size="sm"
                    >
                      <a href="https://rapatin.id/register">Beli & Jadwalkan Sekarang</a>
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button 
                  asChild
                  className="w-full rounded-lg bg-primary hover:bg-primary/90 text-white"
                >
                  <a href="https://rapatin.id/register">Jadwalkan Rapat Sekarang</a>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default PricingSection;
