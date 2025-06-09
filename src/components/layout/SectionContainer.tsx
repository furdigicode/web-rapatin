
import React from 'react';

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'accent' | 'gradient-up' | 'gradient-down';
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  className = '',
  id,
  background = 'default'
}) => {
  const backgroundClasses = {
    default: 'bg-background',
    accent: 'bg-accent/20',
    'gradient-up': 'bg-gradient-to-b from-background to-accent/20',
    'gradient-down': 'bg-gradient-to-b from-accent/20 to-background'
  };

  return (
    <section 
      id={id}
      className={`py-20 ${backgroundClasses[background]} ${className}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;
