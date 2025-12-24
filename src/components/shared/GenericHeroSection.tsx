import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OptimizedImage from "@/components/ui/optimized-image";
import * as LucideIcons from "lucide-react";
import { HeroContent } from "@/types/ProductPageTypes";
interface GenericHeroSectionProps {
  content: HeroContent;
  onPrimaryCTA?: () => void;
  showBrands?: boolean;
}
const GenericHeroSection: React.FC<GenericHeroSectionProps> = ({
  content,
  onPrimaryCTA,
  showBrands = true
}) => {
  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={18} className="text-primary" /> : null;
  };
  return <section className="pt-28 pb-12 md:pt-32 md:pb-24 overflow-hidden bg-hero-pattern flex flex-col items-center">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center">
        <div className="inline-flex items-center py-1 px-4 bg-accent/70 rounded-full backdrop-blur-sm mt-0 mb-4 animate-fade-in mx-auto">
          <span className="text-xs font-medium text-primary text-center">{content.badge}</span>
        </div>

        <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-center mb-4 max-w-4xl animate-fade-in" dangerouslySetInnerHTML={{
        __html: content.title
      }} />

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-center mb-8 animate-fade-in">
          {content.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-2 mb-8 justify-center animate-fade-in">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-lg h-12 px-8" onClick={onPrimaryCTA}>
            {content.primaryCTA.text}
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-lg h-12 px-8">
            <a href={content.secondaryCTA.href}>{content.secondaryCTA.text}</a>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-4xl w-full mx-auto pt-2 animate-fade-in">
          {content.highlights.map((highlight, index) => <div key={index} className="flex items-center gap-2 text-sm justify-center">
              {getIcon(highlight.icon)}
              <span>{highlight.text}</span>
            </div>)}
        </div>

        <div className="max-w-full mt-8 mb-10 animate-slide-in-right">
          <OptimizedImage alt={content.image.alt} width={1200} height={675} priority className="w-full rounded-2xl shadow-elevation border border-white/40 object-cover" style={{
          background: "rgba(255,255,255,0.9)",
          maxHeight: "800px"
        }} src="/lovable-uploads/1f539329-e4f7-47dd-a8d5-bd1c26944fe8.png" />
        </div>
      </div>
    </section>;
};
export default GenericHeroSection;