import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const productData = [
  // LENOVO
  { name: 'LENOVO V15 CELERON N4500 8GB 256GB', brand: 'LENOVO', category: 'Laptops', subcategory: 'LENOVO', price: 305, stockStatus: 'OUT_OF_STOCK', specs: 'Celeron N4500, 8GB RAM, 256GB SSD, 15.6"' },
  { name: 'LENOVO IDEAPAD CELERON N4500 8GB 256GB 15.6"', brand: 'LENOVO', category: 'Laptops', subcategory: 'LENOVO', price: 305, stockStatus: 'OUT_OF_STOCK', specs: 'Celeron N4500, 8GB RAM, 256GB SSD, 15.6"' },
  { name: 'LENOVO V15 CORE I3-1315U 13TH GEN 8GB 256GB 15.6"', brand: 'LENOVO', category: 'Laptops', subcategory: 'LENOVO', price: 395, stockStatus: 'OUT_OF_STOCK', specs: 'Core i3-1315U 13th Gen, 8GB RAM, 256GB SSD, 15.6"' },
  { name: 'LENOVO IDEAPAD SLIM 3 CORE I3 13TH GEN 8GB 256GB 15.6"', brand: 'LENOVO', category: 'Laptops', subcategory: 'LENOVO', price: 395, stockStatus: 'OUT_OF_STOCK', specs: 'Core i3 13th Gen, 8GB RAM, 256GB SSD, 15.6"' },
  { name: 'LENOVO IDEAPAD SLIM 3 CORE I5-13420H 13TH GEN 16GB 512GB', brand: 'LENOVO', category: 'Laptops', subcategory: 'LENOVO', price: 525, stockStatus: 'IN_STOCK', specs: 'Core i5-13420H 13th Gen, 16GB RAM, 512GB SSD' },
  { name: 'LENOVO IDEAPAD 1 CORE I5-1334U 13TH GEN 8GB 256GB TOUCH', brand: 'LENOVO', category: 'Laptops', subcategory: 'LENOVO', price: 490, stockStatus: 'IN_STOCK', specs: 'Core i5-1334U 13th Gen, 8GB RAM, 256GB SSD, Touchscreen', variants: [{ name: '512GB', price: 520 }] },
  { name: 'LENOVO IDEAPAD 5 2-IN-1 CORE I7 13TH GEN 16GB 512GB', brand: 'LENOVO', category: 'Laptops', subcategory: 'LENOVO', price: 745, stockStatus: 'IN_STOCK', specs: 'Core i7 13th Gen, 16GB RAM, 512GB SSD, 2-in-1' },
  { name: 'LENOVO THINKPAD E14 GEN 6 CORE ULTRA 7 155H 16GB 512GB', brand: 'LENOVO', category: 'Laptops', subcategory: 'LENOVO', price: 930, stockStatus: 'IN_STOCK', specs: 'Core Ultra 7 155H, 16GB RAM, 512GB SSD' },

  // DELL
  { name: 'DELL VOSTRO 3530 CORE I5-1334U 8GB 512GB', brand: 'DELL', category: 'Laptops', subcategory: 'DELL', price: 515, stockStatus: 'IN_STOCK', specs: 'Core i5-1334U, 8GB RAM, 512GB SSD' },
  { name: 'DELL VOSTRO 3520 CORE I7 12TH GEN 16GB 512GB', brand: 'DELL', category: 'Laptops', subcategory: 'DELL', price: 645, stockStatus: 'IN_STOCK', specs: 'Core i7 12th Gen, 16GB RAM, 512GB SSD' },
  { name: 'DELL INSPIRON 15 3530 CORE I5-1355U 8GB 512GB TOUCH', brand: 'DELL', category: 'Laptops', subcategory: 'DELL', price: 510, stockStatus: 'IN_STOCK', specs: 'Core i5-1355U, 8GB RAM, 512GB SSD, Touchscreen' },
  { name: 'DELL INSPIRON 14 7440 2-IN-1 CORE 5 120U 16GB 512GB', brand: 'DELL', category: 'Laptops', subcategory: 'DELL', price: 690, stockStatus: 'IN_STOCK', specs: 'Core 5 120U, 16GB RAM, 512GB SSD, 2-in-1' },
  { name: 'DELL 14 PLUS CORE ULTRA 7 256V 1TB', brand: 'DELL', category: 'Laptops', subcategory: 'DELL', price: 960, stockStatus: 'PREORDER', specs: 'Core Ultra 7 256V, 1TB SSD' },

  // HP 15
  { name: 'HP 15s CELERON N4120 8GB 256GB', brand: 'HP', category: 'Laptops', subcategory: 'HP 15', price: 320, stockStatus: 'OUT_OF_STOCK', specs: 'Celeron N4120, 8GB RAM, 256GB SSD' },
  { name: 'HP 15 CORE I3-1215U 8GB 512GB', brand: 'HP', category: 'Laptops', subcategory: 'HP 15', price: 430, stockStatus: 'IN_STOCK', specs: 'Core i3-1215U, 8GB RAM, 512GB SSD' },
  { name: 'HP 15 CORE I3-1315U 8GB 512GB', brand: 'HP', category: 'Laptops', subcategory: 'HP 15', price: 440, stockStatus: 'OUT_OF_STOCK', specs: 'Core i3-1315U, 8GB RAM, 512GB SSD' },
  { name: 'HP 15 CORE I3-N305 8GB 512GB FPR', brand: 'HP', category: 'Laptops', subcategory: 'HP 15', price: 425, stockStatus: 'IN_STOCK', specs: 'Core i3-N305, 8GB RAM, 512GB SSD, Fingerprint Reader', variants: [{ name: '256GB', price: 395 }] },
  { name: 'HP 15 CORE I5-1334U 8GB 512GB', brand: 'HP', category: 'Laptops', subcategory: 'HP 15', price: 520, stockStatus: 'IN_STOCK', specs: 'Core i5-1334U, 8GB RAM, 512GB SSD' },
  { name: 'HP 15 CORE I5-1334U 16GB 512GB TOUCH', brand: 'HP', category: 'Laptops', subcategory: 'HP 15', price: 540, stockStatus: 'IN_STOCK', specs: 'Core i5-1334U, 16GB RAM, 512GB SSD, Touchscreen' },
  { name: 'HP 15 CORE 5 120U 8GB 512GB', brand: 'HP', category: 'Laptops', subcategory: 'HP 15', price: 535, stockStatus: 'OUT_OF_STOCK', specs: 'Core 5 120U, 8GB RAM, 512GB SSD' },
  { name: 'HP 15 CORE 5 120U 8GB 512GB TOUCH', brand: 'HP', category: 'Laptops', subcategory: 'HP 15', price: 550, stockStatus: 'IN_STOCK', specs: 'Core 5 120U, 8GB RAM, 512GB SSD, Touchscreen' },
  { name: 'HP 15 CORE I7-1255U 16GB 512GB', brand: 'HP', category: 'Laptops', subcategory: 'HP 15', price: 640, stockStatus: 'IN_STOCK', specs: 'Core i7-1255U, 16GB RAM, 512GB SSD' },
  { name: 'HP 15 CORE I7-1355U 16GB 512GB', brand: 'HP', category: 'Laptops', subcategory: 'HP 15', price: 670, stockStatus: 'IN_STOCK', specs: 'Core i7-1355U, 16GB RAM, 512GB SSD' },

  // HP 250
  { name: 'HP 250 G9 CELERON 8GB 256GB', brand: 'HP', category: 'Laptops', subcategory: 'HP 250', price: 325, stockStatus: 'IN_STOCK', specs: 'Celeron, 8GB RAM, 256GB SSD' },
  { name: 'HP 250 G10 CORE I3-1315U 8GB 512GB', brand: 'HP', category: 'Laptops', subcategory: 'HP 250', price: 445, stockStatus: 'IN_STOCK', specs: 'Core i3-1315U, 8GB RAM, 512GB SSD' },
  { name: 'HP 250 G10 CORE I5-1334U 8GB 512GB', brand: 'HP', category: 'Laptops', subcategory: 'HP 250', price: 545, stockStatus: 'PREORDER', specs: 'Core i5-1334U, 8GB RAM, 512GB SSD' },
  { name: 'HP 250 G10 CORE I7-1355U 16GB 512GB', brand: 'HP', category: 'Laptops', subcategory: 'HP 250', price: 675, stockStatus: 'IN_STOCK', specs: 'Core i7-1355U, 16GB RAM, 512GB SSD' },

  // HP PROBOOK
  { name: 'PROBOOK 450 G10 CORE I5', brand: 'HP', category: 'Laptops', subcategory: 'HP PROBOOK', price: 630, stockStatus: 'IN_STOCK', specs: 'Core i5' },
  { name: 'PROBOOK 450 G10 CORE I7', brand: 'HP', category: 'Laptops', subcategory: 'HP PROBOOK', price: 780, stockStatus: 'IN_STOCK', specs: 'Core i7' },
  { name: 'PROBOOK 440 G11 ULTRA 5', brand: 'HP', category: 'Laptops', subcategory: 'HP PROBOOK', price: 715, stockStatus: 'IN_STOCK', specs: 'Ultra 5' },
  { name: 'PROBOOK 440 G11 ULTRA 7', brand: 'HP', category: 'Laptops', subcategory: 'HP PROBOOK', price: 830, stockStatus: 'IN_STOCK', specs: 'Ultra 7' },
  { name: 'PROBOOK 460 G11 ULTRA 5', brand: 'HP', category: 'Laptops', subcategory: 'HP PROBOOK', price: 715, stockStatus: 'IN_STOCK', specs: 'Ultra 5' },
  { name: 'PROBOOK 460 G11 ULTRA 7 1TB', brand: 'HP', category: 'Laptops', subcategory: 'HP PROBOOK', price: 865, stockStatus: 'IN_STOCK', specs: 'Ultra 7, 1TB SSD' },
  { name: 'PROBOOK 460 G11 ULTRA 7 512GB', brand: 'HP', category: 'Laptops', subcategory: 'HP PROBOOK', price: 825, stockStatus: 'IN_STOCK', specs: 'Ultra 7, 512GB SSD' },

  // HP ELITEBOOK
  { name: 'EliteBook Ultra G1q Snapdragon X Elite', brand: 'HP', category: 'Laptops', subcategory: 'HP ELITEBOOK', price: 1000, stockStatus: 'IN_STOCK', specs: 'Snapdragon X Elite' },

  // HP OMNIBOOK
  { name: 'OMNIBOOK 5 FLIP CORE 5', brand: 'HP', category: 'Laptops', subcategory: 'HP OMNIBOOK', price: 590, stockStatus: 'OUT_OF_STOCK', specs: 'Core 5, Flip' },
  { name: 'OMNIBOOK X FLIP ULTRA 5', brand: 'HP', category: 'Laptops', subcategory: 'HP OMNIBOOK', price: 760, stockStatus: 'IN_STOCK', specs: 'Ultra 5, Flip' },
  { name: 'OMNIBOOK 5 FLIP CORE 7', brand: 'HP', category: 'Laptops', subcategory: 'HP OMNIBOOK', price: 780, stockStatus: 'OUT_OF_STOCK', specs: 'Core 7, Flip' },
  { name: 'OMNIBOOK X FLIP ULTRA 7', brand: 'HP', category: 'Laptops', subcategory: 'HP OMNIBOOK', price: 950, stockStatus: 'IN_STOCK', specs: 'Ultra 7, Flip' },
  { name: 'OMNIBOOK X FLIP 16 ULTRA 7', brand: 'HP', category: 'Laptops', subcategory: 'HP OMNIBOOK', price: 945, stockStatus: 'IN_STOCK', specs: 'Ultra 7, 16" Flip' },
  { name: 'OMNIBOOK X FLIP 16 ULTRA 7 32GB', brand: 'HP', category: 'Laptops', subcategory: 'HP OMNIBOOK', price: 1330, stockStatus: 'OUT_OF_STOCK', specs: 'Ultra 7, 16" Flip, 32GB RAM' },
  { name: 'OMNIBOOK X 16 ULTRA 7 RTX 4050', brand: 'HP', category: 'Laptops', subcategory: 'HP OMNIBOOK', price: 1590, stockStatus: 'IN_STOCK', specs: 'Ultra 7, 16", RTX 4050' },
  { name: 'OMNIBOOK X FLIP 16 ULTRA 9', brand: 'HP', category: 'Laptops', subcategory: 'HP OMNIBOOK', price: 1460, stockStatus: 'IN_STOCK', specs: 'Ultra 9, 16" Flip' },
  { name: 'OMNIBOOK ULTRA FLIP 14 ULTRA 7', brand: 'HP', category: 'Laptops', subcategory: 'HP OMNIBOOK', price: 1490, stockStatus: 'IN_STOCK', specs: 'Ultra 7, 14" Flip' },
  { name: 'OMNIBOOK 7 17" ULTRA 7 RTX 4050', brand: 'HP', category: 'Laptops', subcategory: 'HP OMNIBOOK', price: 1610, stockStatus: 'IN_STOCK', specs: 'Ultra 7, 17", RTX 4050' },
  { name: 'OMNIBOOK ULTRA FLIP 14 ULTRA 9', brand: 'HP', category: 'Laptops', subcategory: 'HP OMNIBOOK', price: 1810, stockStatus: 'IN_STOCK', specs: 'Ultra 9, 14" Flip' },

  // HP ENVY
  { name: 'HP ENVY X360 CORE 5', brand: 'HP', category: 'Laptops', subcategory: 'HP ENVY', price: 660, stockStatus: 'IN_STOCK', specs: 'Core 5, X360' },

  // HP VICTUS / OMEN
  { name: 'VICTUS I5 RTX 4050', brand: 'HP', category: 'Gaming Laptops', subcategory: 'HP VICTUS / OMEN', price: 810, stockStatus: 'IN_STOCK', specs: 'Core i5, RTX 4050', tags: ['gaming'] },
  { name: 'VICTUS I7 RTX 3050', brand: 'HP', category: 'Gaming Laptops', subcategory: 'HP VICTUS / OMEN', price: 1160, stockStatus: 'PREORDER', specs: 'Core i7, RTX 3050', tags: ['gaming'] },
  { name: 'VICTUS I7 RTX 5060', brand: 'HP', category: 'Gaming Laptops', subcategory: 'HP VICTUS / OMEN', price: 1460, stockStatus: 'IN_STOCK', specs: 'Core i7, RTX 5060', tags: ['gaming'] },
  { name: 'OMEN 16 ULTRA 7 RTX 5060', brand: 'HP', category: 'Gaming Laptops', subcategory: 'HP VICTUS / OMEN', price: 1460, stockStatus: 'IN_STOCK', specs: 'Ultra 7, RTX 5060, 16"', tags: ['gaming'] },
  { name: 'OMEN 16 I9 RTX 5060', brand: 'HP', category: 'Gaming Laptops', subcategory: 'HP VICTUS / OMEN', price: 1815, stockStatus: 'IN_STOCK', specs: 'Core i9, RTX 5060, 16"', tags: ['gaming'] },

  // HP SPECTRE
  { name: 'HP SPECTRE X360 ULTRA 7', brand: 'HP', category: 'Laptops', subcategory: 'HP SPECTRE', price: 1560, stockStatus: 'OUT_OF_STOCK', specs: 'Ultra 7, X360' },

  // ASUS
  { name: 'ASUS VIVOBOOK CORE I5', brand: 'ASUS', category: 'Laptops', subcategory: 'ASUS', price: 500, stockStatus: 'IN_STOCK', specs: 'Core i5' },
  { name: 'ASUS ZENBOOK ULTRA 9', brand: 'ASUS', category: 'Laptops', subcategory: 'ASUS', price: 1502, stockStatus: 'IN_STOCK', specs: 'Ultra 9' },

  // ALL-IN-ONE DESKTOPS
  { name: 'HP AIO I5', brand: 'HP', category: 'Desktops', subcategory: 'ALL-IN-ONE', price: 745, stockStatus: 'IN_STOCK', specs: 'Core i5, All-in-One' },
  { name: 'HP AIO I7 1TB', brand: 'HP', category: 'Desktops', subcategory: 'ALL-IN-ONE', price: 925, stockStatus: 'IN_STOCK', specs: 'Core i7, 1TB, All-in-One' },
  { name: 'HP AIO I7 512GB', brand: 'HP', category: 'Desktops', subcategory: 'ALL-IN-ONE', price: 885, stockStatus: 'IN_STOCK', specs: 'Core i7, 512GB, All-in-One' },
  { name: 'HP AIO I7 TOUCH', brand: 'HP', category: 'Desktops', subcategory: 'ALL-IN-ONE', price: 950, stockStatus: 'IN_STOCK', specs: 'Core i7, Touchscreen, All-in-One', variants: [{ name: '1TB', price: 990 }] },
  { name: 'HP AIO 27" CORE 7', brand: 'HP', category: 'Desktops', subcategory: 'ALL-IN-ONE', price: 1060, stockStatus: 'IN_STOCK', specs: 'Core 7, 27", All-in-One' },
  { name: 'HP AIO I3', brand: 'HP', category: 'Desktops', subcategory: 'ALL-IN-ONE', price: 610, stockStatus: 'OUT_OF_STOCK', specs: 'Core i3, All-in-One' },

  // DESKTOPS
  { name: 'PRO TOWER I3 + MONITOR', brand: 'HP', category: 'Desktops', subcategory: 'TOWER', price: 610, stockStatus: 'OUT_OF_STOCK', specs: 'Core i3 Tower + Monitor' },
  { name: 'PRO TOWER I5 + MONITOR', brand: 'HP', category: 'Desktops', subcategory: 'TOWER', price: 710, stockStatus: 'IN_STOCK', specs: 'Core i5 Tower + Monitor' },
  { name: 'PRO TOWER I7 + MONITOR', brand: 'HP', category: 'Desktops', subcategory: 'TOWER', price: 880, stockStatus: 'IN_STOCK', specs: 'Core i7 Tower + Monitor' },
  { name: 'ELITE MINI G9 I7', brand: 'HP', category: 'Desktops', subcategory: 'MINI PC', price: 960, stockStatus: 'IN_STOCK', specs: 'Core i7 Mini PC' },

  // GAMING
  { name: 'PS5 Slim Disk', brand: 'Sony', category: 'Gaming', subcategory: 'CONSOLE', price: 650, stockStatus: 'IN_STOCK', specs: 'PlayStation 5 Slim with Disk Drive', tags: ['gaming', 'console'] },
  { name: 'PS5 Games', brand: 'Sony', category: 'Gaming', subcategory: 'GAMES', price: 110, stockStatus: 'IN_STOCK', specs: 'PlayStation 5 Games', tags: ['gaming', 'games'] },
  { name: 'FC26', brand: 'EA Sports', category: 'Gaming', subcategory: 'GAMES', price: 135, stockStatus: 'IN_STOCK', specs: 'FIFA/FC 26', tags: ['gaming', 'games'] },
  { name: 'DualSense Controller', brand: 'Sony', category: 'Gaming', subcategory: 'ACCESSORIES', price: 130, stockStatus: 'IN_STOCK', specs: 'PlayStation 5 DualSense Controller', tags: ['gaming', 'accessories'] },

  // MONEY COUNTERS
  { name: 'PREMAX CC35D', brand: 'PREMAX', category: 'Office Equipment', subcategory: 'MONEY COUNTERS', price: 290, stockStatus: 'OUT_OF_STOCK', specs: 'Money Counter CC35D' },
  { name: 'PREMAX VC110', brand: 'PREMAX', category: 'Office Equipment', subcategory: 'MONEY COUNTERS', price: 760, stockStatus: 'IN_STOCK', specs: 'Money Counter VC110' },
  { name: 'PREMAX VC210', brand: 'PREMAX', category: 'Office Equipment', subcategory: 'MONEY COUNTERS', price: 1160, stockStatus: 'PREORDER', specs: 'Money Counter VC210' },

  // TONERS
  { name: 'HP 59A Toner', brand: 'HP', category: 'Printer Supplies', subcategory: 'TONERS', price: 180, stockStatus: 'IN_STOCK', specs: 'HP 59A Toner Cartridge' },
  { name: 'HP 222A Toner', brand: 'HP', category: 'Printer Supplies', subcategory: 'TONERS', price: 160, stockStatus: 'IN_STOCK', specs: 'HP 222A Toner Cartridge' },
  { name: 'HP 207A Toner', brand: 'HP', category: 'Printer Supplies', subcategory: 'TONERS', price: 145, stockStatus: 'IN_STOCK', specs: 'HP 207A Toner Cartridge' },
  { name: 'HP 106A Toner', brand: 'HP', category: 'Printer Supplies', subcategory: 'TONERS', price: 120, stockStatus: 'IN_STOCK', specs: 'HP 106A Toner Cartridge' },

  // SMARTPHONES
  { name: 'Samsung A07 64GB', brand: 'Samsung', category: 'Smartphones', subcategory: 'SAMSUNG', price: 140, stockStatus: 'IN_STOCK', specs: '64GB Storage' },
  { name: 'Samsung A07 128GB', brand: 'Samsung', category: 'Smartphones', subcategory: 'SAMSUNG', price: 155, stockStatus: 'OUT_OF_STOCK', specs: '128GB Storage' },
  { name: 'Samsung M16 128GB 4GB', brand: 'Samsung', category: 'Smartphones', subcategory: 'SAMSUNG', price: 205, stockStatus: 'IN_STOCK', specs: '128GB Storage, 4GB RAM' },
  { name: 'Samsung M16 128GB 6GB', brand: 'Samsung', category: 'Smartphones', subcategory: 'SAMSUNG', price: 210, stockStatus: 'IN_STOCK', specs: '128GB Storage, 6GB RAM' },
  { name: 'Samsung M35 128GB', brand: 'Samsung', category: 'Smartphones', subcategory: 'SAMSUNG', price: 240, stockStatus: 'IN_STOCK', specs: '128GB Storage' },
  { name: 'Samsung A16 128GB', brand: 'Samsung', category: 'Smartphones', subcategory: 'SAMSUNG', price: 178, stockStatus: 'IN_STOCK', specs: '128GB Storage' },
  { name: 'Samsung M06 128GB', brand: 'Samsung', category: 'Smartphones', subcategory: 'SAMSUNG', price: 165, stockStatus: 'IN_STOCK', specs: '128GB Storage' },
];

async function main() {
  console.log('🚀 Starting product import...');

  let imported = 0;
  let failed = 0;

  for (const product of productData) {
    try {
      // Get or create category
      const category = await prisma.category.upsert({
        where: { slug: slugify(product.category) },
        update: {},
        create: {
          name: product.category,
          slug: slugify(product.category),
          description: `${product.category} products`,
        },
      });

      // Create product with unique slug
      const uniqueSlug = `${slugify(product.name)}-${Math.random().toString(36).substring(2, 8)}`;
      
      const createdProduct = await prisma.product.create({
        data: {
          name: product.name,
          slug: uniqueSlug,
          description: product.specs,
          price: product.price,
          originalPrice: Math.round(product.price * 1.15), // 15% markup
          categoryId: category.id,
          brand: product.brand,
          sku: generateSKU(product.brand, product.name),
          stock: product.stockStatus === 'IN_STOCK' ? 15 : 0,
          inStock: product.stockStatus === 'IN_STOCK',
          featured: product.price > 1000, // Feature premium products
          specs: parseSpecs(product.specs),
          images: ['/images/products/placeholder.jpg'],
        },
      });

      // Create inventory
      // Note: Inventory model not used, stock managed directly in Product model

      // Create variants if specified
      if (product.variants && product.variants.length > 0) {
        for (const variantData of product.variants) {
          try {
            await prisma.productVariant.create({
              data: {
                productId: createdProduct.id,
                name: variantData.name,
                sku: generateSKU(product.brand, `${product.name}-${variantData.name}`),
                price: variantData.price,
                originalPrice: Math.round(variantData.price * 1.15),
                storage: variantData.name,
                stock: product.stockStatus === 'IN_STOCK' ? 10 : 0,
                inStock: product.stockStatus === 'IN_STOCK',
              },
            });
          } catch (error) {
            console.warn(`  ⚠️  Variant failed for ${product.name} - ${variantData.name}`);
          }
        }
      }

      imported++;
      console.log(`✅ Imported: ${product.name}`);
    } catch (error) {
      failed++;
      console.error(`❌ Failed: ${product.name}`, error);
    }
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`   Total: ${productData.length}`);
  console.log(`   Success: ${imported}`);
  console.log(`   Failed: ${failed}`);
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
  const lowerSpecs = specs.toLowerCase();
  
  // Extract RAM
  const ramMatch = specs.match(/(\d+GB)\s*RAM/i);
  if (ramMatch) specObj['RAM'] = ramMatch[1];
  
  // Extract Storage
  const storageMatch = specs.match(/(\d+(?:GB|TB))(?!\s*RAM)/i);
  if (storageMatch) specObj['Storage'] = storageMatch[1];
  
  // Extract Screen Size
  const screenMatch = specs.match(/(\d+(?:\.\d+)?["'])/);
  if (screenMatch) specObj['Screen Size'] = screenMatch[1];
  
  // Extract Processor
  if (lowerSpecs.includes('celeron')) specObj['Processor'] = 'Intel Celeron';
  else if (lowerSpecs.includes('core i9')) specObj['Processor'] = 'Intel Core i9';
  else if (lowerSpecs.includes('core i7')) specObj['Processor'] = 'Intel Core i7';
  else if (lowerSpecs.includes('core i5')) specObj['Processor'] = 'Intel Core i5';
  else if (lowerSpecs.includes('core i3')) specObj['Processor'] = 'Intel Core i3';
  else if (lowerSpecs.includes('ultra 9')) specObj['Processor'] = 'Intel Ultra 9';
  else if (lowerSpecs.includes('ultra 7')) specObj['Processor'] = 'Intel Ultra 7';
  else if (lowerSpecs.includes('ultra 5')) specObj['Processor'] = 'Intel Ultra 5';
  else if (lowerSpecs.includes('snapdragon')) specObj['Processor'] = 'Snapdragon';
  
  // Extract GPU
  if (lowerSpecs.includes('rtx 5060')) specObj['Graphics'] = 'NVIDIA RTX 5060';
  else if (lowerSpecs.includes('rtx 4050')) specObj['Graphics'] = 'NVIDIA RTX 4050';
  else if (lowerSpecs.includes('rtx 3050')) specObj['Graphics'] = 'NVIDIA RTX 3050';
  
  // Features
  if (lowerSpecs.includes('touch')) specObj['Touchscreen'] = 'Yes';
  if (lowerSpecs.includes('2-in-1') || lowerSpecs.includes('flip')) specObj['Type'] = '2-in-1 Convertible';
  
  return specObj;
}

main()
  .catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
