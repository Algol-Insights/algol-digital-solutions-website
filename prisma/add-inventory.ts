import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

async function main() {
  console.log("🌱 Adding current inventory to database...")

  // Ensure categories exist
  const laptopsCategory = await prisma.category.upsert({
    where: { slug: 'laptops' },
    update: {},
    create: {
      name: 'Laptops',
      slug: 'laptops',
      description: 'Laptops and notebooks'
    }
  })

  const desktopsCategory = await prisma.category.upsert({
    where: { slug: 'desktops' },
    update: {},
    create: {
      name: 'Desktops',
      slug: 'desktops',
      description: 'Desktop computers and all-in-ones'
    }
  })

  const smartphonesCategory = await prisma.category.upsert({
    where: { slug: 'smartphones' },
    update: {},
    create: {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Mobile phones and accessories'
    }
  })

  const gamingCategory = await prisma.category.upsert({
    where: { slug: 'gaming' },
    update: {},
    create: {
      name: 'Gaming',
      slug: 'gaming',
      description: 'Gaming consoles and accessories'
    }
  })

  const accessoriesCategory = await prisma.category.upsert({
    where: { slug: 'accessories' },
    update: {},
    create: {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Computer and office accessories'
    }
  })

  const printersCategory = await prisma.category.upsert({
    where: { slug: 'printers' },
    update: {},
    create: {
      name: 'Printers',
      slug: 'printers',
      description: 'Printers and supplies'
    }
  })

  // Product data
  const products = [
    // LENOVO
    { name: "Lenovo V15 Celeron N4500 8GB 256GB", brand: "Lenovo", price: 295, category: laptopsCategory.id, specs: "Celeron N4500, 8GB RAM, 256GB SSD", stock: 5 },
    { name: "Lenovo Ideapad Celeron N4500 8GB 256GB", brand: "Lenovo", price: 295, category: laptopsCategory.id, specs: "Celeron N4500, 8GB RAM, 256GB SSD", stock: 5 },
    { name: "Lenovo V15 Core i3-1315U", brand: "Lenovo", price: 385, category: laptopsCategory.id, specs: "Core i3-1315U, 8GB RAM, 256GB SSD", stock: 5 },
    { name: "Lenovo Ideapad Slim 3 Core i3", brand: "Lenovo", price: 385, category: laptopsCategory.id, specs: "Core i3, 8GB RAM, 256GB SSD", stock: 5 },
    { name: "Lenovo Ideapad Slim 3 Core i5", brand: "Lenovo", price: 515, category: laptopsCategory.id, specs: "Core i5, 8GB RAM, 512GB SSD", stock: 5 },
    { name: "Lenovo Ideapad Slim 3 Core i7", brand: "Lenovo", price: 755, category: laptopsCategory.id, specs: "Core i7, 16GB RAM, 512GB SSD", stock: 5 },
    { name: "Lenovo ThinkPad E14 Gen 6", brand: "Lenovo", price: 920, category: laptopsCategory.id, specs: "Latest Gen, 16GB RAM, 512GB SSD", stock: 5 },
    { name: "Lenovo Ideapad 5 2-in-1 Core i7", brand: "Lenovo", price: 735, category: laptopsCategory.id, specs: "Core i7, Touch Screen, 16GB RAM, 512GB SSD", stock: 5 },

    // DELL
    { name: "Dell Vostro 3530 Core i5", brand: "Dell", price: 505, category: laptopsCategory.id, specs: "Core i5, 8GB RAM, 512GB SSD", stock: 5 },
    { name: "Dell Vostro 3520 Core i7", brand: "Dell", price: 635, category: laptopsCategory.id, specs: "Core i7, 16GB RAM, 512GB SSD", stock: 5 },
    { name: "Dell Inspiron 15 3530 Touch", brand: "Dell", price: 580, category: laptopsCategory.id, specs: "Core i5, Touch Screen, 8GB RAM, 512GB SSD", stock: 5 },
    { name: "Dell Inspiron 14 7440 2-in-1", brand: "Dell", price: 720, category: laptopsCategory.id, specs: "Core i7, Convertible, 16GB RAM, 512GB SSD", stock: 5 },
    { name: "Dell 14 Plus Core Ultra 7", brand: "Dell", price: 950, category: laptopsCategory.id, specs: "Core Ultra 7, 16GB RAM, 1TB SSD", stock: 5 },

    // HP 15
    { name: "HP 15s Celeron", brand: "HP", price: 310, category: laptopsCategory.id, specs: "Celeron, 8GB RAM, 256GB SSD", stock: 5 },
    { name: "HP 15 Core i3 12th Gen", brand: "HP", price: 420, category: laptopsCategory.id, specs: "Core i3 12th Gen, 8GB RAM, 256GB SSD", stock: 5 },
    { name: "HP 15 Core i3 13th Gen", brand: "HP", price: 430, category: laptopsCategory.id, specs: "Core i3 13th Gen, 8GB RAM, 512GB SSD", stock: 5 },
    { name: "HP 15 Core i5", brand: "HP", price: 510, category: laptopsCategory.id, specs: "Core i5, 8GB RAM, 512GB SSD", stock: 5 },
    { name: "HP 15 Core 5 120U", brand: "HP", price: 540, category: laptopsCategory.id, specs: "Core 5 120U, 8GB RAM, 512GB SSD", stock: 5 },
    { name: "HP 15 Touch Core 5", brand: "HP", price: 540, category: laptopsCategory.id, specs: "Core 5, Touch Screen, 8GB RAM, 512GB SSD", stock: 5 },
    { name: "HP 15 Core i7 12th Gen", brand: "HP", price: 630, category: laptopsCategory.id, specs: "Core i7 12th Gen, 16GB RAM, 512GB SSD", stock: 5 },
    { name: "HP 15 Core i7 13th Gen", brand: "HP", price: 660, category: laptopsCategory.id, specs: "Core i7 13th Gen, 16GB RAM, 512GB SSD", stock: 5 },

    // HP 250
    { name: "HP 250 G9 Celeron", brand: "HP", price: 315, category: laptopsCategory.id, specs: "Celeron, 8GB RAM, 256GB SSD", stock: 5 },
    { name: "HP 250 G10 Core i3", brand: "HP", price: 435, category: laptopsCategory.id, specs: "Core i3, 8GB RAM, 256GB SSD", stock: 5 },
    { name: "HP 250 G10 Core i5", brand: "HP", price: 535, category: laptopsCategory.id, specs: "Core i5, 8GB RAM, 512GB SSD", stock: 5 },
    { name: "HP 250 G10 Core i7", brand: "HP", price: 665, category: laptopsCategory.id, specs: "Core i7, 16GB RAM, 512GB SSD", stock: 5 },

    // HP PROBOOK
    { name: "HP ProBook 450 G10 Core i5", brand: "HP", price: 635, category: laptopsCategory.id, specs: "Core i5, 8GB RAM, 512GB SSD", stock: 5 },
    { name: "HP ProBook 450 G10 Core i7", brand: "HP", price: 790, category: laptopsCategory.id, specs: "Core i7, 16GB RAM, 512GB SSD", stock: 5 },
    { name: "HP ProBook 440 G11 Ultra 5", brand: "HP", price: 705, category: laptopsCategory.id, specs: "Intel Ultra 5, 16GB RAM, 512GB SSD", stock: 5 },
    { name: "HP ProBook 440 G11 Ultra 7", brand: "HP", price: 820, category: laptopsCategory.id, specs: "Intel Ultra 7, 16GB RAM, 512GB SSD", stock: 5 },
    { name: "HP ProBook 460 G11 Ultra 5", brand: "HP", price: 705, category: laptopsCategory.id, specs: "Intel Ultra 5, 16GB RAM, 512GB SSD", stock: 5 },
    { name: "HP ProBook 460 G11 Ultra 7 1TB", brand: "HP", price: 860, category: laptopsCategory.id, specs: "Intel Ultra 7, 16GB RAM, 1TB SSD", stock: 5 },
    { name: "HP ProBook 460 G11 Ultra 7 512GB", brand: "HP", price: 820, category: laptopsCategory.id, specs: "Intel Ultra 7, 16GB RAM, 512GB SSD", stock: 5 },

    // HP ELITEBOOK
    { name: "HP EliteBook Ultra G1q", brand: "HP", price: 990, category: laptopsCategory.id, specs: "Intel Ultra, 16GB RAM, 512GB SSD", stock: 5 },

    // HP OMNIBOOK
    { name: "HP Omnibook 5 Flip Core 5", brand: "HP", price: 630, category: laptopsCategory.id, specs: "Core 5, 2-in-1, 16GB RAM, 512GB SSD", stock: 5 },
    { name: "HP Omnibook 5 Flip Core 7", brand: "HP", price: 790, category: laptopsCategory.id, specs: "Core 7, 2-in-1, 16GB RAM, 512GB SSD", stock: 5 },
    { name: "HP Omnibook X Flip 14", brand: "HP", price: 955, category: laptopsCategory.id, specs: "14-inch, 2-in-1, 16GB RAM, 512GB SSD", stock: 5 },
    { name: "HP Omnibook X Flip 16", brand: "HP", price: 1050, category: laptopsCategory.id, specs: "16-inch, 2-in-1, 16GB RAM, 512GB SSD", stock: 5 },
    { name: "HP Omnibook X Flip 16 32GB 2TB", brand: "HP", price: 1400, category: laptopsCategory.id, specs: "16-inch, 2-in-1, 32GB RAM, 2TB SSD", stock: 5 },
    { name: "HP Omnibook X 16 RTX", brand: "HP", price: 1580, category: laptopsCategory.id, specs: "16-inch, RTX Graphics, 32GB RAM, 1TB SSD", stock: 5 },
    { name: "HP Omnibook X Flip Ultra 9", brand: "HP", price: 1530, category: laptopsCategory.id, specs: "Intel Ultra 9, 2-in-1, 32GB RAM, 1TB SSD", stock: 5 },
    { name: "HP Omnibook Ultra Flip Core 7", brand: "HP", price: 1480, category: laptopsCategory.id, specs: "Core 7, 2-in-1, 32GB RAM, 1TB SSD", stock: 5 },
    { name: "HP Omnibook Ultra Flip Core 9", brand: "HP", price: 1820, category: laptopsCategory.id, specs: "Core 9, 2-in-1, 32GB RAM, 2TB SSD", stock: 5 },

    // HP ENVY
    { name: "HP Envy X360 Core 5", brand: "HP", price: 650, category: laptopsCategory.id, specs: "Core 5, 2-in-1, 16GB RAM, 512GB SSD", stock: 5 },

    // HP VICTUS / OMEN
    { name: "HP Victus i5 RTX 4050", brand: "HP", price: 800, category: laptopsCategory.id, specs: "Core i5, RTX 4050, 16GB RAM, 512GB SSD", stock: 5 },
    { name: "HP Victus i7 RTX 3050", brand: "HP", price: 1150, category: laptopsCategory.id, specs: "Core i7, RTX 3050, 16GB RAM, 512GB SSD", stock: 5 },
    { name: "HP Victus i7 RTX 5060", brand: "HP", price: 1450, category: laptopsCategory.id, specs: "Core i7, RTX 5060, 16GB RAM, 1TB SSD", stock: 5 },
    { name: "HP Omen 16 Ultra 7 RTX 5060", brand: "HP", price: 1450, category: laptopsCategory.id, specs: "Intel Ultra 7, RTX 5060, 16GB RAM, 1TB SSD", stock: 5 },
    { name: "HP Omen 16 i9 RTX 5060", brand: "HP", price: 1805, category: laptopsCategory.id, specs: "Core i9, RTX 5060, 32GB RAM, 1TB SSD", stock: 5 },

    // HP SPECTRE
    { name: "HP Spectre X360 Ultra 7", brand: "HP", price: 1550, category: laptopsCategory.id, specs: "Intel Ultra 7, 2-in-1, 16GB RAM, 1TB SSD", stock: 5 },

    // ASUS
    { name: "ASUS Vivobook i5", brand: "ASUS", price: 490, category: laptopsCategory.id, specs: "Core i5, 8GB RAM, 512GB SSD", stock: 5 },
    { name: "ASUS Zenbook Ultra 9", brand: "ASUS", price: 1492, category: laptopsCategory.id, specs: "Intel Ultra 9, 16GB RAM, 1TB SSD", stock: 5 },

    // APPLE
    { name: "iPhone 17 Pro Max", brand: "Apple", price: 1600, category: smartphonesCategory.id, specs: "Latest iPhone, 256GB", stock: 5 },
    { name: "iPad A16 2025", brand: "Apple", price: 900, category: accessoriesCategory.id, specs: "A16 Chip, 128GB", stock: 5 },
    { name: "iPad Pro 11 M5", brand: "Apple", price: 1510, category: accessoriesCategory.id, specs: "M5 Chip, 11-inch, 256GB", stock: 5 },
    { name: "Apple Pencil Pro", brand: "Apple", price: 210, category: accessoriesCategory.id, specs: "Latest Apple Pencil", stock: 5 },
    { name: "MacBook Air M1", brand: "Apple", price: 750, category: laptopsCategory.id, specs: "M1 Chip, 8GB RAM, 256GB SSD", stock: 5 },

    // ALL-IN-ONE DESKTOPS
    { name: "HP AIO i5", brand: "HP", price: 735, category: desktopsCategory.id, specs: "Core i5, 8GB RAM, 512GB SSD, 23.8-inch Display", stock: 5 },
    { name: "HP AIO i7 1TB", brand: "HP", price: 915, category: desktopsCategory.id, specs: "Core i7, 16GB RAM, 1TB SSD, 23.8-inch Display", stock: 5 },
    { name: "HP AIO i7 512GB", brand: "HP", price: 875, category: desktopsCategory.id, specs: "Core i7, 16GB RAM, 512GB SSD, 23.8-inch Display", stock: 5 },
    { name: "HP AIO Touch i7", brand: "HP", price: 940, category: desktopsCategory.id, specs: "Core i7, Touch Screen, 16GB RAM, 512GB SSD", stock: 5 },
    { name: "HP AIO Touch i7 1TB", brand: "HP", price: 980, category: desktopsCategory.id, specs: "Core i7, Touch Screen, 16GB RAM, 1TB SSD", stock: 5 },
    { name: "HP AIO 27 Core 7", brand: "HP", price: 1050, category: desktopsCategory.id, specs: "Core 7, 27-inch Display, 16GB RAM, 512GB SSD", stock: 5 },
    { name: "HP AIO i3", brand: "HP", price: 600, category: desktopsCategory.id, specs: "Core i3, 8GB RAM, 256GB SSD, 23.8-inch Display", stock: 5 },

    // DESKTOPS
    { name: "HP Pro Tower i3 with Monitor", brand: "HP", price: 600, category: desktopsCategory.id, specs: "Core i3, 8GB RAM, 256GB SSD, 21.5-inch Monitor", stock: 5 },
    { name: "HP Pro Tower i5 with Monitor", brand: "HP", price: 700, category: desktopsCategory.id, specs: "Core i5, 8GB RAM, 512GB SSD, 21.5-inch Monitor", stock: 5 },
    { name: "HP Pro Tower i7 with Monitor", brand: "HP", price: 870, category: desktopsCategory.id, specs: "Core i7, 16GB RAM, 512GB SSD, 24-inch Monitor", stock: 5 },
    { name: "HP Elite Mini G9", brand: "HP", price: 950, category: desktopsCategory.id, specs: "Core i7, Mini PC, 16GB RAM, 512GB SSD", stock: 5 },
    { name: "HP Monitor 24 inch", brand: "HP", price: 220, category: accessoriesCategory.id, specs: "24-inch Full HD Monitor", stock: 10 },
    { name: "HP Monitor 27 inch", brand: "HP", price: 320, category: accessoriesCategory.id, specs: "27-inch Full HD Monitor", stock: 10 },

    // GAMING
    { name: "PlayStation 5 Slim 1TB", brand: "Sony", price: 640, category: gamingCategory.id, specs: "PS5 Slim, 1TB Storage", stock: 5 },
    { name: "PlayStation 5 Games", brand: "Sony", price: 100, category: gamingCategory.id, specs: "PS5 Game Titles", stock: 20 },
    { name: "FC26", brand: "EA Sports", price: 125, category: gamingCategory.id, specs: "FIFA Club 26", stock: 10 },
    { name: "DualSense Controller", brand: "Sony", price: 120, category: gamingCategory.id, specs: "PS5 Wireless Controller", stock: 10 },

    // MONEY COUNTERS
    { name: "Premax CC35D Money Counter", brand: "Premax", price: 280, category: accessoriesCategory.id, specs: "Basic Money Counting", stock: 5 },
    { name: "Premax VC110 Money Counter", brand: "Premax", price: 750, category: accessoriesCategory.id, specs: "Advanced Money Counter with UV Detection", stock: 5 },
    { name: "Premax VC210 Money Counter", brand: "Premax", price: 1150, category: accessoriesCategory.id, specs: "Professional Money Counter with Multi-Currency", stock: 5 },

    // TONERS
    { name: "HP 59A Toner", brand: "HP", price: 170, category: printersCategory.id, specs: "Compatible with HP LaserJet", stock: 10 },
    { name: "HP 222A Toner", brand: "HP", price: 150, category: printersCategory.id, specs: "Compatible with HP LaserJet", stock: 10 },
    { name: "HP 207A Toner", brand: "HP", price: 135, category: printersCategory.id, specs: "Compatible with HP LaserJet", stock: 10 },
    { name: "HP 106A Toner", brand: "HP", price: 110, category: printersCategory.id, specs: "Compatible with HP LaserJet", stock: 10 },

    // SMARTPHONES
    { name: "Samsung Galaxy A07 64GB", brand: "Samsung", price: 130, category: smartphonesCategory.id, specs: "64GB Storage, 4GB RAM", stock: 10 },
    { name: "Samsung Galaxy A07 128GB", brand: "Samsung", price: 145, category: smartphonesCategory.id, specs: "128GB Storage, 4GB RAM", stock: 10 },
    { name: "Samsung Galaxy M16 128GB 4GB", brand: "Samsung", price: 195, category: smartphonesCategory.id, specs: "128GB Storage, 4GB RAM", stock: 10 },
    { name: "Samsung Galaxy M16 128GB 6GB", brand: "Samsung", price: 200, category: smartphonesCategory.id, specs: "128GB Storage, 6GB RAM", stock: 10 },
    { name: "Samsung Galaxy M35 128GB", brand: "Samsung", price: 230, category: smartphonesCategory.id, specs: "128GB Storage, 6GB RAM", stock: 10 },
    { name: "Samsung Galaxy A16 128GB", brand: "Samsung", price: 168, category: smartphonesCategory.id, specs: "128GB Storage, 4GB RAM", stock: 10 },
    { name: "Samsung Galaxy M06 128GB", brand: "Samsung", price: 155, category: smartphonesCategory.id, specs: "128GB Storage, 4GB RAM", stock: 10 },
  ]

  // Insert products
  let addedCount = 0
  for (const product of products) {
    const slug = slugify(product.name)
    const description = `${product.brand} ${product.name}. ${product.specs}. Brand new, original, with warranty.`
    
    await prisma.product.upsert({
      where: { slug },
      update: {
        name: product.name,
        description: description,
        brand: product.brand,
        price: product.price,
        categoryId: product.category,
        stock: product.stock,
        specs: product.specs,
        inStock: product.stock > 0,
        rating: 4.8,
        reviewCount: 15,
        featured: product.price > 1000,
        image: `https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80`,
      },
      create: {
        name: product.name,
        slug: slug,
        description: description,
        brand: product.brand,
        price: product.price,
        categoryId: product.category,
        stock: product.stock,
        specs: product.specs,
        inStock: product.stock > 0,
        rating: 4.8,
        reviewCount: 15,
        featured: product.price > 1000,
        image: `https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80`,
        sku: `SKU-${slug.substring(0, 15)}-${Date.now()}`,
      },
    })
    addedCount++
  }

  console.log(`✅ Added ${addedCount} products to inventory!`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
