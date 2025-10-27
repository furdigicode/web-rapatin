import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MetaPixelSettings {
  pixel_id: string;
  enabled: boolean;
  track_page_view: boolean;
}

// Extend existing Window interface
declare global {
  interface Window {
    __fbq_initialized?: boolean;
  }
}

export const useMetaPixel = () => {
  useEffect(() => {
    let isSubscribed = true;

    const initializePixel = (settings: MetaPixelSettings) => {
      if (!settings.enabled || !settings.pixel_id) return;

      // Initialize fbq if not already done
      if (!window.__fbq_initialized) {
        // Create fbq function
        const fbqFunction = function(action: string, ...args: any[]) {
          if (!(fbqFunction as any).queue) {
            (fbqFunction as any).queue = [];
          }
          (fbqFunction as any).queue.push([action, ...args]);
        };

        window.fbq = fbqFunction;
        window._fbq = window.fbq;

        // Load Facebook Pixel script
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        document.head.appendChild(script);

        window.__fbq_initialized = true;
      }

      // Initialize pixel
      window.fbq('init', settings.pixel_id);

      // Track page view if enabled
      if (settings.track_page_view) {
        window.fbq('track', 'PageView');
      }
    };

    const fetchAndInitialize = async () => {
      try {
        const { data, error } = await supabase
          .from('meta_pixel_settings')
          .select('pixel_id, enabled, track_page_view')
          .maybeSingle();

        if (error) {
          console.error('Error fetching pixel settings:', error);
          return;
        }

        if (data && isSubscribed) {
          initializePixel(data);
        }
      } catch (error) {
        console.error('Error initializing pixel:', error);
      }
    };

    // Defer initialization until after page load for better performance
    const deferredInit = () => {
      fetchAndInitialize();
    };
    
    if (document.readyState === 'complete') {
      deferredInit();
    } else {
      window.addEventListener('load', deferredInit);
    }

    // Subscribe to real-time changes
    const channel = supabase
      .channel('meta_pixel_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meta_pixel_settings'
        },
        (payload) => {
          if (payload.new && isSubscribed) {
            initializePixel(payload.new as MetaPixelSettings);
          }
        }
      )
      .subscribe();

    return () => {
      isSubscribed = false;
      window.removeEventListener('load', deferredInit);
      supabase.removeChannel(channel);
    };
  }, []);
};