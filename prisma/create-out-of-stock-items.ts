import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Setting some products to out of stock for testing...');

  // Get 3 random products
  const products = await prisma.product.findMany({
    take: 3,
    where: {
      active: true,
    },
  });

  for (const product of products) {
    await prisma.product.update({
      where: { id: product.id },
      data: {
        stock: 0,
        inStock: false,
      },
    });
    console.log(`Set ${product.name} to out of stock`);
  }

  // Get 2 random variants and set them to out of stock
  const variants = await prisma.productVariant.findMany({
    take: 2,
    where: {
      active: true,
    },
    include: {
      product: true,
    },
  });

  for (const variant of variants) {
    await prisma.productVariant.update({
      where: { id: variant.id },
      data: {
        stock: 0,
        inStock: false,
      },
    });
    console.log(`Set ${variant.product.name} - ${variant.name} to out of stock`);
  }

  console.log('Done! Out-of-stock products created for testing.');
  console.log('\nYou can now:');
  console.log('1. Visit product pages and subscribe to stock alerts');
  console.log('2. Use admin panel to manage alerts');
  console.log('3. Test the notification system');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
