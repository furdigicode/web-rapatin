import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Clock, RefreshCw, Loader2, AlertCircle, ArrowRight } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface OrderDetails {
  id: string;
  payment_status: string;
  expired_at: string | null;
}

export default function QuickOrderPending() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const orderId = searchParams.get('order_id');

  const checkOrderStatus = async () => {
    if (!orderId) return;

    setChecking(true);
    try {
      const response = await fetch(
        `https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1/check-order-status?order_id=${orderId}`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcHpuenJpanVveXZqY21rc3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNzU5NDcsImV4cCI6MjA2Mjk1MTk0N30.mIGM28Ztelp6enqg36m03SB7v_Vlsruyd79Rj9mRUuA',
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.order) {
        setOrder(result.order);
        
        // Redirect to success page if paid
        if (result.order.payment_status === 'paid') {
          navigate(`/quick-order/success?order_id=${orderId}`);
        }
      }
    } catch (err) {
      console.error("Error checking order:", err);
    } finally {
      setChecking(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkOrderStatus();

    // Auto-check every 10 seconds
    const interval = setInterval(checkOrderStatus, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  // Countdown timer
  useEffect(() => {
    if (!order?.expired_at) return;

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
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [order?.expired_at]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat status pembayaran...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isExpired = order?.payment_status === 'expired' || timeLeft === "Kadaluarsa";

  return (
    <>
      <Helmet>
        <title>Menunggu Pembayaran | Rapatin</title>
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <Card>
              <CardContent className="pt-6 text-center space-y-6">
                {isExpired ? (
                  <>
                    <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
                    <div>
                      <h1 className="text-2xl font-bold mb-2">Pembayaran Kadaluarsa</h1>
                      <p className="text-muted-foreground">
                        Batas waktu pembayaran telah berakhir. Silakan buat order baru.
                      </p>
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/quick-order">
                        Buat Order Baru
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Clock className="w-16 h-16 text-yellow-600 mx-auto" />
                    <div>
                      <h1 className="text-2xl font-bold mb-2">Menunggu Pembayaran</h1>
                      <p className="text-muted-foreground">
                        Silakan selesaikan pembayaran Anda
                      </p>
                    </div>

                    {timeLeft && (
                      <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-xl p-4">
                        <p className="text-sm text-muted-foreground mb-1">Sisa waktu pembayaran</p>
                        <p className="text-3xl font-mono font-bold text-yellow-700 dark:text-yellow-300">
                          {timeLeft}
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={checkOrderStatus}
                      disabled={checking}
                      variant="outline"
                      className="w-full"
                    >
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

                    <p className="text-xs text-muted-foreground">
                      Halaman ini otomatis memperbarui status setiap 10 detik
                    </p>

                    <div className="pt-4 border-t">
                      <Button asChild variant="ghost" className="w-full">
                        <Link to="/quick-order">Buat Order Baru</Link>
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
