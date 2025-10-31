import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import BrandLogo from './BrandLogo';
import { brandLogos, BrandLogo as BrandLogoType } from '@/data/brandLogos';

interface BrandCarouselProps {
  title?: string;
  subtitle?: string;
  logos?: BrandLogoType[];
  autoplay?: boolean;
  autoplayDelay?: number;
  duplicateCount?: number;
  itemBasis?: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  showTitle?: boolean;
}

/**
 * BrandCarousel Component
 * 
 * Reusable brand logo carousel with:
 * - Infinite loop autoplay
 * - Responsive sizing
 * - Optional title/subtitle
 * - Customizable logo list
 * - Configurable autoplay settings
 */
const BrandCarousel: React.FC<BrandCarouselProps> = ({
  title,
  subtitle = "Dipercaya oleh 600+ perusahaan di Indonesia",
  logos = brandLogos,
  autoplay = true,
  autoplayDelay = 3000,
  duplicateCount = 2,
  itemBasis = {
    mobile: '1/2',
    tablet: '1/5',
    desktop: '1/7',
  },
  showTitle = true,
}) => {
  const autoplayPlugin = React.useMemo(
    () => autoplay ? Autoplay({
      delay: 5000, // Increased from 3000ms to reduce CPU usage
      stopOnInteraction: true, // Changed from false to save CPU on user interaction
      rootNode: (emblaRoot) => emblaRoot.parentElement,
      stopOnMouseEnter: true,
    }) : null,
    [autoplay, autoplayDelay],
  );

  return (
    <div className="mt-6 md:mt-6 w-full">
      {showTitle && (
        <div className="text-center mb-8 animate-fade-in">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
            {title || subtitle}
          </p>
        </div>
      )}
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
          containScroll: false,
        }}
        plugins={autoplayPlugin ? [autoplayPlugin as any] : []}
        className="w-full"
      >
        <CarouselContent className="py-4">
          {[...Array(duplicateCount)].map((_, copy) => (
            <React.Fragment key={`copy-${copy}`}>
              {logos.map((logo) => (
                <CarouselItem 
                  key={`${copy}-${logo.id}`}
                  className={`basis-${itemBasis.mobile} md:basis-${itemBasis.tablet} lg:basis-${itemBasis.desktop} pl-4`}
                >
                  <BrandLogo logo={logo} />
                </CarouselItem>
              ))}
            </React.Fragment>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default BrandCarousel;
