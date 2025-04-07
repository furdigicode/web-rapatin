
import React, { useState } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface BrandLogo {
  id: string;
  name: string;
  svg_content: string;
  width: number;
  height: number;
  active: boolean;
  order_position: number;
}

const BrandLogosSection = () => {
  const [plugin] = useState(() => Autoplay({ delay: 2000, stopOnInteraction: false }));

  // Static brand logos data
  const logos: BrandLogo[] = [
    {
      id: '1',
      name: 'Brand 1',
      svg_content: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
      width: 24,
      height: 24,
      active: true,
      order_position: 1
    },
    {
      id: '2',
      name: 'Brand 2',
      svg_content: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>',
      width: 24,
      height: 24,
      active: true,
      order_position: 2
    },
    {
      id: '3',
      name: 'Brand 3',
      svg_content: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
      width: 24,
      height: 24,
      active: true,
      order_position: 3
    },
    {
      id: '4',
      name: 'Brand 4',
      svg_content: '<path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/>',
      width: 24,
      height: 24,
      active: true,
      order_position: 4
    },
    {
      id: '5',
      name: 'Brand 5',
      svg_content: '<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>',
      width: 24,
      height: 24,
      active: true,
      order_position: 5
    },
  ];

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-lg text-muted-foreground">Dipercaya oleh 120+ brand</p>
      </div>
      <Carousel 
        className="w-full" 
        plugins={[plugin]}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-1">
          {logos.map((logo) => (
            <CarouselItem 
              key={logo.id} 
              className="pl-1 md:basis-1/4 lg:basis-1/5"
            >
              <div className="flex items-center justify-center h-full p-2">
                <svg 
                  viewBox="0 0 100 30" 
                  width={logo.width} 
                  height={logo.height}
                  className="fill-current text-gray-600 hover:text-primary transition-colors grayscale hover:grayscale-0 transition-all duration-200"
                  dangerouslySetInnerHTML={{ __html: logo.svg_content }}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default BrandLogosSection;
