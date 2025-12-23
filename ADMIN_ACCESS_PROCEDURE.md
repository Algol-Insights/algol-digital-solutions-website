# 🛡️ Admin Panel Access Procedure - Security & 2FA Guide

## Overview
This document outlines the **secure, best-practice procedure** for admin access to the Algol Digital Solutions platform. The system implements **enterprise-grade security** with Two-Factor Authentication (2FA), role-based access control, and multiple layers of protection.

---

## 🔐 Security Architecture

### Multi-Layer Defense System

```
┌─────────────────────────────────────────────────────────┐
│ 1. AUTHENTICATION LAYER                                 │
│    - Secure login with email & password                 │
│    - bcryptjs password hashing (10 salt rounds)         │
│    - NextAuth session management                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 2. 2FA VERIFICATION LAYER (TOTP)                        │
│    - Time-based One-Time Password                       │
│    - Works with Google Authenticator, Authy, etc.       │
│    - 6-digit code (30-second window)                    │
│    - Window tolerance: ±2 codes for clock drift         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 3. MIDDLEWARE PROTECTION LAYER                          │
│    - Edge-level auth checks on all /admin routes        │
│    - JWT token validation                               │
│    - Returns 403 Forbidden for unauthorized access      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 4. ROLE-BASED ACCESS CONTROL (RBAC)                     │
│    - Admin role verification                            │
│    - Route-level permission checks                      │
│    - API endpoint protection                            │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Admin Onboarding Steps

### Step 1: Create Admin Account (By System Admin)

**For new admin users, system administrator performs:**

```bash
# Create user via admin API with role=ADMIN
POST /api/admin/users
{
  "email": "admin@algol.com",
  "name": "Admin Name",
  "password": "secure-temporary-password",
  "role": "ADMIN"
}
```

**Or via Prisma Studio directly:**
1. Navigate to: `http://localhost:5555` (Prisma Studio)
2. Open `User` model
3. Create new record with:
   - email: admin email
   - name: admin name
   - password: bcrypt hashed password
   - role: `ADMIN`
   - twoFactorEnabled: `false` (initially)

---

## 🚀 First-Time Admin Login & 2FA Setup

### Phase 1: Initial Login

**Step 1.1: Navigate to Login**
```
URL: https://algol-digital-solutions.com/auth/login
```

**Step 1.2: Enter Credentials**
- Email: `admin@algol.com`
- Password: `<temporary-password-received>`
- Click: "Sign In"

**Step 1.3: System Response**
- ✅ Credentials validated with bcryptjs
- ✅ 2FA check performed
- ✅ If not enabled: Redirect to `/account` (temporary redirect)
- ✅ If enabled: Prompt for 2FA code

---

### Phase 2: Enable Two-Factor Authentication

**Step 2.1: Navigate to Security Settings**
```
URL: https://algol-digital-solutions.com/admin/security
```

**Step 2.2: Click "Enable 2FA"**
- Button triggers: POST `/api/admin/2fa/setup`
- System generates:
  - TOTP secret (base32 encoded)
  - QR code (Data URI)

**Step 2.3: Two Options for Setup**

#### Option A: Scan QR Code (Recommended)
1. Open authenticator app:
   - Google Authenticator
   - Microsoft Authenticator
   - Authy
   - 1Password
   - LastPass Authenticator
2. Tap "+" → "Scan QR code"
3. Scan the QR code displayed on screen
4. Authenticator shows 6-digit code

#### Option B: Manual Entry
1. If QR code won't scan
2. Click "Can't scan? Enter manually"
3. Copy the secret key shown
4. In authenticator app: "+" → "Enter setup key"
5. Paste the secret key
6. Select "Time-based" as type

**Step 2.4: Verify 2FA Setup**
1. Enter the 6-digit code from authenticator
2. Click "Verify & Enable 2FA"
3. System validates:
   - POST `/api/admin/2fa/verify`
   - Verifies TOTP token with tolerance window (±2 codes)
   - Sets `twoFactorEnabled = true` in database

**Step 2.5: Save Backup Codes (CRITICAL)**
- Save/print backup codes shown on screen
- Store in secure location (password manager, safe, etc.)
- Use if phone/authenticator is lost

---

### Phase 3: Change Password (Recommended)

**Step 3.1: Navigate to Account Settings**
```
URL: https://algol-digital-solutions.com/account
```

**Step 3.2: Change Password**
1. Enter current password (temporary one received)
2. Enter new strong password (16+ chars recommended)
3. Confirm new password
4. Save

**Password Requirements:**
- ✅ Minimum 12 characters
- ✅ At least 1 uppercase letter
- ✅ At least 1 number
- ✅ At least 1 special character
- ✅ No dictionary words
- ✅ Not similar to email or username

---

## 🔑 Subsequent Admin Logins (With 2FA)

### Standard Login Flow

**Step 1: Access Login Page**
```
URL: https://algol-digital-solutions.com/auth/login
```

**Step 2: Enter Email & Password**
- Email: `admin@algol.com`
- Password: `<your-secure-password>`
- Click: "Sign In"

**Step 3: Enter 2FA Code**
- After password validation succeeds
- A new field appears: "2FA Code (6 digits)"
- Open authenticator app
- Copy the 6-digit code
- Paste into field
- Click: "Verify & Continue"

**Step 4: Access Admin Panel**
- Redirected to: `/admin`
- All admin routes now accessible
- Session established (valid for 30 days default)

---

## 🛡️ Admin Panel Features & Access

### Available Admin Routes

| Route | Purpose | Access Level |
|-------|---------|--------------|
| `/admin` | Dashboard & Overview | ADMIN |
| `/admin/products` | Product Management | ADMIN |
| `/admin/products/new` | Add New Product | ADMIN |
| `/admin/products/[id]` | Edit Product | ADMIN |
| `/admin/categories` | Category Management | ADMIN |
| `/admin/orders` | Order Management | ADMIN |
| `/admin/analytics` | Sales Analytics | ADMIN |
| `/admin/security` | 2FA & Security Settings | ADMIN |
| `/admin/coupons` | Discount Management | ADMIN |
| `/admin/inventory` | Stock Management | ADMIN |

### Protected API Endpoints

All admin API endpoints follow this protection pattern:

```typescript
// Example: POST /api/admin/products
1. Check: Is user logged in? (Session check)
2. Check: Is user an ADMIN? (Role verification)
3. Check: Valid JWT token? (Token validation)
4. Allow: Request processing
5. Return: Response (or 403 Forbidden)
```

**Example Protected Endpoint:**
```bash
POST /api/admin/products/new
Authorization: Bearer <jwt-token>

{
  "name": "Laptop Pro",
  "price": 1299.99,
  "stock": 50
}

Response (Unauthorized):
{ "error": "Unauthorized - Admin access required", "status": 403 }

Response (Authorized):
{ "id": "prod_123", "success": true }
```

---

## 🔄 2FA Management

### Check 2FA Status

**Endpoint:** `GET /api/admin/2fa/status`
```bash
Response:
{
  "enabled": true,
  "lastVerified": "2024-12-16T10:30:00Z"
}
```

### Disable 2FA (If Needed)

**Step 1: Navigate to Security Settings**
```
URL: https://algol-digital-solutions.com/admin/security
```

**Step 2: Click "Disable 2FA"**
- Field appears: "Enter 2FA code to confirm"
- Get current 6-digit code from authenticator
- Enter code
- Click "Disable 2FA"

**Step 3: Confirm**
- POST `/api/admin/2fa/disable`
- System validates code
- Sets `twoFactorEnabled = false`

⚠️ **Warning:** After disabling, admin account is less secure!

---

## 🚨 Security Best Practices

### ✅ DO's

- ✅ Use a **strong, unique password** (16+ characters)
- ✅ Store backup codes in a **secure location** (password manager, etc.)
- ✅ Keep authenticator app **updated**
- ✅ Log out when leaving workstation
- ✅ Enable 2FA **immediately**
- ✅ Review login history regularly
- ✅ Update password **every 90 days**
- ✅ Use different password per platform
- ✅ Clear browser cache before sharing device
- ✅ Report suspicious activity immediately

### ❌ DON'Ts

- ❌ Don't share your admin credentials
- ❌ Don't write passwords on sticky notes
- ❌ Don't use simple/guessable passwords
- ❌ Don't disable 2FA unless absolutely necessary
- ❌ Don't use public Wi-Fi for admin access
- ❌ Don't save passwords in browser
- ❌ Don't share QR code screenshots
- ❌ Don't forget to log out
- ❌ Don't use same password across sites
- ❌ Don't click suspicious email links

---

## 🆘 Troubleshooting

### Problem: "2FA_REQUIRED" but can't access authenticator

**Solution:**
1. Use backup codes to access account
2. Go to Security Settings
3. Disable 2FA
4. Set up new authenticator

### Problem: TOTP code keeps showing "Invalid"

**Possible Causes:**
1. **Clock skew:** Device time is incorrect
   - Sync time on authenticator device
   - Server time is synchronized (UTC)

2. **Code expired:** Code only valid for 30 seconds
   - Wait for new code to generate
   - Try code ±1 (system allows ±2 window)

3. **Secret lost:** If re-setup needed
   - Click "Can't scan?"
   - Manually enter secret key again

### Problem: Lost access to authenticator phone

**Recovery:**
1. Use backup codes (save them!)
2. Contact system administrator
3. Admin verifies identity
4. Reset 2FA from database
5. Re-setup new authenticator

### Problem: "Unauthorized - Admin access required"

**Possible Causes:**
1. Account role is not ADMIN
   - Contact admin to upgrade role
2. Session expired
   - Log in again
3. Token invalid
   - Clear cookies, re-login

---

## 📊 Database Schema (Security Related)

```prisma
model User {
  id                 String    @id @default(cuid())
  email              String    @unique
  password           String?
  role               String    @default("user")  // "user" | "ADMIN"
  twoFactorEnabled   Boolean   @default(false)
  twoFactorSecret    String?   // Base32 encoded TOTP secret
  emailVerified      DateTime?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}
```

**Key Security Fields:**
- `password`: Hashed with bcryptjs (10 salt rounds)
- `role`: Controls admin panel access
- `twoFactorEnabled`: Boolean flag
- `twoFactorSecret`: Encrypted TOTP secret

---

## 🔍 Audit Trail

### Login Attempts Tracked
- ✅ Email address
- ✅ Timestamp (UTC)
- ✅ IP address (middleware)
- ✅ Success/Failure reason
- ✅ 2FA verification result

**Note:** Implement audit logging in production:
```typescript
POST /api/admin/audit
{
  "action": "login",
  "user": "admin@algol.com",
  "timestamp": "2024-12-16T10:30:00Z",
  "ip": "192.168.1.1",
  "status": "success",
  "twoFactorUsed": true
}
```

---

## 🔗 Quick Links

- **Admin Panel:** http://localhost:3007/admin
- **Login:** http://localhost:3007/auth/login
- **Security Settings:** http://localhost:3007/admin/security
- **Account Settings:** http://localhost:3007/account
- **Prisma Studio:** http://localhost:5555
- **API Docs:** http://localhost:3007/api/*

---

## 📞 Support & Emergency

### Emergency Access (Lost 2FA)

1. **If backup codes available:**
   - Use backup code to login
   - Go to Security Settings
   - Disable 2FA
   - Re-setup new authenticator

2. **If no backup codes & no access:**
   - Contact system administrator
   - Provide identity verification
   - Admin can reset via database:
     ```sql
     UPDATE users 
     SET "twoFactorEnabled" = false, "twoFactorSecret" = NULL
     WHERE email = 'admin@algol.com';
     ```

### Report Security Issues

- 🚨 Suspicious login attempts → Change password immediately
- 🚨 Compromised device → Disable 2FA, enable on new device
- 🚨 Data breach suspected → Contact IT security team
- 🚨 Unauthorized access → Report incident immediately

---

## 📝 Compliance & Standards

This system implements:
- ✅ **TOTP (RFC 6238)** - Industry standard 2FA
- ✅ **bcryptjs (PBKDF2)** - Password hashing best practices
- ✅ **NextAuth** - Secure session management
- ✅ **JWT Tokens** - Stateless authentication
- ✅ **RBAC** - Role-based access control
- ✅ **Middleware Protection** - Edge-level security

---

## 🎯 Version & Last Updated

- **Version:** 1.0
- **Last Updated:** December 16, 2024
- **System:** Algol Digital Solutions Admin Panel
- **Next Review:** June 16, 2025

---

**Remember: Security is a shared responsibility. Follow these procedures carefully to protect your admin account and the platform.**

🔐 **Stay Secure!**
