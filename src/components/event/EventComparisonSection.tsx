import React, { useState } from 'react';
import SectionContainer from '@/components/layout/SectionContainer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

const EventComparisonSection: React.FC = () => {
  const platforms = [
    { name: 'Lynk.id', fee: '5%', feeNumeric: 5, isRapatin: false },
    { name: 'Mayar.id', fee: '3%', feeNumeric: 3, isRapatin: false },
    { name: 'Utas.co', fee: '5%', feeNumeric: 5, isRapatin: false },
    { name: 'Rapatin', fee: '1,5%', feeNumeric: 1.5, oldFee: '3%', isRapatin: true },
  ];

  const TableView = () => (
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
  );

  const CardsView = () => (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
      {platforms.map((platform) => (
        <Card 
          key={platform.name} 
          className={platform.isRapatin ? 
            'relative border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg shadow-primary/20 ring-2 ring-primary/30 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-2 transition-all duration-300 overflow-hidden' :
            'hover:shadow-md hover:-translate-y-1 transition-all duration-300'
          }
        >
          {platform.isRapatin && (
            <div className="absolute -top-2 -right-2">
              <Badge variant="highlight" className="text-xs font-bold px-2 py-1 animate-pulse rotate-12">
                TERBAIK
              </Badge>
            </div>
          )}
          <CardHeader className="text-center pb-3">
            <CardTitle className={platform.isRapatin ? 'text-primary text-xl font-bold' : 'text-lg'}>
              {platform.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {platform.isRapatin ? (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground line-through">
                  {platform.oldFee}
                </div>
                <div className="text-3xl font-bold text-primary">
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
  );

  const ChartView = () => {
    const chartData = platforms.map(platform => ({
      name: platform.name,
      fee: platform.feeNumeric,
      isRapatin: platform.isRapatin
    }));

    return (
      <div className="max-w-3xl mx-auto px-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="name" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                label={{ value: 'Platform Fee (%)', angle: -90, position: 'insideLeft' }}
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Bar dataKey="fee" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isRapatin ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-4">
          <div className="inline-flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--primary))' }}></div>
              <span>Rapatin (Terbaik)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-muted-foreground"></div>
              <span>Kompetitor</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="table" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="table">Tabel</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table">
            <TableView />
          </TabsContent>
          
          <TabsContent value="cards">
            <CardsView />
          </TabsContent>
          
          <TabsContent value="chart">
            <ChartView />
          </TabsContent>
        </Tabs>
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