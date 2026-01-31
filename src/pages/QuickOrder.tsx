import { Helmet } from "react-helmet-async";
import { Video, Clock, Shield, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { QuickOrderForm } from "@/components/quick-order/QuickOrderForm";

const features = [
  {
    icon: Zap,
    title: "Tanpa Registrasi",
    description: "Langsung order, tanpa perlu daftar akun",
  },
  {
    icon: Clock,
    title: "1 Hari Full",
    description: "Durasi meeting seharian penuh",
  },
  {
    icon: Video,
    title: "Zoom Premium",
    description: "Fitur lengkap termasuk rekaman cloud",
  },
  {
    icon: Shield,
    title: "Pembayaran Aman",
    description: "QRIS, VA, & E-Wallet tersedia",
  },
];

export default function QuickOrder() {
  return (
    <>
      <Helmet>
        <title>Quick Order - Sewa Zoom Meeting Sekali Pakai | Rapatin</title>
        <meta
          name="description"
          content="Sewa Zoom meeting sekali pakai tanpa perlu daftar. Bayar langsung, terima link Zoom instan. Mulai dari Rp 10.000 untuk 100 peserta."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://rapatin.id/quick-order" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section */}
        <section className="pt-24 pb-8 md:pt-32 md:pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                Quick Order
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Zoom Meeting <span className="text-primary">Sekali Pakai</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Butuh meeting cepat? Langsung order tanpa perlu daftar akun. Bayar, dan terima link Zoom dalam hitungan
                menit.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col items-center text-center p-4 rounded-xl bg-card border"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="pb-16 md:pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-lg">
                <QuickOrderForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
