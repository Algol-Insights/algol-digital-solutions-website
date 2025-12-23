#!/bin/bash

# Admin Setup Script - Creates a test admin account

cd /workspaces/algol-digital-solutions-website

echo "🔐 Creating Admin Account..."
echo ""

# Create a temporary Node.js script
cat > /tmp/create-admin.js << 'EOF'
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔄 Hashing password...');
    const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);

    console.log('📝 Creating admin user...');
    const admin = await prisma.user.upsert({
      where: { email: 'admin@algol-digital.com' },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
      },
      create: {
        id: 'admin-' + Date.now(),
        email: 'admin@algol-digital.com',
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
        name: 'Admin User',
      },
    });

    console.log('');
    console.log('╔════════════════════════════════════════════╗');
    console.log('║     ✅ Admin Account Created Successfully  ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');
    console.log('📧 Email:    admin@algol-digital.com');
    console.log('🔑 Password: AdminPassword123!');
    console.log('👤 Role:     ADMIN');
    console.log('🔒 2FA:      Not yet enabled');
    console.log('');
    console.log('📍 Next Steps:');
    console.log('   1. Go to http://localhost:3007/auth/login');
    console.log('   2. Enter email and password above');
    console.log('   3. Click "Sign In"');
    console.log('   4. Go to /admin/security to enable 2FA');
    console.log('');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
EOF

# Run the script
node /tmp/create-admin.js

# Cleanup
rm /tmp/create-admin.js
