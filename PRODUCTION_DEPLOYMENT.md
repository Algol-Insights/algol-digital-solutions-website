# 🚀 Production Deployment Guide

## ✅ Code Status
- **Commit**: b51c8f4
- **Build**: ✅ Passes locally
- **Branch**: main
- **Repository**: https://github.com/Algol-Insights/algol-digital-solutions-website

## 🔧 Vercel Configuration Needed

### 1. Add Production Database URL

Go to: https://vercel.com/nygels-projects-786afebe/algol-digital-solutions-website/settings/environment-variables

Add the following environment variables:

#### **Critical (Required for deployment)**:
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

> **Important**: Your current DATABASE_URL points to `localhost` which won't work in production.  
> You need a cloud-hosted database from:
> - **Neon** (https://neon.tech) - Free tier available
> - **Supabase** (https://supabase.com) - Free tier available  
> - **Railway** (https://railway.app) - Pay as you go

#### **Required for functionality**:
```env
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://algol-digital-solutions-website-37pwc7qaz.vercel.app

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@algoldigital.com

NEXT_PUBLIC_API_URL=https://algol-digital-solutions-website-37pwc7qaz.vercel.app
NODE_ENV=production
```

#### **Optional (can add later)**:
```env
OPENAI_API_KEY=your-openai-key
ADMIN_IP_ALLOWLIST=your-office-ip
DATA_ENCRYPTION_KEY=your-encryption-key
```

### 2. Run Database Migrations

After adding DATABASE_URL, SSH into Vercel or run locally:

```bash
# Set your production DATABASE_URL
export DATABASE_URL="postgresql://..."

# Run migrations
npx prisma migrate deploy

# Seed initial data
npx prisma db seed
```

### 3. Redeploy

After adding environment variables:

```bash
cd /workspaces/algol-digital-solutions-website
vercel --prod
```

Or trigger a redeployment from the Vercel dashboard.

## 📍 Your Deployment URL

**Production**: https://algol-digital-solutions-website-37pwc7qaz.vercel.app  
**Inspect**: https://vercel.com/nygels-projects-786afebe/algol-digital-solutions-website

## 🗂️ Database Setup Instructions

### Option 1: Neon (Recommended)

1. Go to https://neon.tech
2. Sign up with GitHub
3. Create new project: "algol-digital-solutions"
4. Copy connection string from dashboard
5. Add to Vercel environment variables as `DATABASE_URL`

### Option 2: Supabase

1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy "Direct connection" string (not pooler)
5. Add to Vercel as `DATABASE_URL`

### Option 3: Railway

1. Go to https://railway.app
2. New Project → Provision PostgreSQL
3. Copy connection string
4. Add to Vercel as `DATABASE_URL`

## 🎯 Post-Deployment Checklist

- [ ] DATABASE_URL configured
- [ ] Migrations run successfully
- [ ] Admin user created
- [ ] Test product creation
- [ ] Test order flow
- [ ] Test email notifications
- [ ] Configure custom domain (optional)
- [ ] Add OpenAI payment method for AI features

## 🔍 Troubleshooting

### Build fails with "Module not found"
- Ensure all imports use `@/lib/db/prisma` not `@/lib/prisma`
- Clear Vercel cache: Settings → General → Clear Cache

### Database connection errors
- Verify DATABASE_URL format
- Check database allows connections from Vercel IPs
- Ensure SSL mode is configured if required

### 500 errors after deployment
- Check Vercel logs in dashboard
- Verify all required environment variables are set
- Check database has been migrated

## 📞 Support

If deployment issues persist, check:
- Vercel dashboard logs
- GitHub Actions (if configured)
- Database provider status page
