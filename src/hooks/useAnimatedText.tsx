
import { useState, useEffect } from 'react';

export const useAnimatedText = (words: string[], interval: number = 3000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentWord = words[currentIndex];
    let charIndex = 0;
    
    // Clear text first
    setDisplayText('');
    setIsTyping(true);
    
    // Type out the current word
    const typeInterval = setInterval(() => {
      if (charIndex <= currentWord.length) {
        setDisplayText(currentWord.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        
        // Wait before starting to type the next word
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, interval - 1000); // Leave 1 second at the end before switching
      }
    }, 100); // Type each character every 100ms

    return () => clearInterval(typeInterval);
  }, [currentIndex, words, interval]);

  return {
    currentWord: displayText,
    isTyping
  };
};
