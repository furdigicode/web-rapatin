
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from 'embla-carousel-autoplay';

type Testimonial = {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  avatar_url: string;
};

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    position: 'CEO',
    company: 'PT Maju Bersama',
    content: 'Rapatin sangat membantu bisnis kami menghemat biaya rapat online. Kami hanya membayar sesuai penggunaan, tanpa perlu langganan bulanan yang mahal.',
    rating: 5,
    avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '2',
    name: 'Siti Rahayu',
    position: 'HR Manager',
    company: 'Startup Indonesia',
    content: 'Fitur laporan peserta sangat berguna untuk memantau kehadiran tim dalam rapat. Kualitas video dan audio juga sangat baik!',
    rating: 5,
    avatar_url: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '3',
    name: 'Ahmad Hidayat',
    position: 'Konsultan Digital',
    company: 'DigitalSpace',
    content: 'Saya suka kemudahan menjadwalkan rapat dan tidak ada batasan waktu. Sangat cocok untuk diskusi proyek yang kadang membutuhkan waktu panjang.',
    rating: 5,
    avatar_url: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  // Adding three new testimonials
  {
    id: '4',
    name: 'Dewi Kusuma',
    position: 'Marketing Director',
    company: 'Indofood Sukses Makmur',
    content: 'Platform Rapatin sangat stabil dan handal. Tidak pernah mengalami masalah teknis selama meeting penting dengan klien kami dari luar negeri.',
    rating: 5,
    avatar_url: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: '5',
    name: 'Rudi Hartono',
    position: 'CTO',
    company: 'TechIndo',
    content: 'Integrasi dengan kalender dan notifikasi otomatis sangat membantu team kami yang sibuk untuk tidak melewatkan rapat penting.',
    rating: 5,
    avatar_url: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
  {
    id: '6',
    name: 'Lina Wijaya',
    position: 'Project Manager',
    company: 'Astra International',
    content: 'Berbagi layar dan kolaborasi dokumen real-time membuat meeting produktif. Rapatin adalah solusi terbaik untuk tim yang bekerja remote.',
    rating: 5,
    avatar_url: 'https://randomuser.me/api/portraits/women/6.jpg'
  }
];

const TestimonialSection = () => {
  const autoplayPlugin = React.useMemo(() => 
    Autoplay({
      delay: 2000, // 2 seconds between slides
      stopOnInteraction: true, // stop auto-sliding when user interacts
      rootNode: (emblaRoot) => emblaRoot.parentElement,
    }), 
    []
  );

  return (
    <section id="testimonials" className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <p className="text-primary font-medium">Testimoni Pengguna</p>
          <h2 className="text-4xl font-bold mt-2 mb-4">
            <span className="text-primary">Pendapat mereka</span> tentang pengalaman menggunakan Rapatin
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Lihat bagaimana Rapatin membantu berbagai bisnis dan profesional meningkatkan efektivitas rapat online mereka.
          </p>
        </div>
        
        <div className="mt-12 relative">
          <Carousel className="w-full" plugins={[autoplayPlugin]} opts={{ loop: true }}>
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/1 lg:basis-1/3">
                  <Card className="border-none shadow-sm h-full bg-white">
                    <CardContent className="p-6">
                      <div className="flex mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-primary fill-primary"
                          />
                        ))}
                      </div>
                      <p className="mb-6 text-lg">"{testimonial.content}"</p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                          <img
                            src={testimonial.avatar_url}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{testimonial.name}</h4>
                          <p className="text-muted-foreground">
                            {testimonial.position}, {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute -left-4 top-1/2 -translate-y-1/2">
              <CarouselPrevious className="relative left-0" />
            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2">
              <CarouselNext className="relative right-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
