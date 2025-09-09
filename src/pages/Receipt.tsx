import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Check } from 'lucide-react';
import { formatRupiah } from '@/utils/formatRupiah';
import { toast } from 'sonner';
import rapatinLogo from '@/assets/rapatin-logo.png';

const Receipt = () => {
  const location = useLocation();
  const [copied, setCopied] = React.useState(false);
  
  // Parse URL parameters
  const params = new URLSearchParams(location.search);
  const txId = params.get('tx') || '';
  const user = params.get('user') || '';
  const email = params.get('email') || '';
  const meetingId = params.get('meeting_id') || '';
  const topic = params.get('topic') || '';
  const capacity = params.get('capacity') || '';
  const amount = parseInt(params.get('amount') || '0');
  const before = parseInt(params.get('before') || '0');
  const after = parseInt(params.get('after') || '0');
  
  // Generate current date
  const currentDate = new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Link berhasil disalin!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Gagal menyalin link');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Action Buttons - Hidden when printing */}
      <div className="fixed top-4 right-4 flex gap-2 print:hidden z-10">
        <Button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2"
          size="sm"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        <Button
          onClick={handleCopyLink}
          variant="outline"
          className="flex items-center gap-2"
          size="sm"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Tersalin!' : 'Salin Link'}
        </Button>
      </div>

      {/* Receipt Content */}
      <div className="max-w-2xl mx-auto p-8 print:p-4 print:max-w-none">
        <Card className="shadow-lg print:shadow-none print:border-none">
          <CardContent className="p-8 print:p-6">
            {/* Header */}
            <div className="text-center mb-8 print:mb-6">
              <div className="flex justify-center mb-4">
                <img 
                  src="/lovable-uploads/eacac0dc-069c-493d-9628-07767c87079e.png" 
                  alt="Rapatin Logo" 
                  className="h-12 print:h-10"
                />
              </div>
              <p className="text-muted-foreground text-lg print:text-base">
                Kwitansi Penggunaan Saldo
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Tanggal: {currentDate}
                </p>
              </div>
            </div>

            {/* Transaction Summary */}
            <div className="bg-primary/5 p-6 rounded-lg mb-6 print:bg-gray-50 print:p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">ID Transaksi</p>
                  <p className="font-semibold text-lg text-primary">{txId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Jumlah</p>
                  <p className="font-semibold text-lg text-primary">
                    {formatRupiah(amount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold border-b border-border pb-2 print:text-lg">
                Detail Transaksi
              </h3>
              
              <div className="grid gap-4">
                <div className="grid grid-cols-3 gap-4 py-3 border-b border-border/50">
                  <div>
                    <p className="text-sm text-muted-foreground">Pengguna</p>
                    <p className="font-medium">{user}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Meeting ID</p>
                    <p className="font-medium">{meetingId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-3 border-b border-border/50">
                  <div>
                    <p className="text-sm text-muted-foreground">Meeting ID</p>
                    <p className="font-medium">{meetingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kapasitas Meeting</p>
                    <p className="font-medium">{capacity} orang</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Topik Meeting</p>
                    <p className="font-medium">{topic}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-3 border-b border-border/50">
                  <div>
                    <p className="text-sm text-muted-foreground">Saldo Sebelum</p>
                    <p className="font-medium">{formatRupiah(before)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Penggunaan</p>
                    <p className="font-medium text-destructive">
                      -{formatRupiah(amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Saldo Sesudah</p>
                    <p className="font-medium">{formatRupiah(after)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-border text-center print:mt-6 print:pt-4">
              <p className="text-xs text-muted-foreground">
                Kwitansi ini dibuat secara otomatis oleh sistem RAPATIN.ID
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Untuk pertanyaan lebih lanjut, hubungi admin@rapatin.id
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Receipt;