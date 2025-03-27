
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MessageSquareQuote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Testimonial = {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  imageUrl?: string;
};

const TestimonialSection = () => {
  // Example testimonials - in a real app, these would come from an API or database
  const testimonials: Testimonial[] = [{
    id: '1',
    name: 'Budi Santoso',
    position: 'CEO',
    company: 'PT Maju Bersama',
    content: 'Rapatin sangat membantu bisnis kami menghemat biaya rapat online. Kami hanya membayar sesuai penggunaan, tanpa perlu langganan bulanan yang mahal.',
    rating: 5,
    imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
  }, {
    id: '2',
    name: 'Siti Rahayu',
    position: 'HR Manager',
    company: 'Startup Indonesia',
    content: 'Fitur laporan peserta sangat berguna untuk memantau kehadiran tim dalam rapat. Kualitas video dan audio juga sangat baik!',
    rating: 5,
    imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
  }, {
    id: '3',
    name: 'Ahmad Hidayat',
    position: 'Konsultan Digital',
    company: 'DigitalSpace',
    content: 'Saya suka kemudahan menjadwalkan rapat dan tidak ada batasan waktu. Sangat cocok untuk diskusi proyek yang kadang membutuhkan waktu panjang.',
    rating: 5,
    imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
  }];

  return (
    <section className="py-20 bg-gradient-to-b from-accent/20 to-background" id="testimonials">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center py-1 px-4 bg-accent rounded-full mb-4">
            <span className="text-xs font-medium text-primary">Testimoni Pengguna</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-primary">Pendapat mereka</span> tentang pengalaman menggunakan Rapatin
          </h2>
          <p className="text-muted-foreground text-lg">
            Lihat bagaimana Rapatin membantu berbagai bisnis dan profesional meningkatkan efektivitas rapat online mereka.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map(testimonial => (
            <Card key={testimonial.id} className="glass h-full hover:shadow-elevation transition-all duration-300 animate-fade-in delay-100">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < testimonial.rating ? "fill-primary text-primary" : "text-gray-300"} />
                  ))}
                </div>
                
                <p className="flex-grow mb-6">"{testimonial.content}"</p>
                
                <div className="flex items-center mt-auto">
                  {testimonial.imageUrl && (
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img src={testimonial.imageUrl} alt={testimonial.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.position}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
