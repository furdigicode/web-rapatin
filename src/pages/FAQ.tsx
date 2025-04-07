
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Static FAQ data
const faqItems = [
  {
    id: '1',
    question: 'Apa itu Rapatin?',
    answer: 'Rapatin adalah platform meeting online yang dirancang khusus untuk kebutuhan profesional dan bisnis di Indonesia, menawarkan fitur-fitur yang disesuaikan dengan kebutuhan lokal.',
    category: 'Umum',
    active: true,
    order_position: 1
  },
  {
    id: '2',
    question: 'Bagaimana cara membuat akun di Rapatin?',
    answer: 'Anda dapat membuat akun dengan mengklik tombol "Daftar" di halaman utama kami, kemudian mengisi formulir pendaftaran dengan informasi yang diperlukan seperti nama, email, dan password.',
    category: 'Umum',
    active: true,
    order_position: 2
  },
  {
    id: '3',
    question: 'Apakah Rapatin memiliki versi gratis?',
    answer: 'Ya, Rapatin menawarkan versi gratis dengan fitur dasar. Untuk fitur lebih lengkap, kami menyediakan paket berlangganan dengan harga yang terjangkau.',
    category: 'Harga',
    active: true,
    order_position: 1
  },
  {
    id: '4',
    question: 'Apa perbedaan antara paket Basic dan Pro?',
    answer: 'Paket Basic menyediakan fitur dasar untuk meeting online dengan batasan waktu dan peserta. Paket Pro memberi Anda akses ke semua fitur tanpa batasan, termasuk rekaman cloud dan laporan detail peserta.',
    category: 'Harga',
    active: true,
    order_position: 2
  },
  {
    id: '5',
    question: 'Bagaimana cara mengundang peserta ke meeting?',
    answer: 'Setelah membuat jadwal meeting, Anda akan mendapatkan link undangan yang dapat dibagikan melalui email, WhatsApp, atau platform lainnya. Peserta hanya perlu mengklik link tersebut untuk bergabung.',
    category: 'Teknis',
    active: true,
    order_position: 1
  },
  {
    id: '6',
    question: 'Apakah Rapatin dapat digunakan pada perangkat mobile?',
    answer: 'Ya, Rapatin dapat diakses melalui browser di perangkat mobile atau melalui aplikasi Rapatin yang tersedia untuk Android dan iOS.',
    category: 'Teknis',
    active: true,
    order_position: 2
  }
];

// Extract unique categories
const categories = ['Umum', 'Harga', 'Teknis'];

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold">Pertanyaan yang Sering Diajukan</h1>
            <p className="text-xl text-muted-foreground mt-4">
              Jawaban atas pertanyaan umum tentang Rapatin
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {categories.map((category) => (
              <div key={category} className="mb-10">
                <h2 className="text-2xl font-semibold capitalize mb-4">{category}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems
                    .filter(item => item.category === category)
                    .map((item) => (
                      <AccordionItem key={item.id} value={item.id}>
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="prose prose-slate max-w-none">
                            <p>{item.answer}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
