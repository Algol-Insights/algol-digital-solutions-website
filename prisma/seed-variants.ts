import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting to seed product variants...")

  // Get some laptops to add variants to
  const laptops = await prisma.product.findMany({
    where: {
      category: {
        name: "Laptops",
      },
      name: {
        contains: "MacBook",
      },
    },
    take: 2,
  })

  if (laptops.length > 0) {
    const macbook = laptops[0]
    console.log(`Adding variants to: ${macbook.name}`)

    // Create MacBook variants (different colors and storage)
    await prisma.productVariant.createMany({
      data: [
        {
          productId: macbook.id,
          sku: `${macbook.sku}-SILVER-256`,
          name: "Silver, 256GB",
          color: "Silver",
          storage: "256GB",
          price: macbook.price,
          originalPrice: macbook.originalPrice,
          stock: 5,
          inStock: true,
          image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
          sortOrder: 1,
        },
        {
          productId: macbook.id,
          sku: `${macbook.sku}-GRAY-256`,
          name: "Space Gray, 256GB",
          color: "Space Gray",
          storage: "256GB",
          price: macbook.price,
          originalPrice: macbook.originalPrice,
          stock: 8,
          inStock: true,
          image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
          sortOrder: 2,
        },
        {
          productId: macbook.id,
          sku: `${macbook.sku}-SILVER-512`,
          name: "Silver, 512GB",
          color: "Silver",
          storage: "512GB",
          price: macbook.price + 200,
          originalPrice: macbook.originalPrice ? macbook.originalPrice + 200 : null,
          stock: 3,
          inStock: true,
          image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
          sortOrder: 3,
        },
        {
          productId: macbook.id,
          sku: `${macbook.sku}-GRAY-512`,
          name: "Space Gray, 512GB",
          color: "Space Gray",
          storage: "512GB",
          price: macbook.price + 200,
          originalPrice: macbook.originalPrice ? macbook.originalPrice + 200 : null,
          stock: 6,
          inStock: true,
          image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
          sortOrder: 4,
        },
      ],
    })

    console.log(`✓ Added 4 variants to ${macbook.name}`)
  }

  // Get Dell laptops
  const dellLaptops = await prisma.product.findMany({
    where: {
      brand: "Dell",
      category: {
        name: "Laptops",
      },
    },
    take: 1,
  })

  if (dellLaptops.length > 0) {
    const dell = dellLaptops[0]
    console.log(`Adding variants to: ${dell.name}`)

    await prisma.productVariant.createMany({
      data: [
        {
          productId: dell.id,
          sku: `${dell.sku}-BLACK-8GB`,
          name: "Black, 8GB RAM",
          color: "Black",
          size: "8GB RAM",
          price: dell.price,
          originalPrice: dell.originalPrice,
          stock: 10,
          inStock: true,
          sortOrder: 1,
        },
        {
          productId: dell.id,
          sku: `${dell.sku}-BLACK-16GB`,
          name: "Black, 16GB RAM",
          color: "Black",
          size: "16GB RAM",
          price: dell.price + 100,
          originalPrice: dell.originalPrice ? dell.originalPrice + 100 : null,
          stock: 7,
          inStock: true,
          sortOrder: 2,
        },
        {
          productId: dell.id,
          sku: `${dell.sku}-SILVER-8GB`,
          name: "Silver, 8GB RAM",
          color: "Silver",
          size: "8GB RAM",
          price: dell.price,
          originalPrice: dell.originalPrice,
          stock: 8,
          inStock: true,
          sortOrder: 3,
        },
      ],
    })

    console.log(`✓ Added 3 variants to ${dell.name}`)
  }

  // Get monitors for size variants
  const monitors = await prisma.product.findMany({
    where: {
      category: {
        name: "Monitors",
      },
    },
    take: 1,
  })

  if (monitors.length > 0) {
    const monitor = monitors[0]
    console.log(`Adding variants to: ${monitor.name}`)

    await prisma.productVariant.createMany({
      data: [
        {
          productId: monitor.id,
          sku: `${monitor.sku}-24INCH`,
          name: '24"',
          size: '24"',
          price: monitor.price,
          originalPrice: monitor.originalPrice,
          stock: 12,
          inStock: true,
          sortOrder: 1,
        },
        {
          productId: monitor.id,
          sku: `${monitor.sku}-27INCH`,
          name: '27"',
          size: '27"',
          price: monitor.price + 150,
          originalPrice: monitor.originalPrice ? monitor.originalPrice + 150 : null,
          stock: 9,
          inStock: true,
          sortOrder: 2,
        },
        {
          productId: monitor.id,
          sku: `${monitor.sku}-32INCH`,
          name: '32"',
          size: '32"',
          price: monitor.price + 300,
          originalPrice: monitor.originalPrice ? monitor.originalPrice + 300 : null,
          stock: 5,
          inStock: true,
          sortOrder: 3,
        },
      ],
    })

    console.log(`✓ Added 3 variants to ${monitor.name}`)
  }

  const variantCount = await prisma.productVariant.count()
  console.log(`\n✅ Seeding complete! Total variants: ${variantCount}`)
}

main()
  .catch((e) => {
    console.error("Error seeding variants:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
