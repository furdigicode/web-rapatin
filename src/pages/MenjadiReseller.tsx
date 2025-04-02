import React from 'react';
import { Button } from "@/components/ui/button";
import { DollarSign, Shield, BarChart as ChartBar, Users, Headphones, ArrowRight, CheckCircle2, Calendar, Video, Calculator, CreditCard, TrendingUp, Wallet, CreditCard as CardIcon } from 'lucide-react';
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
    title: "Harga Spesial & Bebas Atur Margin",
    description: "Dapatkan harga khusus reseller (75% lebih murah dari harga publik) dan bebas menentukan harga jual sendiri di channel pemasaran Anda."
  }, {
    icon: <Shield className="h-6 w-6" />,
    title: "Tanpa Komitmen Bulanan",
    description: "Tidak perlu langganan, tanpa biaya tetap. Hanya bayar saat top-up saldo reseller."
  }, {
    icon: <ChartBar className="h-6 w-6" />,
    title: "Akses Dashboard Real-Time",
    description: "Kelola saldo, pelanggan, dan distribusi link meeting secara mandiri dari dashboard."
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
    title: "Top-up saldo akun Anda",
    description: "Tambahkan saldo ke akun reseller Anda untuk mulai menjual."
  }, {
    number: 3,
    title: "Jual akses rapat ke pelanggan Anda",
    description: "Tawarkan solusi rapat fleksibel dengan harga Anda sendiri."
  }, {
    number: 4,
    title: "Kelola jadwal rapat pelanggan dengan mandiri",
    description: "Monitor jadwal, laporan, dan rekaman real-time."
  }];
  
  const faqs = [{
    question: "Berapa harga khusus reseller?",
    answer: "Sebagai reseller Rapatin, Anda akan mendapatkan harga yang lebih murah 75% dari harga jual end-user. Misalnya harga akses rapat Zoom berkapasitas 100 peserta adalah Rp 20.000, maka harga reseller adalah Rp 5.000"
  }, {
    question: "Bagaimana cara top-up saldo reseller?",
    answer: "Anda dapat mengisi saldo reseller Anda melalui berbagai metode pembayaran termasuk transfer bank, e-wallet, dan kartu kredit/debit. Cukup masuk ke dashboard reseller Anda, pilih opsi top-up, pilih metode pembayaran yang Anda sukai, dan ikuti petunjuknya."
  }, {
    question: "Apakah ada jumlah minimum top-up?",
    answer: "Ya, ada jumlah minimum top-up yaitu Rp 200.000 untuk memastikan Anda memiliki kredit yang cukup untuk dijual kembali. Jumlah minimum top-up saat ini dapat ditemukan di dashboard reseller Anda. Persyaratan ini membantu menjaga komitmen dan efisiensi dalam proses penjualan kembali."
  }, {
    question: "Bisakah saya menetapkan harga jual sendiri?",
    answer: "Tentu saja! Sebagai reseller Rapatin, Anda memiliki kebebasan penuh untuk menetapkan harga jual Anda sendiri. Fleksibilitas ini memungkinkan Anda menentukan margin keuntungan dan menerapkan strategi harga yang paling cocok untuk target pasar Anda."
  }, {
    question: "Dukungan apa yang akan saya dapatkan?",
    answer: "Sebagai reseller Rapatin, Anda akan menerima dukungan prioritas dari tim khusus kami. Ini termasuk bantuan teknis, materi pemasaran, panduan penjualan, dan pembaruan rutin tentang fitur baru dan promosi. Kami berkomitmen untuk membantu Anda sukses dalam bisnis reseller Anda."
  }];
  
  const meetingPriceReseller = 5000; // Price per meeting for reseller
  const meetingPriceEndUser = 20000; // Price per meeting for end user
  const profitPerMeeting = meetingPriceEndUser - meetingPriceReseller;
  
  const salesCalculations = [
    {
      meetings: 3,
      period: 'hari',
      total: 3 * profitPerMeeting,
    },
    {
      meetings: 15,
      period: 'minggu',
      total: 15 * profitPerMeeting,
    },
    {
      meetings: 60,
      period: 'bulan',
      total: 60 * profitPerMeeting,
    }
  ];
  
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
              <div className="relative w-full max-w-md mx-auto">
                <div className="rounded-2xl overflow-hidden shadow-elevation border border-white/40 bg-white/90">
                  <div className="bg-white/90 p-3 flex items-center border-b">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="mx-auto text-sm font-medium">Dashboard Reseller</div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex justify-between mb-3">
                        <h3 className="text-lg font-semibold">Pendapatan Bulan Ini</h3>
                        <span className="text-lg font-bold text-primary">Rp 1.250.000</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{width: '75%'}}></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>Target: Rp 1.500.000</span>
                        <span>75% tercapai</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Transaksi Terbaru</h3>
                        <span className="text-xs text-primary cursor-pointer">Lihat semua</span>
                      </div>
                      
                      <div className="border rounded-lg p-3 bg-white">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-3 items-center">
                            <div className="p-2 bg-primary/10 rounded-full">
                              <Video size={16} className="text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Zoom Meeting</p>
                              <p className="text-xs text-muted-foreground">PT Maju Bersama</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">+ Rp 150.000</p>
                            <p className="text-xs text-muted-foreground">Hari ini</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-3 bg-white">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-3 items-center">
                            <div className="p-2 bg-primary/10 rounded-full">
                              <Video size={16} className="text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Google Meet</p>
                              <p className="text-xs text-muted-foreground">Seminar Online</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">+ Rp 250.000</p>
                            <p className="text-xs text-muted-foreground">Kemarin</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-between items-center gap-4">
                      <div className="flex-1">
                        <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg text-sm">
                          <CreditCard size={16} />
                          <span>Top Up</span>
                        </button>
                      </div>
                      <div className="flex-1">
                        <button className="w-full flex items-center justify-center gap-2 border border-primary text-primary py-2 rounded-lg text-sm">
                          <Calculator size={16} />
                          <span>Kalkulator</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 -z-10 w-full h-full rounded-2xl bg-primary/10"></div>
                
                <div className="absolute -top-10 -right-10 bg-white rounded-lg p-4 shadow-elevation border border-white/40 w-48 transform rotate-3 z-10">
                  <h3 className="text-sm font-medium mb-2">Potensi Keuntungan</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Harga Reseller:</span>
                      <span className="font-medium">Rp 5.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Harga Jual:</span>
                      <span className="font-medium">Rp 20.000</span>
                    </div>
                    <div className="h-px bg-gray-200 my-1"></div>
                    <div className="flex justify-between text-primary">
                      <span>Profit:</span>
                      <span className="font-bold">Rp 15.000</span>
                    </div>
                    <div className="text-center text-primary/60 font-medium mt-1">
                      300% Margin!
                    </div>
                  </div>
                </div>
              </div>
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

      {/* Potential Income Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center py-1 px-4 bg-primary/10 rounded-full mb-4">
              <span className="text-xs font-medium text-primary">Potensi Penghasilan</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Berapa <span className="text-primary">Penghasilan</span> yang Bisa Anda Dapatkan?</h2>
            <p className="text-muted-foreground">Lihat potensi pendapatan yang bisa Anda raih dengan menjadi Reseller Rapatin</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-xl p-6 border border-white/40 shadow-elevation mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-medium mb-2">Contoh Perhitungan Penghasilan</h3>
                  <p className="text-muted-foreground">Berdasarkan rata-rata penjualan akses meeting</p>
                </div>
                <div className="flex gap-4 flex-wrap justify-center">
                  <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
                    <CardIcon size={16} className="text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Harga Reseller</p>
                      <p className="font-medium">Rp {meetingPriceReseller.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
                    <Wallet size={16} className="text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Harga Jual</p>
                      <p className="font-medium">Rp {meetingPriceEndUser.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
                    <TrendingUp size={16} className="text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Profit/Meeting</p>
                      <p className="font-medium">Rp {profitPerMeeting.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {salesCalculations.map((calc, index) => (
                  <Card key={index} className="border border-primary/10">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center">
                        <div className="mb-2">
                          <span className="text-4xl font-bold text-primary">{calc.meetings}</span>
                          <span className="text-lg ml-1">meeting</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">per {calc.period}</p>
                        <div className="w-full h-px bg-gray-100 my-3"></div>
                        <div className="mb-1">
                          <span className="font-medium">Pendapatan:</span>
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          Rp {calc.total.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          per {calc.period}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-primary/5 rounded-lg">
                <div className="flex gap-2 items-center mb-1">
                  <CheckCircle2 size={16} className="text-primary" />
                  <p className="font-medium">Anda bebas menentukan harga jual sendiri</p>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  Estimasi penghasilan di atas hanya contoh. Anda bisa menetapkan harga yang lebih tinggi sesuai pasar Anda.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Button asChild size="lg" className="rounded-lg bg-primary hover:bg-primary/90 text-white">
                <a href="https://app.rapatin.id/register" onClick={handleRegistration} target="_blank" rel="noopener noreferrer">
                  Gabung Reseller & Mulai Menghasilkan
                  <ArrowRight size={16} className="ml-2" />
                </a>
              </Button>
            </div>
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
