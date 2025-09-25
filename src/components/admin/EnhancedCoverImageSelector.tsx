import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X, ExternalLink } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { CoverImageSelector } from "@/components/admin/CoverImageSelector";
import { useToast } from "@/hooks/use-toast";

interface EnhancedCoverImageSelectorProps {
  value: string;
  onChange: (url: string) => void;
  onImageUploaded?: (url: string) => void;
}

type InputMethod = 'url' | 'upload' | 'unsplash';

export const EnhancedCoverImageSelector: React.FC<EnhancedCoverImageSelectorProps> = ({
  value,
  onChange,
  onImageUploaded
}) => {
  const [selectedMethod, setSelectedMethod] = useState<InputMethod>('url');
  const [urlInput, setUrlInput] = useState('');
  const [isUnsplashOpen, setIsUnsplashOpen] = useState(false);
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  const { toast } = useToast();

  const validateImageUrl = async (url: string) => {
    setIsValidatingUrl(true);
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.startsWith('image/')) {
          onChange(url);
          setUrlInput('');
          toast({
            title: "Success",
            description: "Image URL validated and set successfully.",
          });
        } else {
          throw new Error('URL does not point to an image');
        }
      } else {
        throw new Error('Unable to access the image URL');
      }
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL that is publicly accessible.",
        variant: "destructive",
      });
    } finally {
      setIsValidatingUrl(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    
    try {
      new URL(urlInput);
      validateImageUrl(urlInput);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL format.",
        variant: "destructive",
      });
    }
  };

  const handleUnsplashSelect = (imageUrl: string) => {
    onChange(imageUrl);
    setIsUnsplashOpen(false);
  };

  const clearImage = () => {
    onChange('');
    setUrlInput('');
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="cover-image" className="text-sm font-medium">
          Cover Image
        </Label>
        
        {value && (
          <div className="mt-2 relative">
            <img
              src={value}
              alt="Cover preview"
              className="w-full h-48 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <RadioGroup
          value={selectedMethod}
          onValueChange={(value: InputMethod) => setSelectedMethod(value)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="url" id="url" />
            <Label htmlFor="url" className="text-sm font-normal cursor-pointer">
              Insert URL
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upload" id="upload" />
            <Label htmlFor="upload" className="text-sm font-normal cursor-pointer">
              Upload Image
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unsplash" id="unsplash" />
            <Label htmlFor="unsplash" className="text-sm font-normal cursor-pointer">
              Browse Unsplash
            </Label>
          </div>
        </RadioGroup>

        {selectedMethod === 'url' && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Enter image URL..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim() || isValidatingUrl}
                size="sm"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                {isValidatingUrl ? 'Validating...' : 'Set URL'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter a direct link to an image (JPG, PNG, WebP, etc.)
            </p>
          </div>
        )}

        {selectedMethod === 'upload' && (
          <FileUpload
            onUploadComplete={(url) => {
              onChange(url);
              onImageUploaded?.(url);
            }}
            currentImage={value}
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
          />
        )}

        {selectedMethod === 'unsplash' && (
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUnsplashOpen(true)}
              className="w-full"
            >
              Browse Unsplash Images
            </Button>
            <p className="text-xs text-muted-foreground">
              Search and select high-quality images from Unsplash
            </p>
          </div>
        )}
      </div>

      <CoverImageSelector
        isOpen={isUnsplashOpen}
        onClose={() => setIsUnsplashOpen(false)}
        onSelect={handleUnsplashSelect}
      />
    </div>
  );
};