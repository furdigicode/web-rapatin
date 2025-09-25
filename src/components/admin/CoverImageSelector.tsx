import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

interface CoverImageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string, altText: string) => void;
  initialKeyword?: string;
}

export const CoverImageSelector: React.FC<CoverImageSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialKeyword = ''
}) => {
  const [searchKeyword, setSearchKeyword] = useState(initialKeyword);
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const searchImages = async (keyword: string) => {
    if (!keyword.trim()) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('unsplash-image-search', {
        body: {
          query: keyword,
          orientation: 'landscape',
          per_page: 12
        }
      });

      if (error) throw error;

      // The current function returns single image, we need to modify it to return multiple
      // For now, let's generate multiple searches with variations
      const keywords = [keyword, `${keyword} technology`, `${keyword} business`, `${keyword} modern`];
      const imagePromises = keywords.map(k => 
        supabase.functions.invoke('unsplash-image-search', {
          body: { query: k, orientation: 'landscape', per_page: 3 }
        })
      );

      const results = await Promise.all(imagePromises);
      const allImages: UnsplashImage[] = [];
      
      results.forEach(result => {
        if (result.data && !result.error) {
          // Convert single image response to array format for now
          const mockImage: UnsplashImage = {
            id: Math.random().toString(),
            urls: {
              raw: result.data.imageUrl,
              full: result.data.imageUrl,
              regular: result.data.imageUrl,
              small: result.data.imageUrl,
              thumb: result.data.imageUrl
            },
            alt_description: result.data.altText,
            user: {
              name: result.data.attribution?.photographer || 'Unsplash',
              username: 'unsplash'
            },
            links: {
              html: result.data.attribution?.photographerUrl || 'https://unsplash.com'
            }
          };
          allImages.push(mockImage);
        }
      });

      setImages(allImages);
    } catch (error) {
      console.error('Error searching images:', error);
      toast.error('Failed to search images');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && initialKeyword) {
      setSearchKeyword(initialKeyword);
      searchImages(initialKeyword);
    }
  }, [isOpen, initialKeyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchImages(searchKeyword);
  };

  const handleImageSelect = (image: UnsplashImage) => {
    const imageUrl = `${image.urls.raw}&w=1200&h=630&fit=crop&crop=entropy&auto=format&q=80`;
    onSelect(imageUrl, image.alt_description || `Image related to ${searchKeyword}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Select Cover Image
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search for images..."
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
          </form>

          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Searching images...</span>
              </div>
            )}

            {!isLoading && images.length === 0 && searchKeyword && (
              <div className="text-center py-12 text-muted-foreground">
                No images found. Try a different keyword.
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <Card
                  key={image.id}
                  className={`cursor-pointer transition-all hover:shadow-lg overflow-hidden ${
                    selectedImage === image.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => {
                    setSelectedImage(image.id);
                    handleImageSelect(image);
                  }}
                >
                  <div className="aspect-video relative">
                    <img
                      src={image.urls.small}
                      alt={image.alt_description || 'Unsplash image'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                      <p className="text-white text-xs truncate">
                        Photo by {image.user.name}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};