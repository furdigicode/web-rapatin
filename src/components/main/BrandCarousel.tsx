
import React from 'react';

const BrandCarousel: React.FC = () => {
  const brands = [
    { name: 'Astra International', logo: '/lovable-uploads/2daea350-0851-4dd8-8f79-ee07aaaad905.png' },
    { name: 'Indofood', logo: '/lovable-uploads/2daea350-0851-4dd8-8f79-ee07aaaad905.png' },
    { name: 'TechIndo', logo: '/lovable-uploads/2daea350-0851-4dd8-8f79-ee07aaaad905.png' },
    { name: 'DigitalSpace', logo: '/lovable-uploads/2daea350-0851-4dd8-8f79-ee07aaaad905.png' },
    { name: 'Startup Indonesia', logo: '/lovable-uploads/2daea350-0851-4dd8-8f79-ee07aaaad905.png' },
    { name: 'PT Maju Bersama', logo: '/lovable-uploads/2daea350-0851-4dd8-8f79-ee07aaaad905.png' },
  ];

  return (
    <section className="py-16 bg-accent/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Dipercaya oleh <span className="text-primary">1000+</span> perusahaan di Indonesia
          </h2>
          <p className="text-muted-foreground">
            Dari startup hingga perusahaan besar, semua menggunakan platform kami
          </p>
        </div>
        
        <div className="overflow-hidden">
          <div className="flex animate-slide-in-right space-x-8 md:space-x-12">
            {brands.concat(brands).map((brand, index) => (
              <div key={index} className="flex-shrink-0 flex items-center justify-center h-16 w-32 grayscale hover:grayscale-0 transition-all duration-300">
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="max-h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
