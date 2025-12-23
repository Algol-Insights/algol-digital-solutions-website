import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Updating products with limited time offers...')

  // Get some products to mark as limited time offers
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { rating: 'desc' }
  })

  // Mark them as limited time offers with expiration dates
  for (const product of products) {
    const daysFromNow = Math.floor(Math.random() * 5) + 1 // 1-5 days
    const offerEndsAt = new Date()
    offerEndsAt.setDate(offerEndsAt.getDate() + daysFromNow)

    await prisma.product.update({
      where: { id: product.id },
      data: {
        limitedTimeOffer: true,
        offerEndsAt,
        onSale: true,
        originalPrice: product.price * 1.3, // Add discount
      }
    })

    console.log(`✅ Updated ${product.name} - Offer ends: ${offerEndsAt.toLocaleString()}`)
  }

  console.log('\n✨ Successfully updated products with limited time offers!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
