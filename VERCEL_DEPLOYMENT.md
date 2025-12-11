# Vercel Deployment Guide

## ✅ Code is Pushed to GitHub!

Your code has been successfully pushed to: `https://github.com/Algol-Insights/algol-digital-solutions-website`

## 🚀 Deploy to Vercel - Step by Step

### 1. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `Algol-Insights/algol-digital-solutions-website`
4. Vercel will auto-detect it's a Next.js project

### 2. Configure Environment Variables

In Vercel project settings, add these environment variables:

#### **Required Variables:**

```bash
# Database - Use a production PostgreSQL database (e.g., Neon, Supabase, Railway)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"

# Application URL (Vercel will provide this after first deploy)
NEXT_PUBLIC_API_URL="https://your-project.vercel.app"
NODE_ENV="production"

# Email Configuration (for contact form)
EMAIL_HOST="smtp.gmail.com"  # or your email provider
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="noreply@algol-digital-solutions.com"

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="generate-a-random-32-char-string"
NEXTAUTH_URL="https://your-project.vercel.app"
```

#### **Optional Variables** (configure later):

```bash
# Payment Gateways
STRIPE_PUBLIC_KEY=""
STRIPE_SECRET_KEY=""
PAYPAL_CLIENT_ID=""
MPESA_CONSUMER_KEY=""

# Analytics
GOOGLE_ANALYTICS_ID=""
```

### 3. Set Up Production Database

You need a PostgreSQL database for production. Options:

#### **Option A: Neon (Recommended - Free Tier)**
1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string
5. Add to Vercel as `DATABASE_URL`

#### **Option B: Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Create project
3. Get connection string from Settings → Database
4. Add to Vercel as `DATABASE_URL`

#### **Option C: Railway**
1. Go to [railway.app](https://railway.app)
2. Create PostgreSQL database
3. Get connection string
4. Add to Vercel as `DATABASE_URL`

### 4. Run Database Migrations

After setting up your production database:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Run migrations
DATABASE_URL="your-production-db-url" npx prisma migrate deploy
```

### 5. Seed Production Database

Run the inventory script against your production database:

```bash
# Set production database URL
DATABASE_URL="your-production-db-url" npx ts-node prisma/add-inventory.ts
```

### 6. Deploy!

Click **"Deploy"** in Vercel. It will:
- Install dependencies
- Build the Next.js app
- Deploy to production

### 7. Update NEXT_PUBLIC_API_URL

After first deployment:
1. Copy your Vercel domain (e.g., `https://algol-digital-solutions.vercel.app`)
2. Update `NEXT_PUBLIC_API_URL` in Vercel environment variables
3. Redeploy

## 📝 Post-Deployment Checklist

- [ ] Test homepage loads
- [ ] Verify products page shows all 87 items
- [ ] Test contact form
- [ ] Check logo displays correctly
- [ ] Verify phone number (+263 788 663 313)
- [ ] Confirm "Free delivery in Harare" message
- [ ] Test cart functionality
- [ ] Check mobile responsiveness

## 🔧 Troubleshooting

### Build Fails
- Check all environment variables are set
- Verify DATABASE_URL is correct
- Check build logs in Vercel dashboard

### Products Not Showing
- Verify DATABASE_URL is correct
- Check database has data (run seed script)
- Check API routes are working

### Images Not Loading
- Logo is in `/public/digital-solutions-logo.png` ✅
- Product images use Unsplash URLs ✅

## 🌐 Custom Domain (Optional)

To use your own domain:
1. Go to Vercel project → Settings → Domains
2. Add your domain (e.g., `algol-solutions.co.zw`)
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_API_URL` and `NEXTAUTH_URL` to your domain

## 📊 Current Build Status

- ✅ Production build completed (30 routes)
- ✅ 87 products in database
- ✅ All migrations applied
- ✅ Logo and branding integrated
- ✅ Contact form with API
- ✅ Code pushed to GitHub

**Ready for deployment!** 🚀
