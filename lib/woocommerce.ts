const WC_URL = process.env.WP_URL;
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

interface WCCategory {
  id: number;
  name: string;
  slug: string;
}

interface WCTag {
  id: number;
  name: string;
  slug: string;
}

interface WCProduct {
  id: number;
  name: string;
  status: string;
  type: string;
  description: string;
  short_description: string;
  regular_price: string;
  categories: { id: number }[];
  tags: { id: number }[];
  images: { id: number; src: string }[];
}

function getAuthHeader() {
  const credentials = Buffer.from(
    `${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`
  ).toString('base64');
  return `Basic ${credentials}`;
}

async function wcFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${WC_URL}/wp-json/wc/v3${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: getAuthHeader(),
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('WooCommerce API Error:', errorText);
    throw new Error(`WooCommerce API error: ${response.status}`);
  }

  return response.json();
}

// ============================================
// Categories (for Artist Names)
// ============================================

export async function getCategories(): Promise<WCCategory[]> {
  return wcFetch<WCCategory[]>('/products/categories?per_page=100');
}

export async function findOrCreateCategory(name: string): Promise<number> {
  // First, try to find existing category
  const categories = await getCategories();
  const existing = categories.find(
    (cat) => cat.name.toLowerCase() === name.toLowerCase()
  );

  if (existing) {
    return existing.id;
  }

  // Create new category
  const newCategory = await wcFetch<WCCategory>('/products/categories', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });

  return newCategory.id;
}

// ============================================
// Tags (for Exhibition Names)
// ============================================

export async function getTags(): Promise<WCTag[]> {
  return wcFetch<WCTag[]>('/products/tags?per_page=100');
}

export async function findOrCreateTag(name: string): Promise<number> {
  // First, try to find existing tag
  const tags = await getTags();
  const existing = tags.find(
    (tag) => tag.name.toLowerCase() === name.toLowerCase()
  );

  if (existing) {
    return existing.id;
  }

  // Create new tag
  const newTag = await wcFetch<WCTag>('/products/tags', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });

  return newTag.id;
}

// ============================================
// Products
// ============================================

export interface CreateProductData {
  name: string;
  description: string;
  shortDescription: string;
  regularPrice: string;
  categoryId: number;
  tagId?: number;
  imageIds: number[];
}

export async function getProduct(productId: number): Promise<WCProduct | null> {
  try {
    return await wcFetch<WCProduct>(`/products/${productId}`);
  } catch {
    // Product doesn't exist or was deleted
    return null;
  }
}

export async function getProductsBatch(
  productIds: number[]
): Promise<Map<number, WCProduct>> {
  const results = new Map<number, WCProduct>();

  if (productIds.length === 0) return results;

  try {
    // WooCommerce allows filtering by include param
    const products = await wcFetch<WCProduct[]>(
      `/products?include=${productIds.join(',')}&per_page=100`
    );

    for (const product of products) {
      results.set(product.id, product);
    }
  } catch (error) {
    console.error('Error fetching products batch:', error);
  }

  return results;
}

export async function createProduct(
  data: CreateProductData
): Promise<WCProduct> {
  const productData: Record<string, unknown> = {
    name: data.name,
    type: 'simple',
    status: 'draft',
    description: data.description,
    short_description: data.shortDescription,
    regular_price: data.regularPrice,
    categories: [{ id: data.categoryId }],
    images: data.imageIds.map((id) => ({ id })),
  };

  if (data.tagId) {
    productData.tags = [{ id: data.tagId }];
  }

  return wcFetch<WCProduct>('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
}

// ============================================
// Media Upload
// ============================================

export async function uploadMedia(
  imageData: string, // Base64 encoded image
  filename: string
): Promise<number> {
  const WP_MEDIA_URL =
    process.env.WP_MEDIA_URL || `${WC_URL}/wp-json/wp/v2/media`;
  const WP_USERNAME = process.env.WP_USERNAME;
  const WP_PASSWORD = process.env.WP_PASSWORD;

  // Convert base64 to buffer
  const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  // Determine content type from filename or base64 header
  let contentType = 'image/jpeg';
  if (imageData.includes('data:image/png')) {
    contentType = 'image/png';
  } else if (imageData.includes('data:image/webp')) {
    contentType = 'image/webp';
  }

  const credentials = Buffer.from(`${WP_USERNAME}:${WP_PASSWORD}`).toString(
    'base64'
  );

  const response = await fetch(WP_MEDIA_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
    body: buffer,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('WordPress Media Upload Error:', errorText);
    throw new Error(`Media upload failed: ${response.status}`);
  }

  const mediaResponse = await response.json();
  return mediaResponse.id;
}
