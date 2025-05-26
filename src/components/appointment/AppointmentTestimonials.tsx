
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';

const AppointmentTestimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Dr. Sarah Wijaya',
      role: 'Dokter Spesialis',
      image: '/lovable-uploads/60fca5a0-b0eb-4219-b6e6-a27578d426b8.png',
      content: 'Sejak menggunakan Rapatin untuk telemedicine, pasien saya bisa booking appointment dengan mudah dan pembayaran langsung masuk. Sangat membantu praktik saya.',
      rating: 5
    },
    {
      name: 'Agus Hartono',
      role: 'Business Coach',
      image: '/lovable-uploads/54aa59cb-5574-4e7e-b296-cfd84c43473b.png',
      content: 'Platform yang sempurna untuk coaching session. Klien bisa langsung bayar saat booking, dan saya tidak perlu repot urus administrasi. Recommended!',
      rating: 5
    },
    {
      name: 'Lisa Indrawati',
      role: 'Konsultan Hukum',
      image: '/lovable-uploads/90dcfcfe-cb9e-46e1-88a3-5cf6472dd222.png',
      content: 'Fitur payment collection sangat membantu. Klien sudah bayar konsultasi sebelum meeting dimulai. No more unpaid consultation!',
      rating: 5
    },
    {
      name: 'Budi Santoso',
      role: 'Financial Advisor',
      image: '/lovable-uploads/c64ceec2-7c79-4671-912e-b179358001aa.png',
      content: 'System reminder otomatis membuat klien tidak lupa appointment. ROI meningkat karena no-show berkurang drastis.',
      rating: 5
    },
    {
      name: 'Maria Santos',
      role: 'Beauty Consultant',
      image: '/lovable-uploads/b85c0fd2-b1c7-4ba8-8938-bf1ac3bdeb28.png',
      content: 'Untuk virtual beauty consultation, platform ini perfect. Custom form nya bisa disesuaikan dengan kebutuhan assessment klien.',
      rating: 5
    },
    {
      name: 'Ahmad Kurniawan',
      role: 'IT Trainer',
      image: '/lovable-uploads/edbf847f-3513-412d-954a-41d6319fbaf2.png',
      content: 'Training session online jadi lebih terorganisir. Recording feature membantu peserta untuk review materi setelahnya.',
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-background to-accent/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Dipercaya Profesional di Berbagai Bidang
          </h2>
          <p className="text-lg text-muted-foreground">
            Ribuan profesional sudah menggunakan Rapatin untuk mengelola appointment booking mereka.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass hover:shadow-elevation transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
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

export default AppointmentTestimonials;
