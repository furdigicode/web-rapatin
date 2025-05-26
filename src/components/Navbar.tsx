
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, Home, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const whatsappUrl = `https://wa.me/6287788980084?text=${encodeURIComponent("Halo saya ingin daftar ke Rapatin")}`;

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
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img 
              src="/lovable-uploads/2daea350-0851-4dd8-8f79-ee07aaaad905.png" 
              alt="Rapatin Logo" 
              className="h-8 md:h-10" 
            />
          </a>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors flex items-center">
            Home
          </Link>
          
          {isHomePage ? (
            <>
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Fitur</a>
              <button 
                onClick={() => scrollToSection('cara-kerja')} 
                className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
              >
                Cara Kerja
              </button>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Harga</a>
              <button 
                onClick={() => scrollToSection('testimonials')} 
                className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
              >
                Testimoni
              </button>
            </>
          ) : (
            <>
              <Link to="/#features" className="text-sm font-medium hover:text-primary transition-colors">
                Fitur
              </Link>
              <Link to="/#cara-kerja" className="text-sm font-medium hover:text-primary transition-colors">
                Cara Kerja
              </Link>
              <Link to="/#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Harga
              </Link>
              <Link to="/#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
                Testimoni
              </Link>
            </>
          )}
          
          <a 
            href="https://app.rapatin.id/dashboard/login" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Login
          </a>

          <Button asChild size="sm" className="bg-primary text-white hover:bg-primary/90">
            <a href="https://app.rapatin.id/dashboard/register" onClick={handleRegistration} className="cursor-pointer">Daftar</a>
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
              className="flex items-center text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            <Link 
              to="/appointment" 
              className="block text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Appointment Booking
            </Link>
            
            {isHomePage ? (
              <>
                <button 
                  onClick={() => scrollToSection('cara-kerja')} 
                  className="block w-full text-left text-sm font-medium hover:text-primary transition-colors py-2 cursor-pointer"
                >
                  Cara Kerja
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')} 
                  className="block w-full text-left text-sm font-medium hover:text-primary transition-colors py-2 cursor-pointer"
                >
                  Testimoni
                </button>
                <a 
                  href="#features" 
                  className="block text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Fitur
                </a>
                <a 
                  href="#pricing" 
                  className="block text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Harga
                </a>
              </>
            ) : (
              <>
                <Link 
                  to="/#features" 
                  className="block text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Fitur
                </Link>
                <Link 
                  to="/#cara-kerja" 
                  className="block text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Cara Kerja
                </Link>
                <Link 
                  to="/#pricing" 
                  className="block text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Harga
                </Link>
                <Link 
                  to="/#testimonials" 
                  className="block text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Testimoni
                </Link>
              </>
            )}
            
            <div className="flex flex-col space-y-3 pt-2">
              <Button asChild variant="outline" size="sm">
                <a href="https://app.rapatin.id/dashboard/login" className="cursor-pointer">Masuk</a>
              </Button>
              <Button asChild size="sm" className="bg-primary text-white hover:bg-primary/90">
                <a href="https://app.rapatin.id/dashboard/register" onClick={handleRegistration} className="cursor-pointer">Daftar</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
