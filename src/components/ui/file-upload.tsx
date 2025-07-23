
import React, { useState, useRef, useCallback } from 'react';
import { Button } from './button';
import { Progress } from './progress';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  accept?: string;
  maxSize?: number; // in bytes
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  currentImage,
  accept = "image/jpeg,image/png,image/webp,image/gif",
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File terlalu besar",
        description: `Ukuran file maksimal ${Math.round(maxSize / 1024 / 1024)}MB`,
      });
      return false;
    }

    const acceptedTypes = accept.split(',').map(type => type.trim());
    if (!acceptedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Format file tidak didukung",
        description: "Hanya menerima file gambar (JPEG, PNG, WebP, GIF)",
      });
      return false;
    }

    return true;
  };

  const compressImage = (file: File, quality: number = 0.8): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1200px width)
        let { width, height } = img;
        const maxWidth = 1200;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Compress image if it's larger than 1MB
      let fileToUpload: File | Blob = file;
      if (file.size > 1024 * 1024) {
        const compressedBlob = await compressImage(file);
        if (compressedBlob) {
          fileToUpload = compressedBlob;
        }
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('blog-covers')
        .upload(fileName, fileToUpload, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-covers')
        .getPublicUrl(fileName);

      setPreview(publicUrl);
      onUploadComplete(publicUrl);

      toast({
        title: "Upload berhasil",
        description: "Gambar cover berhasil diupload",
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload gagal",
        description: error.message || "Terjadi kesalahan saat upload",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Cover preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
            disabled={disabled || isUploading}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={!disabled && !isUploading ? handleBrowseClick : undefined}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <ImageIcon className="w-8 h-8 text-gray-600" />
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drag & drop gambar di sini
              </p>
              <p className="text-sm text-gray-500 mt-1">
                atau klik untuk browse file
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={disabled || isUploading}
              className="gap-2"
            >
              <Upload size={16} />
              Pilih File
            </Button>

            <p className="text-xs text-gray-400">
              Format: JPEG, PNG, WebP, GIF • Maksimal {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Mengupload...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}
    </div>
  );
};
