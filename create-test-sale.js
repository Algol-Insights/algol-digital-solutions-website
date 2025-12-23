/**
 * This script creates a test sale in the database directly.
 * Run: node create-test-sale.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestSale() {
  try {
    // Get first product and admin user
    const product = await prisma.product.findFirst();
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!product) {
      console.error('No products found in database');
      process.exit(1);
    }

    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    // Create a test sale
    const sale = await prisma.sale.create({
      data: {
        transactionNo: `TEST-${Date.now()}`,
        customerId: null,
        total: product.price * 2 - 100,
        discount: 100,
        discountType: 'FIXED',
        paymentMethod: 'CASH',
        paymentStatus: 'COMPLETED',
        notes: 'Test sale created from script',
        createdBy: adminUser.id,
        items: {
          create: [
            {
              productId: product.id,
              quantity: 2,
              unitPrice: product.price,
              total: product.price * 2,
            }
          ]
        }
      },
      include: {
        items: true,
        createdByUser: { select: { name: true, email: true } }
      }
    });

    console.log('✅ Test sale created successfully:');
    console.log(JSON.stringify(sale, null, 2));

  } catch (error) {
    console.error('❌ Error creating test sale:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createTestSale();
