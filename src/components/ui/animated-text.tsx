
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
  const { currentWord, isTyping } = useAnimatedText(words, interval);

  return (
    <span 
      className={`inline-block ${className}`}
      style={{ minWidth: '200px' }}
    >
      {currentWord}
      {isTyping && (
        <span className="animate-pulse ml-1 text-primary">|</span>
      )}
    </span>
  );
};

export default AnimatedText;
