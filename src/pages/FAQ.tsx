import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="FAQ - Pertanyaan Umum Tentang Rapatin | Panduan Lengkap"
        description="Temukan jawaban untuk pertanyaan umum tentang platform meeting online Rapatin. Panduan lengkap fitur, pricing, keamanan, dan cara penggunaan."
        keywords="FAQ rapatin, pertanyaan umum zoom, panduan meeting online, help rapatin, cara pakai rapatin, troubleshooting meeting"
        url="https://rapatin.id/faq"
      />
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Pertanyaan Umum (FAQ)</h1>
            <p className="text-lg text-muted-foreground">
              Temukan jawaban atas pertanyaan yang sering diajukan tentang Rapatin.
            </p>
          </div>
          
          {/* FAQ Accordions */}
          <div className="max-w-3xl mx-auto animate-fade-in">
            <Accordion type="single" collapsible>
              <AccordionItem value="question-1">
                <AccordionTrigger>Apa itu Rapatin?</AccordionTrigger>
                <AccordionContent>
                  Rapatin adalah platform meeting online yang dirancang untuk memudahkan kolaborasi tim, presentasi, webinar, dan berbagai jenis pertemuan virtual lainnya.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="question-2">
                <AccordionTrigger>Fitur apa saja yang ditawarkan Rapatin?</AccordionTrigger>
                <AccordionContent>
                  Rapatin menawarkan fitur-fitur seperti:
                  <ul>
                    <li>- Video dan audio berkualitas tinggi</li>
                    <li>- Screen sharing</li>
                    <li>- Chat</li>
                    <li>- Rekaman meeting</li>
                    <li>- Integrasi kalender</li>
                    <li>- Kontrol peserta</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="question-3">
                <AccordionTrigger>Bagaimana cara memulai meeting di Rapatin?</AccordionTrigger>
                <AccordionContent>
                  Anda dapat memulai meeting dengan membuat akun, menjadwalkan meeting, dan mengundang peserta melalui link atau email.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="question-4">
                <AccordionTrigger>Apakah Rapatin aman digunakan?</AccordionTrigger>
                <AccordionContent>
                  Ya, Rapatin menggunakan enkripsi end-to-end untuk melindungi privasi dan keamanan meeting Anda.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="question-5">
                <AccordionTrigger>Berapa biaya menggunakan Rapatin?</AccordionTrigger>
                <AccordionContent>
                  Rapatin menawarkan berbagai paket harga, termasuk paket gratis dengan fitur terbatas dan paket berbayar dengan fitur lengkap.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
