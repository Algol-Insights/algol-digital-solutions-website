import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Function to generate multiple product images
// In a real system, these would be actual product photos from different angles
function generateProductImages(productId: string, mainImage: string): string[] {
  // For real implementation, you would store actual product photos
  // This creates variant URLs for demonstration
  const baseUrl = mainImage.split('?')[0]
  
  return [
    mainImage, // Front view (main image)
    `${baseUrl}?angle=side`, // Side view
    `${baseUrl}?angle=back`, // Back view
    `${baseUrl}?angle=detail`, // Detail/close-up
    `${baseUrl}?angle=package`, // Package contents
  ]
}

async function updateProductImages() {
  console.log("🖼️  Updating product images...")

  const products = await prisma.product.findMany()

  for (const product of products) {
    if (product.image) {
      const images = generateProductImages(product.id, product.image)
      
      await prisma.product.update({
        where: { id: product.id },
        data: { images },
      })
      
      console.log(`✅ Updated images for: ${product.name}`)
    }
  }

  console.log("🎉 All products updated with image galleries!")
}

updateProductImages()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
