import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import pseBadge from '@/assets/pse-badge.png.asset.json';
import pseCertificate from '@/assets/pse-rapatin.pdf.asset.json';

const PseBadge: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Lihat sertifikat tanda daftar PSE Rapatin"
        className="block w-full max-w-[220px] rounded-md overflow-hidden transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <img
          src={pseBadge.url}
          alt="Rapatin terdaftar PSE Lingkup Privat Kementerian Komunikasi dan Digital RI"
          className="w-full h-auto"
          loading="lazy"
        />
      </button>
      <p className="mt-3 text-xs text-muted-foreground">
        Rapatin terdaftar sebagai Penyelenggara Sistem Elektronik (PSE) Lingkup Privat pada
        Kementerian Komunikasi dan Digital RI — No. 028726.01/DJAI.PSE/07/2026.
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Tanda Daftar PSE Rapatin</DialogTitle>
            <DialogDescription>
              Sertifikat Penyelenggara Sistem Elektronik Lingkup Privat No.
              028726.01/DJAI.PSE/07/2026.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-auto rounded-md border border-border bg-muted">
            <object
              data={pseCertificate.url}
              type="application/pdf"
              className="w-full h-full min-h-[60vh]"
              aria-label="Dokumen tanda daftar PSE Rapatin"
            >
              <div className="p-6 text-sm text-muted-foreground">
                Pratinjau dokumen tidak dapat ditampilkan di perangkat ini.
              </div>
            </object>
          </div>

          <a
            href={pseCertificate.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            Buka atau unduh PDF <ExternalLink size={14} />
          </a>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PseBadge;
