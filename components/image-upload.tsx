'use client';

import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 3,
  disabled = false,
}: ImageUploadProps) {
  const [isCompressing, setIsCompressing] = useState(false);

  const compressImage = async (file: File): Promise<string> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/jpeg' as const,
    };

    try {
      const compressedFile = await imageCompression(file, options);

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(compressedFile);
      });
    } catch (error) {
      console.error('Image compression error:', error);
      throw new Error('Failed to compress image');
    }
  };

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const remainingSlots = maxImages - images.length;
      if (remainingSlots <= 0) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      setIsCompressing(true);

      try {
        const compressedImages = await Promise.all(
          filesToProcess.map(async (file) => {
            // Validate file type
            if (!file.type.startsWith('image/')) {
              throw new Error(`${file.name} is not an image`);
            }
            return compressImage(file);
          })
        );

        onImagesChange([...images, ...compressedImages]);
        toast.success(`${compressedImages.length} image(s) uploaded`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to process images'
        );
      } finally {
        setIsCompressing(false);
        // Reset input
        e.target.value = '';
      }
    },
    [images, maxImages, onImagesChange]
  );

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-50"
            >
              <Image
                src={image}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                disabled={disabled}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-2 left-2 px-2 py-1 bg-stone-900/80 text-white text-xs rounded">
                  Featured
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {images.length < maxImages && (
        <div
          className={cn(
            'border-2 border-dashed border-stone-300 rounded-lg p-8 text-center transition-colors',
            !disabled && 'hover:border-stone-400 cursor-pointer',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={disabled || isCompressing}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={cn(
              'flex flex-col items-center gap-3',
              !disabled && !isCompressing && 'cursor-pointer'
            )}
          >
            {isCompressing ? (
              <>
                <Loader2 className="h-10 w-10 text-stone-400 animate-spin" />
                <span className="text-sm text-stone-600">
                  Compressing images...
                </span>
              </>
            ) : (
              <>
                <ImagePlus className="h-10 w-10 text-stone-400" />
                <div>
                  <span className="text-sm font-medium text-stone-700">
                    Click to upload images
                  </span>
                  <p className="text-xs text-stone-500 mt-1">
                    {images.length}/{maxImages} images • Max 1920px • JPG, PNG,
                    WebP
                  </p>
                </div>
              </>
            )}
          </label>
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-stone-500">
        Images will be automatically compressed to a maximum of 1920px for
        optimal web performance. The first image will be set as the featured
        image.
      </p>
    </div>
  );
}
