
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle } from 'lucide-react';
import ResellerFormHeader from './components/ResellerFormHeader';
import ResellerForm from './components/ResellerForm';

const DaftarReseller: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  // Check overall connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('https://kiqogsuvqveqzoqjciad.supabase.co/rest/v1/health', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          console.log('Connection health check passed');
          setIsConnected(true);
        } else {
          console.error('Connection health check failed', response);
          setIsConnected(false);
          setErrorDetails(`Status: ${response.status} (${response.statusText})`);
          setShowErrorDialog(true);
        }
      } catch (error) {
        console.error('Failed to perform connection health check', error);
        setIsConnected(false);
        setErrorDetails(error instanceof Error ? error.message : String(error));
        setShowErrorDialog(true);
      }
    };
    
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-16">
        <div className="container max-w-3xl mx-auto px-4 md:px-6">
          <ResellerFormHeader />
          
          {isConnected === false ? (
            <div className="bg-white rounded-xl border border-red-200 shadow-sm p-6 md:p-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-red-700 mb-2">
                    Koneksi ke Server Gagal
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Kami tidak dapat terhubung ke server data kami. Hal ini bisa disebabkan oleh:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mb-4 text-gray-700">
                    <li>Koneksi internet Anda terputus atau tidak stabil</li>
                    <li>Adanya firewall atau pengaturan keamanan yang membatasi koneksi</li>
                    <li>Server kami sedang dalam pemeliharaan</li>
                  </ul>
                  <Button onClick={() => window.location.reload()}>
                    Coba Lagi
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <ResellerForm />
          )}
        </div>
      </main>
      
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terjadi Masalah Koneksi</DialogTitle>
            <DialogDescription>
              <p className="mb-4">Tidak dapat terhubung ke database. Beberapa kemungkinan penyebabnya:</p>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Koneksi internet terputus</li>
                <li>Ada firewall yang memblokir koneksi</li> 
                <li>Server sedang mengalami gangguan</li>
              </ul>
              {errorDetails && (
                <div className="bg-gray-100 p-3 rounded text-sm mb-4">
                  <strong>Detail error:</strong> {errorDetails}
                </div>
              )}
              <Button onClick={() => window.location.reload()} className="w-full">
                Muat Ulang Halaman
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default DaftarReseller;
