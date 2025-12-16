import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('Starting to seed users...');

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@algol.com' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      return;
    }

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@algol.com',
        password: adminPassword,
        role: 'admin',
        emailVerified: new Date(),
      },
    });

    console.log(`✅ Created admin user: ${admin.email}`);

    // Create a test customer
    const customerPassword = await bcrypt.hash('test123', 10);
    const customer = await prisma.user.create({
      data: {
        name: 'Test Customer',
        email: 'customer@test.com',
        password: customerPassword,
        role: 'user',
        emailVerified: new Date(),
      },
    });

    console.log(`✅ Created test customer: ${customer.email}`);

    console.log('\n✅ User seeding completed!');
    console.log('\nLogin credentials:');
    console.log('Admin - Email: admin@algol.com, Password: admin123');
    console.log('Customer - Email: customer@test.com, Password: test123');
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

// Run the seed function
seedUsers()
  .then(() => {
    console.log('User seeding completed!');
    prisma.$disconnect();
  })
  .catch((error) => {
    console.error('User seeding failed:', error);
    prisma.$disconnect();
    process.exit(1);
  });
