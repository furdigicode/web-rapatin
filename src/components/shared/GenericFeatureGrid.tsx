
import React from 'react';
import * as LucideIcons from 'lucide-react';
import SectionContainer from '@/components/layout/SectionContainer';
import { FeatureContent } from '@/types/ProductPageTypes';

interface GenericFeatureGridProps {
  content: FeatureContent;
}

const GenericFeatureGrid: React.FC<GenericFeatureGridProps> = ({ content }) => {
  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={22} /> : null;
  };

  return (
    <SectionContainer id="features" background="gradient-up">
      <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
        <div className="inline-flex items-center py-1 px-4 bg-accent rounded-full mb-4">
          <span className="text-xs font-medium text-primary">{content.badge}</span>
        </div>
        <h2 
          className="text-3xl md:text-4xl font-bold mb-4"
          dangerouslySetInnerHTML={{ __html: content.title }}
        />
        <p className="text-muted-foreground text-lg">
          {content.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.features.map((feature, index) => (
          <div key={index} className={`glass p-6 rounded-xl transition-all duration-300 hover:shadow-elevation animate-fade-in ${feature.delay}`}>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              {getIcon(feature.icon)}
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 max-w-3xl mx-auto glass p-8 rounded-xl animate-fade-in shadow-soft">
        <h3 
          className="text-2xl font-bold mb-6 text-center"
          dangerouslySetInnerHTML={{ __html: content.useCases.title }}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {content.useCases.items.map((useCase, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
                {getIcon(useCase.icon)}
              </div>
              <p className="font-medium text-sm">{useCase.title}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default GenericFeatureGrid;
