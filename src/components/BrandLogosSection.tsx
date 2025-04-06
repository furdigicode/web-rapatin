
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BrandLogo } from '@/types/supabase';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const BrandLogosSection = () => {
  const [logos, setLogos] = useState<BrandLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [plugin] = useState(() => Autoplay({ delay: 2000, stopOnInteraction: false }));

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const { data, error } = await supabase
          .from('brand_logos')
          .select('*')
          .eq('active', true)
          .order('order_position', { ascending: true }) as { data: BrandLogo[] | null; error: Error | null };

        if (error) {
          console.error('Error fetching brand logos:', error);
        } else if (data) {
          setLogos(data);
        }
      } catch (err) {
        console.error('Error in brand logos fetch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
  }, []);

  if (loading) {
    return (
      <div className="py-10 px-4 max-w-7xl mx-auto">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading trusted brands...</p>
        </div>
      </div>
    );
  }

  if (logos.length === 0) {
    return null;
  }

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
