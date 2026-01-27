import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, Copy, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderDetails {
  id: string;
  name: string;
  email: string;
  meeting_date: string;
  participant_count: number;
  price: number;
  payment_status: string;
  zoom_link: string | null;
  zoom_passcode: string | null;
  meeting_id: string | null;
  paid_at: string | null;
}

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export default function QuickOrderSuccess() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order ID tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        // Use URL params for GET request
        const response = await fetch(
          `https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1/check-order-status?order_id=${orderId}`,
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcHpuenJpanVveXZqY21rc3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNzU5NDcsImV4cCI6MjA2Mjk1MTk0N30.mIGM28Ztelp6enqg36m03SB7v_Vlsruyd79Rj9mRUuA',
            },
          }
        );

        const result = await response.json();

        if (!response.ok || result.error) {
          setError(result.error || "Gagal mengambil data order");
          setLoading(false);
          return;
        }

        setOrder(result.order);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Terjadi kesalahan saat mengambil data order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    
    // Poll for updates every 5 seconds if payment is pending
    const interval = setInterval(() => {
      if (order?.payment_status === 'pending') {
        fetchOrder();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, order?.payment_status]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin`);
  };

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
              <p className="text-muted-foreground mb-6">
                {error || "Order yang Anda cari tidak ditemukan."}
              </p>
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

  const isPaid = order.payment_status === 'paid';

  return (
    <>
      <Helmet>
        <title>
          {isPaid ? "Pembayaran Berhasil" : "Menunggu Pembayaran"} | Rapatin
        </title>
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="overflow-hidden">
              <div className={`p-6 text-center ${isPaid ? 'bg-green-50 dark:bg-green-950/30' : 'bg-yellow-50 dark:bg-yellow-950/30'}`}>
                {isPaid ? (
                  <>
                    <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                      Pembayaran Berhasil!
                    </h1>
                    <p className="text-green-700 dark:text-green-300">
                      Terima kasih telah menggunakan Rapatin
                    </p>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-16 h-16 text-yellow-600 animate-spin mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                      Menunggu Pembayaran
                    </h1>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      Halaman ini akan update otomatis setelah pembayaran berhasil
                    </p>
                  </>
                )}
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Order Details */}
                <div>
                  <h2 className="font-semibold mb-4">Detail Order</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nama</span>
                      <span className="font-medium">{order.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium">{order.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tanggal Meeting</span>
                      <span className="font-medium">{formatDate(order.meeting_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kapasitas</span>
                      <span className="font-medium">{order.participant_count} Peserta</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base">
                      <span className="font-semibold">Total Bayar</span>
                      <span className="font-bold text-primary">{formatRupiah(order.price)}</span>
                    </div>
                  </div>
                </div>

                {/* Zoom Details (only show if paid and zoom_link exists) */}
                {isPaid && order.zoom_link && (
                  <div className="bg-primary/5 rounded-xl p-4">
                    <h2 className="font-semibold mb-4">Detail Zoom Meeting</h2>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">Link Meeting</span>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-background p-2 rounded text-sm break-all">
                            {order.zoom_link}
                          </code>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyToClipboard(order.zoom_link!, "Link meeting")}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {order.zoom_passcode && (
                        <div>
                          <span className="text-sm text-muted-foreground block mb-1">Passcode</span>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-background p-2 rounded text-sm">
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

                      <Button asChild className="w-full mt-4">
                        <a href={order.zoom_link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Buka Zoom Meeting
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Waiting for Rapatin integration message */}
                {isPaid && !order.zoom_link && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 text-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Link Zoom sedang diproses. Mohon tunggu beberapa saat...
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                      Link akan dikirim ke email dan WhatsApp Anda
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/quick-order">Buat Order Baru</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/">Kembali ke Beranda</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
