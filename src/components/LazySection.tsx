import { useEffect, useRef, useState, ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  fallbackHeight?: string;
}

/**
 * LazySection Component
 * Renders children only when they enter the viewport using Intersection Observer
 * Optimizes performance by deferring below-the-fold content
 */
export const LazySection: React.FC<LazySectionProps> = ({ 
  children, 
  threshold = 0.1,
  rootMargin = '100px',
  fallbackHeight = '400px'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? children : <div style={{ minHeight: fallbackHeight }} className="animate-pulse bg-muted/10" />}
    </div>
  );
};
