import React from 'react';
import { Button } from "@/components/ui/button";
import { DollarSign, Shield, BarChart as ChartBar, Users, Headphones, ArrowRight, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const MenjadiReseller = () => {
  // Track registration click with Facebook Pixel
  const handleRegistration = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', {
        content_name: 'reseller_program'
      });
    }
  };
  const benefits = [{
    icon: <DollarSign className="h-6 w-6" />,
    title: "Harga Khusus",
    description: "Dapatkan harga khusus reseller (75% lebih murah dari harga publik) dan bebas menentukan harga jual sendiri."
  }, {
    icon: <Shield className="h-6 w-6" />,
    title: "Tanpa Komitmen Bulanan",
    description: "Tidak perlu langganan, tanpa biaya tetap. Hanya bayar saat top-up saldo reseller."
  }, {
    icon: <ChartBar className="h-6 w-6" />,
    title: "Akses Dashboard Real-Time",
    description: "Kelola saldo, jadwal, laporan, dan rekaman secara mandiri dari dashboard."
  }, {
    icon: <Users className="h-6 w-6" />,
    title: "Permintaan Pasar Tinggi",
    description: "Solusi meeting online yang cocok untuk bisnis, freelancer, event organizer, hingga komunitas."
  }, {
    icon: <Users className="h-6 w-6" />,
    title: "Kendalikan Distribusi Meeting",
    description: "Rapatin hanya menerbitkan Join Meeting Link — Anda yang mengelola & mendistribusikan kepada klien Anda."
  }, {
    icon: <Headphones className="h-6 w-6" />,
    title: "Dukungan Reseller Prioritas",
    description: "Dapatkan bantuan teknis & bisnis dari tim support Rapatin khusus untuk reseller."
  }];
  const howItWorksSteps = [{
    number: 1,
    title: "Daftar sebagai Reseller Rapatin",
    description: "Buat akun reseller Anda dalam hitungan menit."
  }, {
    number: 2,
    title: "Top-up saldo reseller Anda",
    description: "Tambahkan kredit ke akun reseller Anda untuk mulai menjual."
  }, {
    number: 3,
    title: "Jual kredit rapat ke pelanggan Anda",
    description: "Tawarkan solusi rapat fleksibel dengan harga Anda sendiri."
  }, {
    number: 4,
    title: "Pantau penjualan & komisi di dashboard",
    description: "Monitor pendapatan dan aktivitas pelanggan secara real-time."
  }];
  const faqs = [{
    question: "Berapa banyak komisi yang akan saya dapatkan?",
    answer: "Sebagai reseller Rapatin, Anda akan mendapatkan tarif komisi kompetitif yang bergantung pada volume penjualan Anda. Semakin banyak Anda menjual, semakin tinggi persentase komisi Anda. Hubungi tim kami untuk tarif komisi spesifik berdasarkan kebutuhan bisnis Anda."
  }, {
    question: "Bagaimana cara top-up saldo reseller?",
    answer: "Anda dapat mengisi saldo reseller Anda melalui berbagai metode pembayaran termasuk transfer bank, e-wallet, dan kartu kredit/debit. Cukup masuk ke dashboard reseller Anda, pilih opsi top-up, pilih metode pembayaran yang Anda sukai, dan ikuti petunjuknya."
  }, {
    question: "Apakah ada jumlah minimum top-up?",
    answer: "Ya, ada jumlah minimum top-up untuk memastikan Anda memiliki kredit yang cukup untuk dijual kembali. Jumlah minimum top-up saat ini dapat ditemukan di dashboard reseller Anda. Persyaratan ini membantu menjaga efisiensi dalam proses penjualan kembali."
  }, {
    question: "Bisakah saya menetapkan harga jual sendiri?",
    answer: "Tentu saja! Sebagai reseller Rapatin, Anda memiliki kebebasan penuh untuk menetapkan harga jual Anda sendiri. Fleksibilitas ini memungkinkan Anda menentukan margin keuntungan dan menerapkan strategi harga yang paling cocok untuk target pasar Anda."
  }, {
    question: "Bagaimana saya mengelola penjualan & pelanggan?",
    answer: "Anda dapat mengelola semua penjualan dan pelanggan Anda melalui dashboard reseller khusus. Dashboard menyediakan data real-time tentang penjualan, aktivitas pelanggan, saldo, pendapatan komisi, dan lainnya, sehingga memudahkan untuk melacak dan mengembangkan bisnis reseller Anda."
  }, {
    question: "Dukungan apa yang akan saya dapatkan?",
    answer: "Sebagai reseller Rapatin, Anda akan menerima dukungan prioritas dari tim khusus kami. Ini termasuk bantuan teknis, materi pemasaran, panduan penjualan, dan pembaruan rutin tentang fitur baru dan promosi. Kami berkomitmen untuk membantu Anda sukses dalam bisnis reseller Anda."
  }];
  return <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 bg-gradient-to-b from-background to-accent/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 animate-fade-in">
              <div className="inline-flex items-center py-1 px-4 bg-primary/10 rounded-full mb-4">
                <span className="text-xs font-medium text-primary">Program Reseller</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Dapatkan Penghasilan dari <span className="text-primary">Program Reseller</span> Rapatin
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Jual kembali akses rapat online Pay-As-You-Go untuk Zoom, Google Meet, Microsoft Teams dengan harga yang Anda tentukan sendiri — tanpa biaya bulanan atau langganan.
              </p>
              <Button asChild size="lg" className="rounded-lg bg-primary hover:bg-primary/90 text-white">
                <a href="https://app.rapatin.id/register" onClick={handleRegistration} target="_blank" rel="noopener noreferrer">
                  Gabung Reseller Sekarang
                  <ArrowRight size={16} className="ml-2" />
                </a>
              </Button>
            </div>
            <div className="flex-1 animate-float">
              <img src="/lovable-uploads/edbf847f-3513-412d-954a-41d6319fbaf2.png" alt="Program Reseller Rapatin" className="rounded-2xl shadow-elevation" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Become a Reseller */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Mengapa Menjadi Reseller?</h2>
            <p className="text-lg text-muted-foreground">Rapat online kini menjadi kebutuhan penting bagi bisnis, komunitas, dan acara. Rapatin menyediakan platform rapat berbasis top-up yang fleksibel. Sebagai reseller, Anda bebas menawarkan akses rapat kepada pelanggan dengan harga yang Anda tentukan sendiri. Rapatin menerbitkan link meeting yang kemudian Anda distribusikan ke klien Anda.</p>
          </div>
        </div>
      </section>

      {/* 6 Key Benefits */}
      <section className="py-16 bg-gradient-to-b from-white to-accent/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center py-1 px-4 bg-primary/10 rounded-full mb-4">
              <span className="text-xs font-medium text-primary">Keuntungan</span>
            </div>
            <h2 className="text-3xl font-bold mb-4"><span className="text-primary">Keuntungan</span> Menjadi Reseller Rapatin</h2>
            <p className="text-muted-foreground">Bergabung dengan jaringan reseller kami yang terus berkembang dan nikmati keuntungan ini</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => <Card key={index} className="glass hover:shadow-elevation transition-all duration-300 animate-fade-in">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center py-1 px-4 bg-primary/10 rounded-full mb-4">
              <span className="text-xs font-medium text-primary">Proses</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Bagaimana Cara Kerjanya</h2>
            <p className="text-muted-foreground">Mulai dengan langkah-langkah sederhana ini</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {howItWorksSteps.map((step, index) => <div key={index} className="flex gap-4 items-start animate-fade-in delay-100">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 text-white font-bold">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>)}
            </div>

            <div className="mt-12 text-center">
              <Button asChild size="lg" className="rounded-lg bg-primary hover:bg-primary/90 text-white">
                <a href="https://app.rapatin.id/register" onClick={handleRegistration} target="_blank" rel="noopener noreferrer">
                  Mulai Perjalanan Reseller Anda
                  <ArrowRight size={16} className="ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-b from-white to-accent/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center py-1 px-4 bg-primary/10 rounded-full mb-4">
              <span className="text-xs font-medium text-primary">Pertanyaan</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-muted-foreground">Temukan jawaban untuk pertanyaan umum tentang program reseller kami</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-b from-accent/20 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto glass rounded-2xl p-8 md:p-12 shadow-elevation border border-white/40 animate-scale-in">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Jadilah Reseller Rapatin Hari Ini dan Mulai Mendapatkan Penghasilan!</h2>
                <p className="text-muted-foreground mb-6">
                  Bergabunglah dengan jaringan reseller sukses kami dan mulai tawarkan solusi rapat fleksibel kepada pelanggan Anda dengan harga yang Anda tentukan sendiri.
                </p>
                <Button asChild size="lg" className="rounded-lg bg-primary hover:bg-primary/90 text-white">
                  <a href="https://app.rapatin.id/register" onClick={handleRegistration} target="_blank" rel="noopener noreferrer">
                    Daftar sebagai Reseller
                    <ArrowRight size={16} className="ml-2" />
                  </a>
                </Button>
              </div>
              <div className="rounded-xl bg-primary/5 p-6 space-y-4">
                <h3 className="font-medium text-lg">Yang akan Anda dapatkan:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm">Solusi rapat instan tanpa berlangganan</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm">Kontrol penuh atas harga dan margin</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm">Dashboard reseller lengkap</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm">Materi pemasaran dan dukungan penjualan</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0 mt-0.5" />
                    <span className="text-sm">Dukungan teknis prioritas</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>;
};
export default MenjadiReseller;