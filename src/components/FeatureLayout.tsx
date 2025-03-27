
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LucideIcon } from 'lucide-react';

interface FeatureLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const FeatureLayout: React.FC<FeatureLayoutProps> = ({ title, description, icon: Icon, children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
              <Icon size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
            <p className="text-lg text-muted-foreground">{description}</p>
          </div>
          
          {/* Content */}
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FeatureLayout;
