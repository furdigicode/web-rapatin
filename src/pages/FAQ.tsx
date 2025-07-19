
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const faqs: FAQItem[] = [
    // Umum
    {
      question: "Apa itu Rapatin?",
      answer: "Rapatin adalah platform penjadwalan rapat online dengan model bayar-sesuai-pakai, tanpa memerlukan langganan bulanan atau akun Zoom berbayar. Kami menyediakan solusi praktis untuk mengelola rapat virtual dengan biaya yang lebih efisien.",
      category: "umum",
    },
    {
      question: "Apa keunggulan Rapatin dibandingkan platform lain?",
      answer: "Rapatin unggul dengan model pembayaran sesuai pemakaian, terintegrasi dengan berbagai alat produktivitas, menyediakan rekaman cloud tanpa biaya tambahan, dan tidak memerlukan download aplikasi khusus. Semua ini dirancang untuk memberikan pengalaman rapat online yang lebih efisien dan hemat biaya.",
      category: "umum",
    },
    
    // Pembayaran
    {
      question: "Bagaimana cara kerja model bayar-sesuai-pakai?",
      answer: "Dengan model bayar-sesuai-pakai, Anda hanya membayar untuk rapat yang benar-benar Anda adakan. Cukup isi saldo akun Anda, dan kami akan mengurangi biaya sesuai durasi rapat yang diselenggarakan. Tidak ada biaya langganan bulanan atau tahunan.",
      category: "pembayaran",
    },
    {
      question: "Apakah ada biaya minimum?",
      answer: "Tidak ada biaya minimum untuk menggunakan Rapatin. Anda hanya membayar untuk durasi rapat yang Anda selenggarakan, tanpa biaya tersembunyi atau kewajiban minimum pemakaian.",
      category: "pembayaran",
    },
    {
      question: "Bagaimana cara melakukan pengisian saldo?",
      answer: "Pengisian saldo dapat dilakukan melalui berbagai metode pembayaran seperti kartu kredit, transfer bank, e-wallet, dan QRIS. Setelah login ke akun Anda, kunjungi halaman 'Isi Saldo' di dashboard untuk melakukan pengisian.",
      category: "pembayaran",
    },
    
    // Fitur
    {
      question: "Berapa lama rekaman cloud tersimpan?",
      answer: "Rekaman cloud tersimpan selama 72 jam setelah rapat selesai dan dapat diunduh kapan saja selama periode tersebut. Untuk penyimpanan lebih lama, Anda dapat mengunduh rekaman dan menyimpannya di perangkat Anda sendiri.",
      category: "fitur",
    },
    {
      question: "Apakah ada batasan jumlah peserta dalam satu rapat?",
      answer: "Rapatin mendukung hingga 100 peserta dalam satu rapat dengan kualitas video dan audio yang optimal. Untuk kebutuhan lebih besar, silakan hubungi tim dukungan kami untuk solusi khusus.",
      category: "fitur",
    },
    {
      question: "Apakah saya bisa menggunakan Rapatin dari perangkat mobile?",
      answer: "Ya, Rapatin dapat diakses melalui browser di smartphone dan tablet tanpa perlu menginstal aplikasi tambahan. Kami juga menyediakan tampilan yang responsif untuk pengalaman pengguna yang optimal di berbagai ukuran layar.",
      category: "fitur",
    },
    
    // Teknis
    {
      question: "Apakah Rapatin memerlukan instalasi perangkat lunak khusus?",
      answer: "Tidak, Rapatin bekerja langsung melalui browser web Anda tanpa memerlukan instalasi perangkat lunak tambahan. Cukup klik tautan rapat dan Anda siap bergabung. Kami merekomendasikan menggunakan browser Chrome atau Firefox untuk pengalaman terbaik.",
      category: "teknis",
    },
    {
      question: "Bagaimana dengan keamanan data selama rapat?",
      answer: "Rapatin menggunakan enkripsi end-to-end untuk semua rapat dan data yang ditransfer. Kami tidak menyimpan konten rapat kecuali fitur rekaman diaktifkan, dan Anda memiliki kendali penuh atas siapa yang dapat bergabung melalui fitur password dan ruang tunggu.",
      category: "teknis",
    },
    
    // Akun
    {
      question: "Bagaimana cara mendaftar di Rapatin?",
      answer: "Untuk mendaftar, kunjungi halaman utama kami dan klik tombol 'Daftar' di sudut kanan atas. Isi formulir pendaftaran dengan email dan password Anda, verifikasi email Anda, dan akun Anda siap digunakan.",
      category: "akun",
    },
    {
      question: "Apakah saya dapat mengelola beberapa pengguna dalam satu akun?",
      answer: "Ya, kami menyediakan fitur manajemen tim yang memungkinkan Anda menambahkan beberapa pengguna dalam satu akun organisasi. Setiap pengguna dapat memiliki peran dan izin yang berbeda sesuai kebutuhan.",
      category: "akun",
    },
  ];

  const categories = [
    { id: "all", name: "Semua" },
    { id: "umum", name: "Umum" },
    { id: "pembayaran", name: "Pembayaran" },
    { id: "fitur", name: "Fitur" },
    { id: "teknis", name: "Teknis" },
    { id: "akun", name: "Akun" },
  ];

  const filteredFaqs = selectedCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              Bantuan
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Pertanyaan yang Sering Diajukan</h1>
            <p className="text-lg text-muted-foreground">
              Temukan jawaban untuk pertanyaan umum tentang layanan Rapatin
            </p>
          </div>
          
          {/* Categories */}
          <div className="max-w-3xl mx-auto mb-10">
            <Tabs
              defaultValue="all"
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              className="w-full"
            >
              <TabsList className="w-full flex flex-wrap justify-center mb-6 bg-muted/50">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex-grow basis-1/3 md:basis-auto"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {/* FAQ Items for Each Category */}
              <TabsContent value={selectedCategory} className="mt-6">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${index}`}
                      className="bg-card rounded-lg border px-6"
                    >
                      <AccordionTrigger className="text-left font-medium py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Need more help section */}
          <div className="max-w-2xl mx-auto mt-16 text-center p-8 rounded-xl bg-muted/30 border">
            <h2 className="text-xl font-semibold mb-3">Masih punya pertanyaan?</h2>
            <p className="text-muted-foreground mb-6">
              Jika Anda belum menemukan jawaban yang dicari, tim dukungan kami siap membantu
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/kontak" 
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Hubungi Kami
              </a>
              <a 
                href="https://wa.me/628123456789" 
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-white border hover:bg-muted/50"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
