import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed orders...');

  // Get test users
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@algol.com' },
  });

  const customerUser = await prisma.user.findUnique({
    where: { email: 'customer@test.com' },
  });

  if (!adminUser || !customerUser) {
    console.error('Test users not found. Please run seed-users.ts first.');
    return;
  }

  // Get some products for orders
  const products = await prisma.product.findMany({
    take: 10,
    include: {
      variants: true,
    },
  });

  if (products.length === 0) {
    console.error('No products found. Please seed products first.');
    return;
  }

  // Helper function to create a customer
  const getOrCreateCustomer = async (email: string, name: string, phone?: string) => {
    let customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email,
          name,
          phone,
        },
      });
    }

    return customer;
  };

  // Create customers for orders
  const adminCustomer = await getOrCreateCustomer(
    'admin@algol.com',
    'Admin User',
    '+1-555-0101'
  );

  const customerCustomer = await getOrCreateCustomer(
    'customer@test.com',
    'Test Customer',
    '+1-555-0102'
  );

  // Helper to generate order number
  const generateOrderNumber = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  // Helper to add days to date
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Sample shipping addresses
  const shippingAddresses = [
    {
      street: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
    },
    {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'USA',
    },
    {
      street: '789 Pine Road, Suite 200',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      country: 'USA',
    },
  ];

  // Orders data
  const ordersData = [
    // Delivered order for customer
    {
      userId: customerUser.id,
      customerId: customerCustomer.id,
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      shippingAddress: shippingAddresses[0],
      items: [
        { productIndex: 0, quantity: 1, variantIndex: 0 },
        { productIndex: 1, quantity: 2, variantIndex: null },
      ],
      createdDaysAgo: 14,
      deliveredDaysAgo: 7,
    },
    // Shipped order for customer
    {
      userId: customerUser.id,
      customerId: customerCustomer.id,
      status: 'SHIPPED',
      paymentStatus: 'PAID',
      shippingAddress: shippingAddresses[0],
      items: [
        { productIndex: 2, quantity: 1, variantIndex: 0 },
      ],
      createdDaysAgo: 5,
      estimatedDeliveryDays: 2,
    },
    // Processing order for customer
    {
      userId: customerUser.id,
      customerId: customerCustomer.id,
      status: 'PROCESSING',
      paymentStatus: 'PAID',
      shippingAddress: shippingAddresses[0],
      items: [
        { productIndex: 3, quantity: 1, variantIndex: null },
        { productIndex: 4, quantity: 3, variantIndex: null },
      ],
      createdDaysAgo: 2,
      estimatedDeliveryDays: 7,
    },
    // Pending order for customer
    {
      userId: customerUser.id,
      customerId: customerCustomer.id,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      shippingAddress: shippingAddresses[0],
      items: [
        { productIndex: 5, quantity: 2, variantIndex: 0 },
      ],
      createdDaysAgo: 1,
      estimatedDeliveryDays: 10,
    },
    // Delivered order for admin
    {
      userId: adminUser.id,
      customerId: adminCustomer.id,
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      shippingAddress: shippingAddresses[1],
      items: [
        { productIndex: 6, quantity: 1, variantIndex: 0 },
        { productIndex: 7, quantity: 1, variantIndex: 0 },
      ],
      createdDaysAgo: 20,
      deliveredDaysAgo: 12,
    },
    // Shipped order for admin
    {
      userId: adminUser.id,
      customerId: adminCustomer.id,
      status: 'SHIPPED',
      paymentStatus: 'PAID',
      shippingAddress: shippingAddresses[1],
      items: [
        { productIndex: 8, quantity: 2, variantIndex: null },
      ],
      createdDaysAgo: 4,
      estimatedDeliveryDays: 3,
    },
    // Confirmed order for admin
    {
      userId: adminUser.id,
      customerId: adminCustomer.id,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      shippingAddress: shippingAddresses[1],
      items: [
        { productIndex: 0, quantity: 1, variantIndex: 1 },
      ],
      createdDaysAgo: 1,
      estimatedDeliveryDays: 8,
    },
  ];

  // Create orders
  for (const orderData of ordersData) {
    const now = new Date();
    const createdAt = addDays(now, -orderData.createdDaysAgo);
    const deliveredAt = orderData.deliveredDaysAgo
      ? addDays(now, -orderData.deliveredDaysAgo)
      : undefined;
    const estimatedDelivery = orderData.estimatedDeliveryDays
      ? addDays(now, orderData.estimatedDeliveryDays)
      : undefined;

    // Calculate order totals
    let subtotal = 0;
    const orderItems = orderData.items.map((item) => {
      const product = products[item.productIndex % products.length];
      const variant = item.variantIndex !== null && product.variants.length > 0
        ? product.variants[item.variantIndex % product.variants.length]
        : null;
      
      const price = variant?.price || product.price;
      subtotal += price * item.quantity;

      return {
        productId: product.id,
        variantId: variant?.id,
        quantity: item.quantity,
        price,
        variantDetails: variant ? JSON.stringify({
          color: variant.color,
          size: variant.size,
          storage: variant.storage,
          name: variant.name,
        }) : undefined,
      };
    });

    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
    const total = subtotal + tax + shipping;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: orderData.userId,
        customerId: orderData.customerId,
        status: orderData.status as any,
        paymentStatus: orderData.paymentStatus as any,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress: JSON.stringify(orderData.shippingAddress),
        estimatedDelivery,
        deliveredAt,
        createdAt,
        updatedAt: createdAt,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    console.log(
      `Created order ${order.orderNumber} - Status: ${order.status}, Total: $${order.total.toFixed(2)}`
    );
  }

  console.log('Order seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding orders:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
