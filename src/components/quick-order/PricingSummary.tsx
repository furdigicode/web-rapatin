import { CalendarDays, Users, Receipt, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PricingSummaryProps {
  participantCount: number | null;
  meetingDate: Date | undefined;
  price: number;
}

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export function PricingSummary({ participantCount, meetingDate, price }: PricingSummaryProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          Ringkasan Order
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Kapasitas</span>
            </div>
            <span className="font-medium">
              {participantCount ? `${participantCount} Peserta` : '-'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="w-4 h-4" />
              <span>Tanggal</span>
            </div>
            <span className="font-medium text-right">
              {meetingDate ? formatDate(meetingDate) : '-'}
            </span>
          </div>
          
          <Separator className="my-3" />
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Durasi</span>
            <span className="font-medium">24 Jam (Full Day)</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Platform</span>
            <span className="font-medium">Zoom Meeting</span>
          </div>
          
          <Separator className="my-3" />
          
          <div className="flex items-center justify-between text-lg">
            <span className="font-semibold">Total Bayar</span>
            <span className="font-bold text-primary">
              {price > 0 ? formatRupiah(price) : '-'}
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex items-start gap-2 p-3 bg-background/50 rounded-lg">
          <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Pembayaran aman dan terenkripsi. Link Zoom akan dikirim ke email dan WhatsApp setelah pembayaran berhasil.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
