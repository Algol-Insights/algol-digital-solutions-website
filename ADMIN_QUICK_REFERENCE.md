# 🚀 Admin Quick Reference Guide

## ⚡ Quick Access Links

| Link | Purpose | URL |
|------|---------|-----|
| 🏠 Home | Main website | http://localhost:3007 |
| 🔐 Login | Admin login | http://localhost:3007/auth/login |
| 📊 Dashboard | Admin panel home | http://localhost:3007/admin |
| 🛡️ Security | 2FA setup/management | http://localhost:3007/admin/security |
| 📦 Products | Product management | http://localhost:3007/admin/products |
| 📑 Categories | Category management | http://localhost:3007/admin/categories |
| 📋 Orders | Order management | http://localhost:3007/admin/orders |
| 💰 Analytics | Sales analytics | http://localhost:3007/admin/analytics |
| 🎟️ Coupons | Discount codes | http://localhost:3007/admin/coupons |
| 📈 Inventory | Stock management | http://localhost:3007/admin/inventory |
| 👤 Account | Personal settings | http://localhost:3007/account |
| 🗄️ Database | Database UI | http://localhost:5555 |

---

## 🔐 5-Minute First Login

### Step 1: Open Login Page (1 min)
```
URL: http://localhost:3007/auth/login
```

### Step 2: Enter Credentials (1 min)
```
Email: your-admin-email@algol.com
Password: your-secure-password
Click: "Sign In"
```

### Step 3: Setup 2FA (2 min)
```
1. Navigate to: http://localhost:3007/admin/security
2. Click "Enable 2FA"
3. Scan QR code with Google Authenticator/Authy
4. Enter 6-digit code
5. Click "Verify & Enable"
```

### Step 4: Done! ✅
You're now in the admin panel with 2FA enabled!

---

## 🔑 Login with 2FA (Subsequent Times)

```
1. Go to: http://localhost:3007/auth/login
2. Enter email
3. Enter password
4. Click "Sign In"
5. Get 6-digit code from authenticator app
6. Enter code in "2FA Code" field
7. Click "Verify & Continue"
8. Access admin panel
```

**Time Required:** ~30 seconds

---

## 📋 Common Admin Tasks

### Add New Product
```
1. Click: "Products" in sidebar
2. Click: "Add New Product" button
3. Fill in:
   - Name
   - Price
   - Category
   - Description
   - Stock quantity
   - Images
4. Click: "Save Product"
```

### Mark Product as Featured
```
1. Go to Products
2. Find product
3. Click "Edit"
4. Check: "Featured Product"
5. Save
```

### Mark Product as Hot Deal (On Sale)
```
1. Go to Products
2. Find product
3. Click "Edit"
4. Check: "On Sale"
5. Enter original price
6. Save
```

### Create Coupon/Discount
```
1. Click: "Coupons" in sidebar
2. Click: "Create Coupon"
3. Fill in:
   - Code (e.g., "SUMMER20")
   - Discount %
   - Valid from/to dates
   - Usage limit
4. Save
```

### View Orders
```
1. Click: "Orders" in sidebar
2. Filter by:
   - Status
   - Date range
   - Customer
3. Click order for details
```

### Check Analytics
```
1. Click: "Analytics" in sidebar
2. View:
   - Sales chart
   - Revenue total
   - Orders count
   - Popular products
   - Customer growth
```

---

## ⚠️ Security Reminders

✅ **Always:**
- ✅ Enable 2FA immediately
- ✅ Use strong password (16+ chars recommended)
- ✅ Save backup codes in secure location
- ✅ Log out after work
- ✅ Update password every 90 days
- ✅ Report suspicious activity

❌ **Never:**
- ❌ Share your login credentials
- ❌ Write password on paper
- ❌ Use same password across sites
- ❌ Click suspicious email links
- ❌ Disable 2FA
- ❌ Leave workstation unattended while logged in

---

## 🆘 Troubleshooting

### "Invalid 2FA code"
```
Fix:
1. Check phone time is correct
2. Wait for new code to appear
3. Try code before current one
4. If still fails, rescan QR code
```

### "Can't scan QR code"
```
Fix:
1. Click "Can't scan? Enter manually"
2. Copy secret key
3. In authenticator: "+" → "Enter setup key"
4. Paste secret key
5. Tap "Add"
```

### "Lost access to phone"
```
Fix:
1. Use backup codes if you have them
2. Click "Use backup code" on login
3. Enter backup code
4. Log in and disable 2FA
5. Setup new authenticator
```

### "Locked out of account"
```
Fix:
1. Contact system administrator
2. Provide identity verification
3. Admin will reset access
```

---

## 🎯 Best Practice Workflow

### Daily Admin Check-in
```
1. Login with 2FA (30 sec)
2. Check Dashboard (1 min)
3. Review new orders (3 min)
4. Check low stock items (2 min)
5. Review customer support (2 min)
Total: ~8 minutes
```

### Weekly Admin Tasks
```
Monday:
- Review weekend sales
- Check for errors/issues

Wednesday:
- Update featured products
- Create new deals

Friday:
- Review analytics
- Plan next week campaigns

Sunday:
- Prepare inventory for week
```

### Monthly Admin Tasks
```
- Update password
- Review admin activity logs
- Check system security alerts
- Plan upcoming promotions
- Review customer feedback
```

---

## 📊 Admin Permissions by Role

### ADMIN (Full Access)
- ✅ All products management
- ✅ All categories management
- ✅ All orders management
- ✅ All analytics access
- ✅ Coupon management
- ✅ Inventory management
- ✅ Security settings
- ✅ User management

### USER (Limited Access)
- ❌ Admin panel restricted
- ✅ View own orders
- ✅ View own account
- ✅ Write reviews
- ✅ Save favorites

---

## 🔌 API Endpoints (For Developers)

### Products API
```bash
# Get all products
GET /api/products

# Get featured products
GET /api/products?featured=true

# Get on-sale products
GET /api/products?onSale=true

# Get by category
GET /api/products?category=laptops

# Search
GET /api/products?search=dell
```

### Admin API
```bash
# Create product
POST /api/admin/products
Authorization: Bearer {token}

# Update product
PUT /api/admin/products/[id]
Authorization: Bearer {token}

# Delete product
DELETE /api/admin/products/[id]
Authorization: Bearer {token}
```

---

## 📞 Support Contacts

### Technical Issues
- **Email:** support@algol.com
- **Phone:** +1-XXX-XXX-XXXX
- **Slack:** #admin-support

### Security Issues
- **Email:** security@algol.com
- **URGENT:** Contact IT immediately

### Feature Requests
- **Form:** http://localhost:3007/admin/feedback
- **Email:** features@algol.com

---

## 📚 Full Documentation

For detailed information, see:
- 📄 [ADMIN_ACCESS_PROCEDURE.md](./ADMIN_ACCESS_PROCEDURE.md) - Complete procedures
- ✅ [ADMIN_SECURITY_CHECKLIST.md](./ADMIN_SECURITY_CHECKLIST.md) - Security checklist
- 🔐 [2FA_SETUP.md](./2FA_SETUP.md) - 2FA details
- 🛠️ [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Backend info

---

## ⏱️ Response Times

| Action | Time |
|--------|------|
| Login with 2FA | ~30 seconds |
| Load Dashboard | ~2 seconds |
| Add Product | ~5 seconds |
| Search Products | ~1 second |
| Generate Report | ~10 seconds |

---

## 💾 Database Backup

**Automatic:** Every 24 hours at 2:00 AM UTC
**Manual:** Via Prisma Studio or admin panel

To backup manually:
```bash
# Via terminal
npm run prisma:studio

# Or access: http://localhost:5555
```

---

## 🎓 Training Videos

| Topic | Link | Duration |
|-------|------|----------|
| First Login & 2FA | Coming Soon | 5 min |
| Product Management | Coming Soon | 10 min |
| Order Management | Coming Soon | 8 min |
| Analytics Deep Dive | Coming Soon | 15 min |
| Security Best Practices | Coming Soon | 7 min |

---

**Last Updated:** December 16, 2024
**Version:** 1.0
**Status:** ✅ ACTIVE

🎉 **Ready to manage your store securely!**
