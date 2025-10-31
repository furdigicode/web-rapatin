import React from 'react';
import OptimizedImage from '@/components/ui/optimized-image';
import { BrandLogo as BrandLogoType } from '@/data/brandLogos';

interface BrandLogoProps {
  logo: BrandLogoType;
  className?: string;
  imageClassName?: string;
}

/**
 * BrandLogo Component
 * 
 * Renders a single brand logo with consistent styling:
 * - Grayscale by default, colored on hover
 * - Opacity transitions
 * - Optimized lazy loading
 * - Proper width/height to prevent CLS
 */
const BrandLogo: React.FC<BrandLogoProps> = ({ 
  logo, 
  className = "flex items-center justify-center h-16 grayscale hover:grayscale-0 transition-all duration-300",
  imageClassName 
}) => {
  const defaultImageClass = logo.height === 64 
    ? "h-16 object-contain opacity-70 hover:opacity-100"
    : "h-12 object-contain opacity-70 hover:opacity-100";

  return (
    <div className={className}>
      <OptimizedImage
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className={imageClassName || defaultImageClass}
      />
    </div>
  );
};

export default BrandLogo;
