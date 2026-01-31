import { useState } from "react";
import { HelpCircle, MessageCircle, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const faqItems = [
  {
    question: "Bagaimana prosesnya?",
    answer:
      "Setelah mengisi data pesanan dan data meeting, kemudian menyelesaikan pembayaran, Anda langsung mendapatkan akses meeting. Akses diberikan langsung di halaman pembayaran berhasil, dan informasi juga dikirimkan ke email dan WhatsApp.",
  },
  {
    question: "Berapa lama durasi yang didapatkan?",
    answer: "24 jam dalam satu tanggal, mulai jam 00:00 sampai jam 24:00.",
  },
  {
    question: "Apakah dalam satu tanggal bisa digunakan berkali-kali?",
    answer: "Ya, bisa. Anda dapat menggunakan meeting berkali-kali selama masih dalam tanggal yang sama.",
  },
  {
    question: "Apakah pesanan bisa di-reschedule atau di-upgrade?",
    answer:
      "Tidak bisa. Pesanan melalui Quick Order tidak dapat diubah atau diedit. Jika ingin akses jadwal yang lebih fleksibel, silakan mendaftar ke aplikasi Rapatin.",
  },
  {
    question: "Apakah tersedia rekaman cloud?",
    answer:
      "Ya, tersedia. Untuk orderan Quick Order, hasil rekaman harus diminta manual melalui admin. Jika ingin akses rekaman tanpa bantuan admin, bisa mendaftar aplikasi Rapatin.",
  },
];

export function QuickOrderFAQ() {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = "6287788980084";
  const whatsappMessage = encodeURIComponent("Halo, saya ada pertanyaan tentang Quick Order Rapatin");

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between h-auto py-3">
          <span className="flex items-center gap-2 font-semibold">
            <HelpCircle className="w-5 h-5 text-primary" />
            Pertanyaan Umum
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-sm py-3">{item.question}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="pt-2">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Pertanyaan lain? Hubungi Admin
            </a>
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
