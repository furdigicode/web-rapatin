
import { useState, useEffect } from 'react';

export const useAnimatedText = (words: string[], interval: number = 3000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsVisible(true);
      }, 300); // Half of the transition duration
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return {
    currentWord: words[currentIndex],
    isVisible
  };
};
