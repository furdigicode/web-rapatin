import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

const whatsappUrl = `https://wa.me/+6287788980084?text=${encodeURIComponent("Halo saya ingin daftar ke Rapatin")}`;
const handleRegistration = () => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'CompleteRegistration');
  }
};

const DashboardPreview: React.FC = () => {
  return (
    <section id="dashboard-preview" className="py-20 bg-background w-full">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Preview Dashboard</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Kelola rapat, peserta, dan rekaman secara terpusat, semuanya dari satu dasbor sederhana.
          </p>
          <Button asChild size="lg" className="rounded-lg bg-primary hover:bg-primary/90 text-white">
            <a
              href={whatsappUrl}
              onClick={handleRegistration}
              target="_blank"
              rel="noopener noreferrer"
            >
              Daftar & Coba Demo
              <ArrowRight size={16} className="ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
