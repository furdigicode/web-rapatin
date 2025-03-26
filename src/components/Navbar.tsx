
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Fitur</a>
          <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Harga</a>
          <a href="#dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</a>
          <Button asChild size="sm" variant="outline" className="ml-2">
            <a href="https://rapatin.id/login">Masuk</a>
          </Button>
          <Button asChild size="sm" className="bg-primary text-white hover:bg-primary/90">
            <a href="https://rapatin.id/register">Daftar</a>
          </Button>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass animate-fade-in">
          <div className="py-4 px-6 space-y-4">
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
            <a 
              href="#dashboard" 
              className="block text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </a>
            <div className="flex flex-col space-y-3 pt-2">
              <Button asChild variant="outline" size="sm">
                <a href="https://rapatin.id/login">Masuk</a>
              </Button>
              <Button asChild size="sm" className="bg-primary text-white hover:bg-primary/90">
                <a href="https://rapatin.id/register">Daftar</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
