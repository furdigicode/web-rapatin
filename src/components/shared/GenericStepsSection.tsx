
import React from 'react';
import SectionContainer from '@/components/layout/SectionContainer';
import { HowItWorksContent } from '@/types/ProductPageTypes';

interface GenericStepsSectionProps {
  content: HowItWorksContent;
  sectionId?: string;
}

const GenericStepsSection: React.FC<GenericStepsSectionProps> = ({ 
  content, 
  sectionId = "how-it-works" 
}) => {
  return (
    <SectionContainer id={sectionId} background="gradient-down">
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

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {content.steps.map((step, index) => (
          <div key={index} className="glass p-6 rounded-xl transition-all duration-300 hover:shadow-elevation animate-fade-in delay-100">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4 text-white">
              <span className="font-bold">{step.number}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default GenericStepsSection;
