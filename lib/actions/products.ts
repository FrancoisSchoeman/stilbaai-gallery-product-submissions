'use server';

import { db } from '@/lib/db';
import { productSubmissions, userProfiles } from '@/lib/db/schema';
import { getServerSession } from '@/lib/auth-server';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  findOrCreateCategory,
  findOrCreateTag,
  createProduct,
  uploadMedia,
  getCategories,
  getTags,
  getProductsBatch,
} from '@/lib/woocommerce';
import { sendProductSubmissionEmail } from './email';

const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  sellingPrice: z.number().min(1, 'Selling price must be greater than 0'),
  artistName: z.string().min(1, 'Artist name is required'),
  exhibitionName: z.string().optional(),
  fullDescription: z.string().optional(),
  shortDescription: z.string().optional(),
  length: z.number().min(1, 'Length is required'),
  width: z.number().min(1, 'Width is required'),
  medium: z.string().min(1, 'Medium is required'),
  images: z
    .array(z.string())
    .min(1, 'At least one image is required')
    .max(3, 'Maximum 3 images'),
});

export type ProductFormData = z.infer<typeof productSchema>;

export async function getExistingCategories() {
  try {
    const categories = await getCategories();
    return { categories: categories.map((c) => ({ id: c.id, name: c.name })) };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { categories: [] };
  }
}

export async function getExistingTags() {
  try {
    const tags = await getTags();
    return { tags: tags.map((t) => ({ id: t.id, name: t.name })) };
  } catch (error) {
    console.error('Error fetching tags:', error);
    return { tags: [] };
  }
}

// Map WooCommerce status to local display status
function mapWcStatusToLocal(wcStatus: string): string {
  switch (wcStatus) {
    case 'publish':
      return 'approved';
    case 'draft':
    case 'pending':
      return 'submitted';
    case 'private':
      return 'approved';
    case 'trash':
      return 'rejected';
    default:
      return 'submitted';
  }
}

export async function syncUserProducts() {
  const session = await getServerSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  try {
    // Get all user's products from local DB
    const localProducts = await db.query.productSubmissions.findMany({
      where: eq(productSubmissions.userId, session.user.id),
    });

    if (localProducts.length === 0) {
      return { synced: 0, deleted: 0 };
    }

    // Get WC product IDs
    const wcProductIds = localProducts
      .map((p) => p.wcProductId)
      .filter((id): id is number => id !== null);

    if (wcProductIds.length === 0) {
      return { synced: 0, deleted: 0 };
    }

    // Fetch products from WooCommerce
    const wcProducts = await getProductsBatch(wcProductIds);

    let synced = 0;
    let deleted = 0;

    for (const localProduct of localProducts) {
      if (!localProduct.wcProductId) continue;

      const wcProduct = wcProducts.get(localProduct.wcProductId);

      if (!wcProduct) {
        // Product no longer exists in WooCommerce - delete from local DB
        await db
          .delete(productSubmissions)
          .where(eq(productSubmissions.id, localProduct.id));
        deleted++;
      } else {
        // Update local status based on WC status
        const newStatus = mapWcStatusToLocal(wcProduct.status);
        if (localProduct.status !== newStatus) {
          await db
            .update(productSubmissions)
            .set({ status: newStatus })
            .where(eq(productSubmissions.id, localProduct.id));
          synced++;
        }
      }
    }

    revalidatePath('/products');
    return { synced, deleted };
  } catch (error) {
    console.error('Error syncing products:', error);
    return { error: 'Failed to sync products' };
  }
}

export async function getUserProducts() {
  const session = await getServerSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  // Sync products with WooCommerce first
  await syncUserProducts();

  const products = await db.query.productSubmissions.findMany({
    where: eq(productSubmissions.userId, session.user.id),
    orderBy: [desc(productSubmissions.createdAt)],
  });

  return { products };
}

export async function submitProduct(data: ProductFormData) {
  const session = await getServerSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  // Check if profile is complete
  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, session.user.id),
  });

  if (!profile?.isComplete) {
    return { error: 'Please complete your profile first' };
  }

  const validation = productSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  try {
    const {
      title,
      sellingPrice,
      artistName,
      exhibitionName,
      fullDescription,
      shortDescription,
      length,
      width,
      medium,
      images,
    } = validation.data;

    // Calculate artist payout (55%)
    const artistPayout = (sellingPrice * 0.55).toFixed(2);

    // 1. Upload images to WordPress
    const imageIds: number[] = [];
    for (let i = 0; i < images.length; i++) {
      const filename = `${title.replace(/\s+/g, '-').toLowerCase()}-${
        i + 1
      }-${Date.now()}.jpg`;
      const mediaId = await uploadMedia(images[i], filename);
      imageIds.push(mediaId);
    }

    // 2. Find or create category for artist name
    const categoryId = await findOrCreateCategory(artistName);

    // 3. Find or create tag for exhibition name (if provided)
    let tagId: number | undefined;
    if (exhibitionName && exhibitionName.trim()) {
      tagId = await findOrCreateTag(exhibitionName.trim());
    }

    // 4. Build short description with dimensions and medium
    const specsLine = `MEDIUM: ${medium}\nDIMENSIONS: ${length} x ${width}mm`;
    const enhancedShortDescription = shortDescription
      ? `${shortDescription}\n\n${specsLine}`
      : specsLine;

    // 5. Create product in WooCommerce as draft
    const wcProduct = await createProduct({
      name: title,
      description: fullDescription || '',
      shortDescription: enhancedShortDescription,
      regularPrice: sellingPrice.toString(),
      categoryId,
      tagId,
      imageIds,
    });

    // 6. Save to local database
    await db.insert(productSubmissions).values({
      userId: session.user.id,
      wcProductId: wcProduct.id,
      title,
      artistName,
      exhibitionName: exhibitionName || null,
      sellingPrice: sellingPrice.toString(),
      artistPayout,
      status: 'submitted',
    });

    // 7. Send email notification to admin
    await sendProductSubmissionEmail({
      artistName: `${profile.name} ${profile.surname}`,
      artistEmail: session.user.email,
      productTitle: title,
      sellingPrice: sellingPrice.toFixed(2),
      artistPayout,
      exhibitionName,
    });

    revalidatePath('/profile');
    revalidatePath('/products');

    return { success: true, productId: wcProduct.id };
  } catch (error) {
    console.error('Error submitting product:', error);
    return { error: 'Failed to submit product. Please try again.' };
  }
}
