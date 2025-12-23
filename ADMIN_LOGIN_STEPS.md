# 🔐 Admin Login - Step by Step Guide

## Prerequisites
- Application running at `http://localhost:3007`
- PostgreSQL database connected
- Admin account created

---

## STEP 1: Create Admin Account (First Time Only)

### Option A: Using Database Tools

If you want to manually create an admin account in the database:

```sql
-- You can run this via Prisma Studio or direct database access
INSERT INTO users (id, email, password, role, emailVerified, createdAt, updatedAt)
VALUES (
  'admin-001',
  'admin@algol-digital.com',
  'hashed_password_here',
  'ADMIN',
  NOW(),
  NOW(),
  NOW()
);
```

**Note:** The password must be hashed with bcryptjs (10 salt rounds).

### Option B: Using a Simple Setup Script (Recommended)

Create a temp Node.js script:

```javascript
// setup-admin.js
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);

    // Create the admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@algol-digital.com' },
      update: {},
      create: {
        email: 'admin@algol-digital.com',
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
        name: 'Admin User',
      },
    });

    console.log('✅ Admin user created/updated successfully');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: AdminPassword123!');
    console.log('👤 Role:', admin.role);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
```

**Run it:**
```bash
node setup-admin.js
```

---

## STEP 2: Navigate to Login Page

Open your browser and go to:

```
http://localhost:3007/auth/login
```

You should see:
- Email input field
- Password input field
- "Sign In" button
- "Sign up" link (for new users)

---

## STEP 3: Enter Login Credentials

**Email:** `admin@algol-digital.com`
**Password:** `AdminPassword123!` (or whatever password you set)

Click the **"Sign In"** button.

---

## STEP 4: First Login - Complete!

After successful login, you'll be redirected to:

```
http://localhost:3007/admin
```

This is your **Admin Dashboard**.

✅ You're now logged in as admin!

---

## STEP 5: Setup Two-Factor Authentication (2FA)

**Highly Recommended for Security** ⚠️

### 5A: Navigate to Security Settings

Click on **"Security Settings"** or go directly to:

```
http://localhost:3007/admin/security
```

### 5B: Enable 2FA

On the security page, you should see:
- "Two-Factor Authentication" section
- "Enable 2FA" button
- Status: "2FA is currently disabled"

Click **"Enable 2FA"**

### 5C: Scan QR Code

You'll see:
- A QR code
- Your backup codes (save these in a safe place!)

**Scan the QR code** using an authenticator app:
- Google Authenticator
- Microsoft Authenticator
- Authy
- Any TOTP-compatible app

### 5D: Verify 2FA Code

After scanning:
1. Enter the **6-digit code** from your authenticator app
2. Click **"Verify & Enable 2FA"**
3. You should see: "✅ 2FA enabled successfully"

✅ 2FA is now active!

---

## STEP 6: Next Login - With 2FA

When you login again:

1. Enter **Email** and **Password**
2. Click **"Sign In"**
3. You'll be prompted for **2FA Code**
4. Check your authenticator app
5. Enter the **6-digit code**
6. Click **"Verify"**

✅ You're logged in securely!

---

## Admin Dashboard Access

Once logged in, you can access:

### 📊 Dashboard Home
```
http://localhost:3007/admin
```

### 📦 Product Management
```
http://localhost:3007/admin/products
```

### 📋 Categories
```
http://localhost:3007/admin/categories
```

### 📦 Orders
```
http://localhost:3007/admin/orders
```

### 📊 Analytics
```
http://localhost:3007/admin/analytics
```

### 💰 Coupons
```
http://localhost:3007/admin/coupons
```

### 📦 Inventory
```
http://localhost:3007/admin/inventory
```

### 🔒 Security Settings (2FA Management)
```
http://localhost:3007/admin/security
```

---

## Troubleshooting

### ❌ "Invalid email or password"
- Check email spelling: `admin@algol-digital.com`
- Check password is correct
- Verify admin user exists in database

### ❌ "2FA Code Invalid"
- Make sure authenticator app is synced with server time
- Use the current (newest) 6-digit code
- Don't reuse old codes
- Try a code from ±1 time window

### ❌ "Access Denied - 403"
- Verify user has `role: 'ADMIN'` in database
- Clear browser cookies and login again
- Check if session is still valid

### ❌ "Can't access /admin/security"
- Must be logged in first
- Must have ADMIN role
- 2FA endpoints might be down (check server logs)

---

## Security Checklist

✅ Use a **strong password** (12+ characters, mixed case, numbers, symbols)
✅ Save **backup codes** from 2FA setup in secure location
✅ Enable **2FA** immediately after first login
✅ Don't share login credentials with anyone
✅ Logout when done: Click profile → "Sign Out"
✅ Use HTTPS in production (not http)

---

## Quick Reference Commands

### Check if admin account exists
```bash
npx prisma studio
# Then navigate to Users table and search for admin@algol-digital.com
```

### Delete admin account (if needed)
```sql
DELETE FROM users WHERE email = 'admin@algol-digital.com';
```

### Disable 2FA for admin account (if locked out)
```sql
UPDATE users 
SET "twoFactorEnabled" = false, "twoFactorSecret" = NULL 
WHERE email = 'admin@algol-digital.com';
```

---

## Summary

**Quick 5-Step Process:**

1. ✅ Create admin account (`admin@algol-digital.com`)
2. ✅ Go to `http://localhost:3007/auth/login`
3. ✅ Enter email and password
4. ✅ Click "Sign In"
5. ✅ Access admin dashboard at `http://localhost:3007/admin`

**Bonus: Secure with 2FA**

6. ✅ Go to `http://localhost:3007/admin/security`
7. ✅ Click "Enable 2FA"
8. ✅ Scan QR code with authenticator app
9. ✅ Enter verification code
10. ✅ Done! 🎉

---

**Status: Ready for Admin Login** ✅

Go ahead and create your admin account, then login using these steps!
