
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResellerFormHeader from './components/ResellerFormHeader';
import ResellerForm from './components/ResellerForm';

const DaftarReseller: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-16">
        <div className="container max-w-3xl mx-auto px-4 md:px-6">
          <ResellerFormHeader />
          <ResellerForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DaftarReseller;
