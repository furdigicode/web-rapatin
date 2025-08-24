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
        <Badge variant="secondary" className="mb-4">
          Perbandingan Platform
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Bandingkan Biaya Platform Monetisasi
        </h2>
        <p className="text-lg text-muted-foreground">
          Rapatin memberikan biaya platform paling kompetitif dibanding platform monetisasi event lainnya
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
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
                className={platform.isRapatin ? 'bg-primary/5 border-primary/20' : ''}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {platform.name}
                    {platform.isRapatin && (
                      <Badge variant="highlight" className="text-xs">
                        TERBAIK
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {platform.isRapatin ? (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-muted-foreground line-through text-sm">
                        {platform.oldFee}
                      </span>
                      <span className="text-primary font-semibold text-lg">
                        {platform.fee}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      {platform.fee}
                    </span>
                  )}
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