import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestSales() {
  try {
    // Get first admin user
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!admin) {
      console.error('❌ No admin user found');
      process.exit(1);
    }

    // Get first 3 products
    const products = await prisma.product.findMany({
      take: 3
    });

    if (products.length === 0) {
      console.error('❌ No products found');
      process.exit(1);
    }

    // Create test sales
    for (let i = 0; i < 3; i++) {
      const product = products[i];
      const quantity = Math.floor(Math.random() * 5) + 1;
      const subtotal = product.price * quantity;
      const discount = i === 0 ? 50 : i === 1 ? 0 : subtotal * 0.1;
      const total = subtotal - discount;

      const sale = await prisma.sale.create({
        data: {
          transactionNo: `TXN-${Date.now()}-${i}`,
          customerId: null,
          total,
          discount,
          discountType: i === 0 ? 'FIXED' : i === 1 ? 'FIXED' : 'PERCENTAGE',
          paymentMethod: ['CASH', 'CARD', 'PAYPAL'][i],
          paymentStatus: 'COMPLETED',
          notes: `Sample transaction ${i + 1}`,
          createdBy: admin.id,
          items: {
            create: {
              productId: product.id,
              quantity,
              unitPrice: product.price,
              total: subtotal,
            }
          }
        }
      });

      console.log(`✅ Sale ${i + 1} created: ${sale.transactionNo}`);
    }

    console.log('✅ All test sales created successfully');

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createTestSales();
