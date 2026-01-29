import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format, addDays, addWeeks, addMonths } from "date-fns";
import { id } from "date-fns/locale";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  AlertCircle,
  Clock,
  RefreshCw,
  ArrowRight,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  MessageSquare,
  CreditCard,
  AlertTriangle,
  MessageCircle,
  Repeat,
  BookOpen,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface OrderDetails {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  meeting_date: string;
  meeting_time: string | null;
  meeting_topic: string | null;
  custom_passcode: string | null;
  participant_count: number;
  price: number;
  payment_status: "pending" | "paid" | "expired";
  payment_method: string | null;
  zoom_link: string | null;
  zoom_passcode: string | null;
  meeting_id: string | null;
  xendit_invoice_url: string | null;
  expired_at: string | null;
  paid_at: string | null;
  created_at: string;
  // Recurring fields
  is_recurring: boolean | null;
  recurrence_type: number | null;
  repeat_interval: number | null;
  weekly_days: number[] | null;
  monthly_day: number | null;
  monthly_week: number | null;
  end_type: string | null;
  recurrence_end_date: string | null;
  recurrence_count: number | null;
  total_days: number | null;
}

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatDateForInvitation = (dateStr: string, timeStr: string | null) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);
  const time = timeStr || "00:00";
  return `${formattedDate} ${time} Jakarta`;
};

// Format payment method dari SNAKE_CASE ke Title Case
// Contoh: "MANDIRI_VIRTUAL_ACCOUNT" -> "Mandiri Virtual Account"
const formatPaymentMethod = (method: string): string => {
  return method
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Generate semua tanggal sesi untuk recurring meeting
const generateRecurringDates = (order: OrderDetails): Date[] => {
  if (!order.is_recurring || !order.total_days || order.total_days <= 1) {
    return [new Date(order.meeting_date)];
  }

  const dates: Date[] = [];
  const startDate = new Date(order.meeting_date);
  const totalDays = order.total_days;
  const recurrenceType = order.recurrence_type || 1;
  const repeatInterval = order.repeat_interval || 1;

  if (recurrenceType === 1) {
    // Daily: tambah hari sesuai interval
    for (let i = 0; i < totalDays; i++) {
      const date = addDays(startDate, i * repeatInterval);
      dates.push(date);
    }
  } else if (recurrenceType === 2) {
    // Weekly
    for (let i = 0; i < totalDays; i++) {
      const date = addWeeks(startDate, i * repeatInterval);
      dates.push(date);
    }
  } else if (recurrenceType === 3) {
    // Monthly
    for (let i = 0; i < totalDays; i++) {
      const date = addMonths(startDate, i * repeatInterval);
      dates.push(date);
    }
  }

  return dates;
};

const generateInvitationText = (order: OrderDetails): string => {
  const topic = order.meeting_topic || "Zoom Meeting";

  // Generate time section - multiple dates for recurring
  let timeSection: string;
  if (order.is_recurring && order.total_days && order.total_days > 1) {
    const dates = generateRecurringDates(order);
    const formattedDates = dates.map((date, idx) => {
      const formattedDate = format(date, "MMM dd, yyyy");
      const time = order.meeting_time || "00:00";
      const [hours] = time.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      const timeFormatted = `${hour12.toString().padStart(2, "0")}:${time.split(":")[1]} ${ampm}`;
      return idx === 0
        ? `Time: ${formattedDate} ${timeFormatted} Jakarta`
        : `      ${formattedDate} ${timeFormatted} Jakarta`;
    });
    timeSection = formattedDates.join("\n");
  } else {
    timeSection = `Time: ${formatDateForInvitation(order.meeting_date, order.meeting_time)}`;
  }

  return `${order.name} is inviting you to a scheduled Zoom meeting.

Topic: ${topic}
${timeSection}

Join Zoom Meeting
${order.zoom_link}

Meeting ID: ${order.meeting_id}
Passcode: ${order.zoom_passcode}`;
};

// WhatsApp admin untuk fallback
const ADMIN_WHATSAPP = "6287788980084";

// Helper untuk cek apakah pembuatan meeting kemungkinan gagal (lebih dari 5 menit)
const isZoomCreationLikelyFailed = (paidAt: string): boolean => {
  const paidTime = new Date(paidAt).getTime();
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  return now - paidTime > fiveMinutes;
};

// Generate pesan WhatsApp dengan detail order
const generateWhatsAppMessage = (order: OrderDetails): string => {
  return encodeURIComponent(
    `Halo Admin Rapatin, saya sudah melakukan pembayaran untuk order berikut:\n\n` +
      `Nama: ${order.name}\n` +
      `Email: ${order.email}\n` +
      `Tanggal Meeting: ${order.meeting_date}\n` +
      `Jumlah Peserta: ${order.participant_count}\n` +
      `Total Bayar: Rp${order.price.toLocaleString("id-ID")}\n\n` +
      `Namun link Zoom belum saya terima. Mohon bantuannya. Terima kasih.`,
  );
};

// Masking functions for sensitive data
const maskEmail = (email: string): string => {
  const [username, domain] = email.split("@");
  if (!domain) return email;

  const visibleChars = Math.min(3, username.length);
  const masked = username.slice(0, visibleChars) + "*".repeat(Math.max(username.length - visibleChars, 3));

  return `${masked}@${domain}`;
};

const maskPhone = (phone: string): string => {
  const digitsOnly = phone.replace(/\D/g, "");

  if (digitsOnly.length < 8) return phone;

  const prefix = phone.slice(0, 4);
  const suffix = phone.slice(-4);
  const middleLength = phone.length - 8;

  return `${prefix}${"*".repeat(Math.max(middleLength, 4))}${suffix}`;
};

export default function QuickOrderDetail() {
  const { slug } = useParams<{ slug: string }>();

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [showHostKey, setShowHostKey] = useState(false);

  const fetchOrder = useCallback(
    async (showLoadingState = false) => {
      if (!slug) {
        setError("Order tidak ditemukan");
        setLoading(false);
        return;
      }

      if (showLoadingState) {
        setChecking(true);
      }

      try {
        const response = await fetch(
          `https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1/check-order-status?slug=${slug}`,
          {
            headers: {
              apikey:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcHpuenJpanVveXZqY21rc3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNzU5NDcsImV4cCI6MjA2Mjk1MTk0N30.mIGM28Ztelp6enqg36m03SB7v_Vlsruyd79Rj9mRUuA",
            },
          },
        );

        const result = await response.json();

        if (!response.ok || result.error) {
          setError(result.error || "Gagal mengambil data order");
          setLoading(false);
          setChecking(false);
          return;
        }

        setOrder(result.order);
        setError(null);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Terjadi kesalahan saat mengambil data order");
      } finally {
        setLoading(false);
        setChecking(false);
      }
    },
    [slug],
  );

  // Initial fetch and polling
  useEffect(() => {
    fetchOrder();

    // Only poll if status is pending
    const interval = setInterval(() => {
      if (order?.payment_status === "pending") {
        fetchOrder();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchOrder, order?.payment_status]);

  // Countdown timer
  useEffect(() => {
    if (!order?.expired_at || order.payment_status !== "pending") return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const expiry = new Date(order.expired_at!).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Kadaluarsa");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [order?.expired_at, order?.payment_status]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin`);
  };

  const handleCheckStatus = () => {
    fetchOrder(true);
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat detail order...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <>
        <Helmet>
          <title>Order Tidak Ditemukan | Rapatin</title>
        </Helmet>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h1 className="text-xl font-bold mb-2">Order Tidak Ditemukan</h1>
              <p className="text-muted-foreground mb-6">{error || "Order yang Anda cari tidak ditemukan."}</p>
              <Button asChild>
                <Link to="/quick-order">Buat Order Baru</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  const isPaid = order.payment_status === "paid";
  const isPending = order.payment_status === "pending";
  const isExpired = order.payment_status === "expired" || timeLeft === "Kadaluarsa";

  const getStatusConfig = () => {
    if (isPaid) {
      return {
        icon: CheckCircle2,
        iconColor: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950/30",
        title: "Pembayaran Berhasil!",
        subtitle: "Terima kasih telah menggunakan Rapatin",
        badge: { label: "Lunas", className: "bg-green-500 text-white" },
      };
    }
    if (isExpired) {
      return {
        icon: AlertCircle,
        iconColor: "text-destructive",
        bgColor: "bg-red-50 dark:bg-red-950/30",
        title: "Pembayaran Kadaluarsa",
        subtitle: "Batas waktu pembayaran telah berakhir",
        badge: { label: "Kadaluarsa", className: "bg-red-500 text-white" },
      };
    }
    return {
      icon: Clock,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
      title: "Menunggu Pembayaran",
      subtitle: "Silakan selesaikan pembayaran Anda",
      badge: { label: "Menunggu", className: "bg-yellow-500 text-white" },
    };
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <>
      <Helmet>
        <title>
          {isPaid ? "Pembayaran Berhasil" : isPending ? "Menunggu Pembayaran" : "Pembayaran Kadaluarsa"} | Rapatin
        </title>
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Status Header */}
            <Card className="overflow-hidden">
              <div className={`p-6 text-center ${statusConfig.bgColor}`}>
                <StatusIcon className={`w-16 h-16 ${statusConfig.iconColor} mx-auto mb-4`} />
                <h1 className="text-2xl font-bold mb-2">{statusConfig.title}</h1>
                <p className="text-muted-foreground">{statusConfig.subtitle}</p>
                <Badge className={`mt-3 ${statusConfig.badge.className}`}>{statusConfig.badge.label}</Badge>
              </div>

              {/* Pending: Countdown & Actions */}
              {isPending && !isExpired && (
                <CardContent className="p-6 space-y-4">
                  {timeLeft && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-xl p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Sisa waktu pembayaran</p>
                      <p className="text-3xl font-mono font-bold text-yellow-700 dark:text-yellow-300">{timeLeft}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    {order.xendit_invoice_url && (
                      <Button asChild className="flex-1">
                        <a href={order.xendit_invoice_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Lanjutkan Pembayaran
                        </a>
                      </Button>
                    )}
                    <Button onClick={handleCheckStatus} disabled={checking} variant="outline" className="flex-1">
                      {checking ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Memeriksa...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Cek Status Pembayaran
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    Halaman ini otomatis memperbarui status setiap 10 detik
                  </p>
                </CardContent>
              )}

              {/* Expired: CTA */}
              {isExpired && (
                <CardContent className="p-6">
                  <Button asChild className="w-full">
                    <Link to="/quick-order">
                      Buat Order Baru
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              )}
            </Card>

            {/* Order Details */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="font-semibold text-lg">Detail Order</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nama</p>
                      <p className="font-medium">{order.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{maskEmail(order.email)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">WhatsApp</p>
                      <p className="font-medium">{maskPhone(order.whatsapp)}</p>
                    </div>
                  </div>

                  {order.meeting_topic && (
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Topik Meeting</p>
                        <p className="font-medium">{order.meeting_topic}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {order.is_recurring && order.total_days && order.total_days > 1
                          ? "Jadwal Meeting"
                          : "Tanggal Meeting"}
                      </p>
                      {order.is_recurring && order.total_days && order.total_days > 1 ? (
                        <div className="space-y-1">
                          {generateRecurringDates(order).map((date, idx) => (
                            <p key={idx} className="font-medium">
                              {format(date, "EEEE, d MMMM yyyy", { locale: id })}
                              {order.meeting_time && ` • ${order.meeting_time} WIB`}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="font-medium">
                          {formatDate(order.meeting_date)}
                          {order.meeting_time && ` • ${order.meeting_time} WIB`}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Kapasitas Peserta</p>
                      <p className="font-medium">{order.participant_count} Peserta</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Total Bayar</p>
                      <p className="text-xl font-bold text-primary">{formatRupiah(order.price)}</p>
                      {order.payment_method && (
                        <p className="text-sm text-muted-foreground mt-1">
                          via{" "}
                          <span className="font-medium text-foreground">
                            {formatPaymentMethod(order.payment_method)}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Zoom Details (only for paid orders) */}
            {isPaid && (
              <Card>
                <CardContent className="p-6 space-y-6">
                  <h2 className="font-semibold text-lg">Detail Zoom Meeting</h2>

                  {order.zoom_link ? (
                    <div className="space-y-4">
                      {order.meeting_id && (
                        <div>
                          <span className="text-sm text-muted-foreground block mb-1">Meeting ID</span>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-muted p-3 rounded-lg text-sm font-mono">{order.meeting_id}</code>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => copyToClipboard(order.meeting_id!, "Meeting ID")}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {order.zoom_passcode && (
                        <div>
                          <span className="text-sm text-muted-foreground block mb-1">Passcode</span>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-muted p-3 rounded-lg text-sm font-mono">
                              {order.zoom_passcode}
                            </code>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => copyToClipboard(order.zoom_passcode!, "Passcode")}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">Link Meeting</span>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-muted p-3 rounded-lg text-sm break-all">{order.zoom_link}</code>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => window.open(order.zoom_link!, "_blank")}
                            title="Buka link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyToClipboard(order.zoom_link!, "Link meeting")}
                            title="Salin link"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Host Key */}
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">Host Key</span>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-muted p-3 rounded-lg text-sm font-mono">
                            {showHostKey ? "070707" : "••••••"}
                          </code>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setShowHostKey(!showHostKey)}
                            title={showHostKey ? "Sembunyikan" : "Tampilkan"}
                          >
                            {showHostKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button size="icon" variant="outline" onClick={() => copyToClipboard("070707", "Host Key")}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Invitation Text */}
                      <Separator />
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Invitation</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(generateInvitationText(order), "Invitation")}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <Textarea
                          readOnly
                          value={generateInvitationText(order)}
                          className="min-h-[180px] font-mono text-xs resize-none bg-muted cursor-default"
                        />
                      </div>

                      {/* Panduan Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Panduan Menjadi Host
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Panduan Menjadi Host</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Highlighted Important Notice */}
                              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Penting!</p>
                                    <p className="text-sm text-amber-700 dark:text-amber-300">
                                      Untuk mengaktivasi semua fitur premium di Zoom, Anda harus menjadi host terlebih
                                      dahulu. Ikuti panduan video di bawah ini.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* YouTube Embed */}
                              <div className="aspect-video rounded-lg overflow-hidden">
                                <iframe
                                  src="https://www.youtube.com/embed/8QX78u43_JE"
                                  title="Panduan Menjadi Host Zoom"
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Panduan Lainnya
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Panduan Lainnya</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3">
                              <a
                                href="https://example.com/panduan-1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                              >
                                <BookOpen className="w-5 h-5 text-primary" />
                                <div>
                                  <p className="font-medium">Panduan Mengundang Peserta</p>
                                  <p className="text-sm text-muted-foreground">Cara mengundang peserta ke meeting</p>
                                </div>
                                <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
                              </a>

                              <a
                                href="https://example.com/panduan-2"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                              >
                                <BookOpen className="w-5 h-5 text-primary" />
                                <div>
                                  <p className="font-medium">Panduan Recording</p>
                                  <p className="text-sm text-muted-foreground">Cara merekam meeting Zoom</p>
                                </div>
                                <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
                              </a>

                              <a
                                href="https://example.com/panduan-3"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
                              >
                                <BookOpen className="w-5 h-5 text-primary" />
                                <div>
                                  <p className="font-medium">Panduan Fitur Lainnya</p>
                                  <p className="text-sm text-muted-foreground">Breakout room, polling, dan lainnya</p>
                                </div>
                                <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground" />
                              </a>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ) : order.paid_at && isZoomCreationLikelyFailed(order.paid_at) ? (
                    // Fallback: Gagal membuat meeting setelah 5 menit
                    <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-6 text-center space-y-4">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto">
                        <AlertTriangle className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-orange-800 dark:text-orange-200">
                          Maaf, sistem gagal membuat link Zoom meeting.
                        </p>
                        <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">
                          Silakan hubungi admin kami untuk minta bantuan
                        </p>
                      </div>
                      <Button asChild className="bg-green-600 hover:bg-green-700">
                        <a
                          href={`https://wa.me/${ADMIN_WHATSAPP}?text=${generateWhatsAppMessage(order)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Hubungi Admin via WhatsApp
                        </a>
                      </Button>
                    </div>
                  ) : (
                    // Loading state (masih dalam 5 menit)
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-6 text-center">
                      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
                      <p className="font-medium text-blue-800 dark:text-blue-200">Link Zoom sedang diproses...</p>
                      <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                        Link akan muncul dalam beberapa saat
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Timeline Info (for paid orders) */}
            {isPaid && order.paid_at && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-semibold text-lg mb-4">Riwayat</h2>
                  <div className="relative">
                    {/* Timeline Item 1: Order Dibuat */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-primary rounded-full" />
                        <div className="w-0.5 h-full bg-border min-h-[40px]" />
                      </div>
                      <div className="pb-6">
                        <p className="font-medium text-sm">Order dibuat</p>
                        <p className="text-sm text-muted-foreground">{formatDateTime(order.created_at)}</p>
                      </div>
                    </div>

                    {/* Timeline Item 2: Pembayaran Diterima */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <div className="w-0.5 h-full bg-border min-h-[40px]" />
                      </div>
                      <div className="pb-6">
                        <p className="font-medium text-sm text-green-600">Pembayaran diterima</p>
                        <p className="text-sm text-muted-foreground">{formatDateTime(order.paid_at)}</p>
                      </div>
                    </div>

                    {/* Timeline Item 3: Zoom Meeting Dibuat */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            order.zoom_link
                              ? "bg-green-500"
                              : order.paid_at && isZoomCreationLikelyFailed(order.paid_at)
                                ? "bg-orange-500"
                                : "bg-yellow-500 animate-pulse"
                          }`}
                        />
                      </div>
                      <div>
                        <p
                          className={`font-medium text-sm ${
                            order.zoom_link
                              ? "text-green-600"
                              : order.paid_at && isZoomCreationLikelyFailed(order.paid_at)
                                ? "text-orange-600"
                                : "text-yellow-600"
                          }`}
                        >
                          {order.zoom_link
                            ? "Zoom meeting dibuat"
                            : order.paid_at && isZoomCreationLikelyFailed(order.paid_at)
                              ? "Gagal membuat meeting"
                              : "Membuat Zoom meeting..."}
                        </p>
                        {order.zoom_link && <p className="text-sm text-muted-foreground">Meeting siap digunakan</p>}
                        {!order.zoom_link && order.paid_at && isZoomCreationLikelyFailed(order.paid_at) && (
                          <p className="text-sm text-muted-foreground">Hubungi admin untuk bantuan</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/quick-order">Buat Order Baru</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/">Kembali ke Beranda</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
