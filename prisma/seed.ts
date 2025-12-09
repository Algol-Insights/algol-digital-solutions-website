import { PrismaClient } from "@prisma/client"
import { products, categories } from "../lib/products"

const prisma = new PrismaClient()

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

async function main() {
  console.log("🌱 Seeding database...")

  // Seed categories
  const categoryMap = new Map<string, string>()
  for (const name of categories) {
    const slug = slugify(name)
    const category = await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: {
        name,
        slug,
        description: `${name} category`,
      },
    })
    categoryMap.set(name, category.id)
  }

  // Seed products
  for (const product of products) {
    const categoryId = categoryMap.get(product.category)
    if (!categoryId) {
      console.warn(`Skipping product ${product.name}: missing category ${product.category}`)
      continue
    }

    const slug = slugify(product.name)
    const stock = product.stock ?? (product.inStock ? 25 : 0)
    const rating = product.rating ?? 4.7
    const reviewCount = product.reviewCount ?? 24

    await prisma.product.upsert({
      where: { slug },
      update: {
        name: product.name,
        description: product.description,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        stock,
        inStock: stock > 0,
        rating,
        reviewCount,
        image: product.image,
        specs: product.specs ?? {},
        featured: Boolean(product.featured),
        active: true,
        category: { connect: { id: categoryId } },
        sku: product.id.toUpperCase(),
      },
      create: {
        id: product.id,
        name: product.name,
        slug,
        description: product.description,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        stock,
        inStock: stock > 0,
        rating,
        reviewCount,
        image: product.image,
        specs: product.specs ?? {},
        featured: Boolean(product.featured),
        active: true,
        sku: product.id.toUpperCase(),
        category: { connect: { id: categoryId } },
      },
    })
  }

  console.log("✅ Seeding completed")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
