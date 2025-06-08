
import React from 'react';
import { useAnimatedText } from '@/hooks/useAnimatedText';

interface AnimatedTextProps {
  words: string[];
  interval?: number;
  className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  words, 
  interval = 3000, 
  className = "" 
}) => {
  const { currentWord, isVisible } = useAnimatedText(words, interval);

  return (
    <span 
      className={`inline-block text-transition ${
        isVisible ? 'animate-text-fade-in' : 'animate-text-fade-out'
      } ${className}`}
      style={{ minWidth: '200px' }}
    >
      {currentWord}
    </span>
  );
};

export default AnimatedText;
