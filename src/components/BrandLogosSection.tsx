
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BrandLogo } from '@/types/supabase';

const BrandLogosSection = () => {
  const [logos, setLogos] = useState<BrandLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const { data, error } = await supabase
          .from('brand_logos')
          .select('*')
          .eq('active', true)
          .order('order_position', { ascending: true });

        if (error) {
          console.error('Error fetching brand logos:', error);
        } else if (data) {
          setLogos(data as BrandLogo[]);
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
        <p className="text-lg text-muted-foreground">Dipercaya oleh perusahaan terkemuka</p>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
        {logos.map((logo) => (
          <div 
            key={logo.id} 
            className="grayscale hover:grayscale-0 transition-all duration-200 flex items-center justify-center"
            style={{ width: logo.width }}
          >
            <svg 
              viewBox={`0 0 ${logo.width} ${logo.height}`} 
              width={logo.width} 
              height={logo.height}
              className="fill-current text-gray-600 hover:text-primary transition-colors"
              dangerouslySetInnerHTML={{ __html: logo.svg_content }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandLogosSection;
