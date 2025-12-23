const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function seedTestUsers() {
  console.log('🌱 Seeding test users...')
  
  // Admin credentials
  const adminPassword = await bcrypt.hash('Admin@123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@algoldigital.com' },
    update: {},
    create: {
      email: 'admin@algoldigital.com',
      name: 'System Administrator',
      password: adminPassword,
      role: 'admin',
      phone: '+263 788 663 313',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Customer 1
  const customer1Password = await bcrypt.hash('Customer@123', 10)
  const customer1 = await prisma.user.upsert({
    where: { email: 'customer1@example.com' },
    update: {},
    create: {
      email: 'customer1@example.com',
      name: 'John Doe',
      password: customer1Password,
      role: 'user',
      phone: '+263 772 123 456',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Customer 1 created:', customer1.email)

  // Customer 2
  const customer2Password = await bcrypt.hash('Customer@123', 10)
  const customer2 = await prisma.user.upsert({
    where: { email: 'customer2@example.com' },
    update: {},
    create: {
      email: 'customer2@example.com',
      name: 'Jane Smith',
      password: customer2Password,
      role: 'user',
      phone: '+263 773 234 567',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Customer 2 created:', customer2.email)

  // Sales Staff
  const salesPassword = await bcrypt.hash('Sales@123', 10)
  const sales = await prisma.user.upsert({
    where: { email: 'sales@algoldigital.com' },
    update: {},
    create: {
      email: 'sales@algoldigital.com',
      name: 'Sales Team',
      password: salesPassword,
      role: 'admin',
      phone: '+263 788 663 313',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Sales staff created:', sales.email)

  console.log('\n📋 Test Credentials Summary:')
  console.log('====================================')
  console.log('\n👨‍💼 ADMIN ACCESS:')
  console.log('   Email: admin@algoldigital.com')
  console.log('   Password: Admin@123')
  console.log('\n👨‍💼 SALES ACCESS:')
  console.log('   Email: sales@algoldigital.com')
  console.log('   Password: Sales@123')
  console.log('\n👤 CUSTOMER 1:')
  console.log('   Email: customer1@example.com')
  console.log('   Password: Customer@123')
  console.log('\n👤 CUSTOMER 2:')
  console.log('   Email: customer2@example.com')
  console.log('   Password: Customer@123')
  console.log('====================================\n')
}

seedTestUsers()
  .catch((e) => {
    console.error('Error seeding users:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
