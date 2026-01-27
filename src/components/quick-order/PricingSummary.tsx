import { CalendarDays, Users, Receipt, Shield, Clock, MessageSquare, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface MeetingSettings {
  is_meeting_registration?: boolean;
  is_meeting_qna?: boolean;
  is_language_interpretation?: boolean;
  is_mute_upon_entry?: boolean;
  is_req_unmute_permission?: boolean;
}

interface PricingSummaryProps {
  participantCount: number | null;
  meetingDate: Date | undefined;
  meetingTime?: string;
  price: number;
  meetingTopic?: string;
  customPasscode?: string;
  meetingSettings?: MeetingSettings;
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

const FEATURE_LABELS: Record<keyof MeetingSettings, string> = {
  is_meeting_registration: "Registrasi Peserta",
  is_meeting_qna: "Fitur Q&A",
  is_language_interpretation: "Interpretasi Bahasa",
  is_mute_upon_entry: "Mute Saat Masuk",
  is_req_unmute_permission: "Minta Izin Unmute",
};

export function PricingSummary({ 
  participantCount, 
  meetingDate, 
  meetingTime, 
  price,
  meetingTopic,
  customPasscode,
  meetingSettings,
}: PricingSummaryProps) {
  const activeFeatures = meetingSettings 
    ? (Object.entries(meetingSettings) as [keyof MeetingSettings, boolean][])
        .filter(([_, value]) => value)
        .map(([key]) => FEATURE_LABELS[key])
    : [];

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          Ringkasan Order
        </h3>
        
        <div className="space-y-3">
          {meetingTopic && (
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-muted-foreground flex-shrink-0">
                <MessageSquare className="w-4 h-4" />
                <span>Topik</span>
              </div>
              <span className="font-medium text-right line-clamp-2">
                {meetingTopic}
              </span>
            </div>
          )}

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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Jam Mulai</span>
            </div>
            <span className="font-medium">
              {meetingTime || '-'}
            </span>
          </div>

          {customPasscode && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Passcode</span>
              <span className="font-mono font-medium">{customPasscode}</span>
            </div>
          )}
          
          <Separator className="my-3" />
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Durasi</span>
            <span className="font-medium">24 Jam (Full Day)</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Platform</span>
            <span className="font-medium">Zoom Meeting</span>
          </div>

          {activeFeatures.length > 0 && (
            <>
              <Separator className="my-3" />
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Fitur Aktif:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeFeatures.map((feature) => (
                    <Badge 
                      key={feature} 
                      variant="secondary" 
                      className="text-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
          
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
