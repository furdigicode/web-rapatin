import { CalendarDays, Users, Receipt, Shield, Clock, MessageSquare, CheckCircle2, Repeat } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
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
  totalPrice?: number;
  meetingTopic?: string;
  customPasscode?: string;
  meetingSettings?: MeetingSettings;
  isRecurring?: boolean;
  totalDays?: number;
  recurringDates?: Date[];
}

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatShortDate = (date: Date) => {
  return format(date, "d MMM yyyy", { locale: id });
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
  totalPrice,
  meetingTopic,
  customPasscode,
  meetingSettings,
  isRecurring = false,
  totalDays = 1,
  recurringDates = [],
}: PricingSummaryProps) {
  const activeFeatures = meetingSettings
    ? (Object.entries(meetingSettings) as [keyof MeetingSettings, boolean][])
        .filter(([_, value]) => value)
        .map(([key]) => FEATURE_LABELS[key])
    : [];

  // Use totalPrice if provided, otherwise calculate from price
  const finalPrice = totalPrice ?? price * totalDays;

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
              <span className="font-medium text-right line-clamp-2">{meetingTopic}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Kapasitas</span>
            </div>
            <span className="font-medium">{participantCount ? `${participantCount} Peserta` : "-"}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="w-4 h-4" />
              <span>{isRecurring ? "Tanggal Mulai" : "Tanggal"}</span>
            </div>
            <span className="font-medium text-right">{meetingDate ? formatDate(meetingDate) : "-"}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Jam Mulai</span>
            </div>
            <span className="font-medium">{meetingTime || "-"}</span>
          </div>

          {customPasscode && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Passcode</span>
              <span className="font-mono font-medium">{customPasscode}</span>
            </div>
          )}

          <Separator className="my-3" />

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Durasi per Tanggal</span>
            <span className="font-medium">24 Jam (Full Day)</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Platform</span>
            <span className="font-medium">Zoom Meeting</span>
          </div>

          {/* Recurring Info */}
          {isRecurring && totalDays > 1 && (
            <>
              <Separator className="my-3" />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Repeat className="w-4 h-4" />
                    <span>Meeting Berulang</span>
                  </div>
                  <Badge variant="secondary">{totalDays} tanggal</Badge>
                </div>

                {/* Show first few dates */}
                {recurringDates.length > 0 && (
                  <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                    <span className="text-xs text-muted-foreground">Jadwal meeting:</span>
                    <ul className="text-sm space-y-0.5">
                      {recurringDates.slice(0, 5).map((date, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-4 text-xs text-muted-foreground">{index + 1}.</span>
                          <span>{formatShortDate(date)}</span>
                        </li>
                      ))}
                      {recurringDates.length > 5 && (
                        <li className="text-xs text-muted-foreground pl-6">
                          +{recurringDates.length - 5} jadwal lainnya
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}

          {activeFeatures.length > 0 && (
            <>
              <Separator className="my-3" />
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Fitur Aktif:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeFeatures.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator className="my-3" />

          {/* Price Breakdown for Recurring */}
          {isRecurring && totalDays > 1 && (
            <div className="space-y-2 bg-muted/30 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Harga per tanggal</span>
                <span>{price > 0 ? formatRupiah(price) : "-"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Jumlah tanggal</span>
                <span>×{totalDays}</span>
              </div>
              <Separator className="my-2" />
            </div>
          )}

          {/* Biaya Payment Gateway - Gratis */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Biaya Payment Gateway</span>
            <span className="font-medium text-green-600">GRATIS</span>
          </div>

          <div className="flex items-center justify-between text-lg">
            <span className="font-semibold">Total Bayar</span>
            <span className="font-bold text-primary">{finalPrice > 0 ? formatRupiah(finalPrice) : "-"}</span>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 p-3 bg-background/50 rounded-lg">
          <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Pembayaran aman dan terenkripsi. Link Zoom juga akan dikirim ke email dan WhatsApp (opsional) setelah
            pembayaran berhasil.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
