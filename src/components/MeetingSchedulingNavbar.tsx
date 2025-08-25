import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import FreeTrialModal from '@/components/ui/free-trial-modal';

interface MeetingSchedulingNavbarProps {
  directRegister?: boolean;
  registerUrl?: string;
}

const MeetingSchedulingNavbar: React.FC<MeetingSchedulingNavbarProps> = ({ 
  directRegister = false, 
  registerUrl = "https://app.rapatin.id/dashboard/register" 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const handleRegistration = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CTAClick');
    }
    
    if (directRegister) {
      window.open(registerUrl, '_blank', 'noopener,noreferrer');
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/2daea350-0851-4dd8-8f79-ee07aaaad905.png" 
                alt="Rapatin Logo" 
                className="h-8 md:h-10" 
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
            >
              Fitur
            </button>
            
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
            >
              Cara Kerja
            </button>
            
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
            >
              Harga
            </button>
            
            <button 
              onClick={() => scrollToSection('testimonials')} 
              className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
            >
              Testimoni
            </button>
            
            <a 
              href="https://app.rapatin.id/dashboard/login" 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Login
            </a>

            <Button size="sm" className="bg-primary text-white hover:bg-primary/90" onClick={handleRegistration}>
              Daftar
            </Button>
          </nav>
          
          <button 
            className="md:hidden text-foreground cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden glass animate-fade-in">
            <div className="py-4 px-6 space-y-4">
              <Link 
                to="/" 
                className="block text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              <button 
                onClick={() => scrollToSection('features')} 
                className="block w-full text-left text-sm font-medium hover:text-primary transition-colors py-2 cursor-pointer"
              >
                Fitur
              </button>
              
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="block w-full text-left text-sm font-medium hover:text-primary transition-colors py-2 cursor-pointer"
              >
                Cara Kerja
              </button>
              
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="block w-full text-left text-sm font-medium hover:text-primary transition-colors py-2 cursor-pointer"
              >
                Harga
              </button>
              
              <button 
                onClick={() => scrollToSection('testimonials')} 
                className="block w-full text-left text-sm font-medium hover:text-primary transition-colors py-2 cursor-pointer"
              >
                Testimoni
              </button>
              
              <div className="flex flex-col space-y-3 pt-2">
                <Button asChild variant="outline" size="sm">
                  <a href="https://app.rapatin.id/dashboard/login" className="cursor-pointer">Login</a>
                </Button>
                <Button size="sm" className="bg-primary text-white hover:bg-primary/90" onClick={() => { setIsMobileMenuOpen(false); handleRegistration(); }}>
                  Daftar
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {!directRegister && (
        <FreeTrialModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default MeetingSchedulingNavbar;
