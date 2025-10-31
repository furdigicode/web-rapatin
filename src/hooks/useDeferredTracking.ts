import { useEffect } from 'react';

/**
 * Defers Meta Pixel tracking initialization until user interaction
 * or after 3 seconds to improve FCP and TBT
 */
export const useDeferredTracking = () => {
  useEffect(() => {
    let initialized = false;

    const initTracking = () => {
      if (initialized) return;
      initialized = true;
      
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'PageView');
      }
    };

    // Defer until first user interaction or 3 seconds
    const timeout = setTimeout(initTracking, 3000);
    const events = ['mousedown', 'touchstart', 'keydown', 'scroll'];
    
    const handleInteraction = () => {
      clearTimeout(timeout);
      initTracking();
      events.forEach(e => document.removeEventListener(e, handleInteraction, { passive: true } as any));
    };
    
    events.forEach(e => document.addEventListener(e, handleInteraction, { passive: true }));
    
    return () => {
      clearTimeout(timeout);
      events.forEach(e => document.removeEventListener(e, handleInteraction, { passive: true } as any));
    };
  }, []);
};
