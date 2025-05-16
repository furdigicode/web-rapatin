
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ResellerFormHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => navigate('/menjadi-reseller')}
        className="mb-4 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali
      </Button>
      
      <div className="space-y-4 mb-8">
        <div className="inline-flex items-center py-1 px-4 bg-primary/10 rounded-full">
          <span className="text-xs font-medium text-primary">Program Reseller</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Daftar Menjadi Reseller Rapatin</h1>
        <p className="text-lg text-muted-foreground">
          Lengkapi formulir di bawah ini untuk mulai menjadi Reseller Rapatin dan dapatkan
          penghasilan dari penjualan akses meeting Zoom.
        </p>
      </div>
    </>
  );
};

export default ResellerFormHeader;
