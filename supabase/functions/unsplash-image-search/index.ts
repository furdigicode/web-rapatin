
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const unsplashAccessKey = Deno.env.get('UNSPLASH_ACCESS_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UnsplashImageRequest {
  query: string;
  orientation?: 'landscape' | 'portrait' | 'squarish';
  per_page?: number;
}

interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
}

const searchUnsplashImages = async (query: string, orientation: string = 'landscape', perPage: number = 10): Promise<UnsplashImage[]> => {
  if (!unsplashAccessKey) {
    throw new Error('Unsplash Access Key not configured');
  }

  const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=${perPage}&content_filter=high`;
  
  const response = await fetch(searchUrl, {
    headers: {
      'Authorization': `Client-ID ${unsplashAccessKey}`,
      'Accept-Version': 'v1',
    },
  });

  if (!response.ok) {
    throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.results || [];
};

const getFallbackImage = (keyword: string): string => {
  // Fallback images from useful-context
  const fallbackImages = [
    'photo-1649972904349-6e44c42644a7', // woman with laptop
    'photo-1488590528505-98d2b5aba04b', // gray laptop
    'photo-1531297484001-80022131f5a1', // laptop on surface
    'photo-1498050108023-c5249f4df085', // MacBook with code
    'photo-1721322800607-8c38375eef04', // living room
  ];
  
  const randomIndex = Math.floor(Math.random() * fallbackImages.length);
  const imageId = fallbackImages[randomIndex];
  
  return `https://images.unsplash.com/${imageId}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=630&q=80`;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Unsplash image search called');
    
    const request: UnsplashImageRequest = await req.json();
    console.log('Search request:', request);
    
    if (!request.query) {
      throw new Error('Search query is required');
    }

    let images: UnsplashImage[] = [];
    let selectedImageUrl = '';

    try {
      // Search for images on Unsplash
      images = await searchUnsplashImages(
        request.query,
        request.orientation || 'landscape',
        request.per_page || 10
      );
      
      if (images.length > 0) {
        // Select the first high-quality image
        const selectedImage = images[0];
        // Use regular size with custom dimensions for blog cover (1200x630 is ideal for blog covers)
        selectedImageUrl = `${selectedImage.urls.raw}&w=1200&h=630&fit=crop&crop=entropy&auto=format&q=80`;
        
        console.log('Found Unsplash image:', selectedImageUrl);
        
        return new Response(JSON.stringify({
          imageUrl: selectedImageUrl,
          altText: selectedImage.alt_description || `Image related to ${request.query}`,
          attribution: {
            photographer: selectedImage.user.name,
            photographerUrl: selectedImage.links.html,
            source: 'Unsplash'
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        throw new Error('No images found on Unsplash');
      }
    } catch (unsplashError) {
      console.log('Unsplash search failed, using fallback:', unsplashError);
      
      // Use fallback image
      selectedImageUrl = getFallbackImage(request.query);
      
      return new Response(JSON.stringify({
        imageUrl: selectedImageUrl,
        altText: `Image related to ${request.query}`,
        attribution: {
          photographer: 'Unsplash',
          photographerUrl: 'https://unsplash.com',
          source: 'Unsplash'
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
  } catch (error: any) {
    console.error('Error in unsplash-image-search function:', error);
    
    // Return fallback image even on complete failure
    const fallbackUrl = getFallbackImage('default');
    
    return new Response(JSON.stringify({
      imageUrl: fallbackUrl,
      altText: 'Default blog cover image',
      attribution: {
        photographer: 'Unsplash',
        photographerUrl: 'https://unsplash.com',
        source: 'Unsplash'
      },
      error: error.message
    }), {
      status: 200, // Return 200 even on error since we have fallback
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
