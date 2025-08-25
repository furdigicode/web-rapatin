import React from 'react';
import SectionContainer from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';

const EventComparisonSection: React.FC = () => {
  const platforms = [
    { name: 'Lynk.id', fee: '5%', isRapatin: false },
    { name: 'Mayar.id', fee: '3%', isRapatin: false },
    { name: 'Utas.co', fee: '5%', isRapatin: false },
    { name: 'Rapatin', fee: '1,5%', oldFee: '3%', isRapatin: true },
  ];

  return (
    <SectionContainer background="accent">
      <div className="text-center max-w-4xl mx-auto mb-12">
        <div className="inline-flex items-center py-1 px-4 bg-accent rounded-full mb-4">
            <span className="text-xs font-medium text-primary">Perbandingan Platform</span>
          </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Bandingkan Biaya Platform Monetisasi
        </h2>
        <p className="text-lg text-muted-foreground">
          Rapatin memberikan biaya platform paling kompetitif dibanding platform monetisasi event lainnya
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <Table>
          <TableCaption className="sr-only">
            Perbandingan biaya platform monetisasi event antara Rapatin dengan kompetitor
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left font-semibold">Platform</TableHead>
              <TableHead className="text-right font-semibold">Platform Fee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {platforms.map((platform) => (
              <TableRow 
                key={platform.name}
                className={platform.isRapatin ? 'border-0 hover:bg-transparent' : 'hover:bg-muted/50 transition-colors'}
              >
                <TableCell className="font-medium p-0">
                  <div className={platform.isRapatin ? 
                    'bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/40 shadow-lg shadow-primary/20 ring-2 ring-primary/30 rounded-l-2xl hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 relative z-10 p-6' :
                    'p-4'
                  }>
                    <div className="flex items-center gap-3">
                      <span className={platform.isRapatin ? 'text-xl font-bold text-primary' : ''}>
                        {platform.name}
                      </span>
                      {platform.isRapatin && (
                        <Badge variant="highlight" className="text-sm font-bold px-3 py-1 animate-pulse">
                          TERBAIK
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right p-0">
                  <div className={platform.isRapatin ? 
                    'bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/40 shadow-lg shadow-primary/20 ring-2 ring-primary/30 rounded-r-2xl hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 relative z-10 p-6 border-l-0' :
                    'p-4'
                  }>
                    {platform.isRapatin ? (
                      <div className="flex items-center justify-end gap-3">
                        <span className="text-muted-foreground line-through text-base">
                          {platform.oldFee}
                        </span>
                        <span className="text-primary font-bold text-2xl">
                          {platform.fee}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-lg">
                        {platform.fee}
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          * Biaya platform dihitung dari total penjualan tiket yang berhasil
        </p>
      </div>
    </SectionContainer>
  );
};

export default EventComparisonSection;