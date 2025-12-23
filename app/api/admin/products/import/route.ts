import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

interface ProductImportData {
  name: string;
  brand: string;
  category: string;
  price: number;
  specs?: string;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'PREORDER';
  variants?: Array<{
    name: string;
    price: number;
    sku?: string;
  }>;
  tags?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { products, mode = 'preview' } = await request.json();

    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ error: 'Invalid products data' }, { status: 400 });
    }

    // Preview mode - validate and return parsed data
    if (mode === 'preview') {
      const validated = await validateProducts(products);
      return NextResponse.json({ 
        success: true, 
        products: validated.valid,
        errors: validated.errors,
        summary: {
          total: products.length,
          valid: validated.valid.length,
          invalid: validated.errors.length
        }
      });
    }

    // Import mode - actually create products
    if (mode === 'import') {
      const results = await importProducts(products);
      return NextResponse.json({
        success: true,
        imported: results.success,
        failed: results.failed,
        summary: {
          total: products.length,
          successful: results.success.length,
          failed: results.failed.length
        }
      });
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to process import' },
      { status: 500 }
    );
  }
}

async function validateProducts(products: ProductImportData[]) {
  const valid: ProductImportData[] = [];
  const errors: Array<{ index: number; product: ProductImportData; error: string }> = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    
    // Validation rules
    if (!product.name || product.name.trim() === '') {
      errors.push({ index: i, product, error: 'Name is required' });
      continue;
    }

    if (!product.price || product.price <= 0) {
      errors.push({ index: i, product, error: 'Valid price is required' });
      continue;
    }

    if (!product.brand || product.brand.trim() === '') {
      errors.push({ index: i, product, error: 'Brand is required' });
      continue;
    }

    if (!product.category || product.category.trim() === '') {
      errors.push({ index: i, product, error: 'Category is required' });
      continue;
    }

    valid.push(product);
  }

  return { valid, errors };
}

async function importProducts(products: ProductImportData[]) {
  const success: Array<{ name: string; id: string }> = [];
  const failed: Array<{ product: ProductImportData; error: string }> = [];

  for (const productData of products) {
    try {
      // Get or create category
      const category = await prisma.category.upsert({
        where: { slug: slugify(productData.category) },
        update: {},
        create: {
          name: productData.category,
          slug: slugify(productData.category),
          description: `${productData.category} products`,
        },
      });

      // Create product
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          slug: slugify(productData.name),
          description: productData.specs || `${productData.brand} ${productData.name}`,
          price: productData.price,
          originalPrice: productData.price * 1.2,
          categoryId: category.id,
          brand: productData.brand,
          sku: generateSKU(productData.brand, productData.name),
          stock: productData.stockStatus === 'IN_STOCK' ? 10 : 0,
          inStock: productData.stockStatus === 'IN_STOCK',
          featured: false,
          specs: productData.specs ? parseSpecs(productData.specs) : {},
          images: ['/images/placeholder.jpg'],
        },
      });

      // Inventory is tracked via `stock` and `inStock` fields on Product

      // Create variants if provided
      if (productData.variants && productData.variants.length > 0) {
        for (const variantData of productData.variants) {
          await prisma.productVariant.create({
            data: {
              productId: product.id,
              name: variantData.name,
              sku: variantData.sku || generateSKU(productData.brand, `${productData.name}-${variantData.name}`),
              price: variantData.price,
              originalPrice: variantData.price * 1.2,
              stock: productData.stockStatus === 'IN_STOCK' ? 10 : 0,
              inStock: productData.stockStatus === 'IN_STOCK',
              active: true,
            },
          });
        }
      }

      success.push({ name: product.name, id: product.id });
    } catch (error) {
      console.error('Failed to import product:', productData.name, error);
      failed.push({ 
        product: productData, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  return { success, failed };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateSKU(brand: string, name: string): string {
  const brandCode = brand.substring(0, 3).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${brandCode}-${random}`;
}

function parseSpecs(specs: string): Record<string, string> {
  const specObj: Record<string, string> = {};
  const parts = specs.split(' ');
  
  // Try to extract common specs
  for (const part of parts) {
    if (part.includes('GB') && part.includes('RAM')) {
      specObj['RAM'] = part;
    } else if (part.includes('GB') || part.includes('TB')) {
      specObj['Storage'] = part;
    } else if (part.includes('GEN')) {
      specObj['Generation'] = part;
    } else if (part.includes('"')) {
      specObj['Screen Size'] = part;
    }
  }
  
  return specObj;
}
