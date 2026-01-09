'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  submitProduct,
  getExistingCategories,
  getExistingTags,
  type ProductFormData,
} from '@/lib/actions/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, DollarSign, Palette, Ruler, ImageIcon } from 'lucide-react';
import { ImageUpload } from './image-upload';
import { ComboboxInput } from './combobox-input';

interface CategoryTag {
  id: number;
  name: string;
}

export function ProductForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryTag[]>([]);
  const [tags, setTags] = useState<CategoryTag[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    sellingPrice: '',
    artistName: '',
    exhibitionName: '',
    fullDescription: '',
    shortDescription: '',
    length: '',
    width: '',
    medium: '',
  });

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function loadOptions() {
      const [catResult, tagResult] = await Promise.all([
        getExistingCategories(),
        getExistingTags(),
      ]);
      setCategories(catResult.categories);
      setTags(tagResult.tags);
    }
    loadOptions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const artistPayout = formData.sellingPrice
    ? (parseFloat(formData.sellingPrice) * 0.55).toFixed(2)
    : '0.00';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsLoading(true);

    try {
      const productData: ProductFormData = {
        title: formData.title,
        sellingPrice: parseFloat(formData.sellingPrice),
        artistName: formData.artistName,
        exhibitionName: formData.exhibitionName || undefined,
        fullDescription: formData.fullDescription,
        shortDescription: formData.shortDescription,
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        medium: formData.medium,
        images,
      };

      const result = await submitProduct(productData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(
        'Artwork submitted successfully! The gallery will review it shortly.'
      );
      router.push('/products');
      router.refresh();
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-stone-600" />
            <CardTitle className="text-lg">Artwork Details</CardTitle>
          </div>
          <CardDescription>
            Basic information about your artwork
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter artwork title"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artistName">Artist Name</Label>
            <ComboboxInput
              value={formData.artistName}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, artistName: value }))
              }
              options={categories.map((c) => c.name)}
              placeholder="Select or enter artist name"
              disabled={isLoading}
            />
            <p className="text-xs text-stone-500">
              This will be set as a product category
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exhibitionName">Exhibition Name (Optional)</Label>
            <ComboboxInput
              value={formData.exhibitionName}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, exhibitionName: value }))
              }
              options={tags.map((t) => t.name)}
              placeholder="Select or enter exhibition"
              disabled={isLoading}
            />
            <p className="text-xs text-stone-500">
              This will be set as a product tag
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-stone-600" />
            <CardTitle className="text-lg">Pricing</CardTitle>
          </div>
          <CardDescription>
            Set your selling price - you receive 55% of each sale
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price (ZAR)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">
                  R
                </span>
                <Input
                  id="sellingPrice"
                  name="sellingPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="pl-8"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Your Payout (55%)</Label>
              <div className="h-10 px-3 flex items-center bg-green-50 border border-green-200 rounded-md">
                <span className="text-green-700 font-semibold">
                  R{artistPayout}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                This is what you&apos;ll receive when the artwork sells
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
          <CardDescription>Describe your artwork in detail</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shortDescription">
              Short Description (Optional)
            </Label>
            <Textarea
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Brief description for product listings"
              rows={2}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullDescription">Full Description (Optional)</Label>
            <Textarea
              id="fullDescription"
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              placeholder="Detailed description including inspiration, technique, story behind the work..."
              rows={5}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-stone-600" />
            <CardTitle className="text-lg">Specifications</CardTitle>
          </div>
          <CardDescription>Physical details of your artwork</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="length">Length (mm)</Label>
            <Input
              id="length"
              name="length"
              type="number"
              min="1"
              value={formData.length}
              onChange={handleChange}
              placeholder="e.g., 500"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="width">Width (mm)</Label>
            <Input
              id="width"
              name="width"
              type="number"
              min="1"
              value={formData.width}
              onChange={handleChange}
              placeholder="e.g., 400"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="medium">Medium</Label>
            <Input
              id="medium"
              name="medium"
              value={formData.medium}
              onChange={handleChange}
              placeholder="e.g., Oil on Canvas"
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-stone-600" />
            <CardTitle className="text-lg">Images</CardTitle>
          </div>
          <CardDescription>
            Upload up to 3 images of your artwork
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            maxImages={3}
            disabled={isLoading}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-stone-900 hover:bg-stone-800"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Artwork'
          )}
        </Button>
      </div>
    </form>
  );
}
