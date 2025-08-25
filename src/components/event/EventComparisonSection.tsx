import React from 'react';
import SectionContainer from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

const EventComparisonSection: React.FC = () => {
  const platforms = [
    { name: 'Lynk.id', fee: '5%', feeNumeric: 5, isRapatin: false },
    { name: 'Mayar.id', fee: '3%', feeNumeric: 3, isRapatin: false },
    { name: 'Utas.co', fee: '5%', feeNumeric: 5, isRapatin: false },
    { name: 'Rapatin', fee: '1,5%', feeNumeric: 1.5, oldFee: '3%', isRapatin: true },
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

      {/* Grid Cards Layout */}
      <div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
        role="list"
        aria-label="Perbandingan biaya platform"
      >
        {platforms.map((platform) => (
          <Card 
            key={platform.name} 
            className={`transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/30 ${
              platform.isRapatin ? 
              'relative rounded-2xl border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5 ring-2 ring-primary/20 shadow-lg hover:shadow-primary/30 hover:-translate-y-1' :
              'rounded-2xl border bg-background shadow-sm hover:shadow-md hover:-translate-y-1'
            }`}
            tabIndex={0}
            role="listitem"
          >
            {platform.isRapatin && (
              <Badge 
                variant="highlight" 
                className="absolute top-2 right-2 md:top-3 md:right-3 z-20 flex items-center gap-1 px-2.5 py-0.5 text-[10px] md:text-xs rounded-full shadow pointer-events-none"
                aria-label="Terbaik"
              >
                <Star size={12} aria-hidden="true" />
                TERBAIK
              </Badge>
            )}
            <CardHeader className="text-center pb-3">
              <CardTitle className={`${
                platform.isRapatin ? 'text-primary font-bold' : 'text-lg'
              }`}>
                {platform.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {platform.isRapatin ? (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground line-through">
                    {platform.oldFee}
                  </div>
                  <div className="text-3xl md:text-4xl font-extrabold text-primary">
                    {platform.fee}
                  </div>
                </div>
              ) : (
                <div className="text-2xl font-semibold text-muted-foreground">
                  {platform.fee}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
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