# Deployment Guide - Algol Digital Solutions E-Commerce Platform

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Docker (optional)
- Vercel CLI or deployment platform of choice

## Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secure-random-secret-32chars+"

# Email (SMTP)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-password"
EMAIL_FROM="noreply@yourdomain.com"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-secret"

# AWS S3 (for image storage)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"

# Redis (for caching)
REDIS_URL="redis://localhost:6379"

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

## Database Setup

### 1. Run Migrations

```bash
npx prisma migrate deploy
```

### 2. Seed Database (optional)

```bash
npx prisma db seed
```

## Build Process

### 1. Install Dependencies

```bash
npm ci --production
```

### 2. Build Application

```bash
npm run build
```

### 3. Start Production Server

```bash
npm start
```

## Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Vercel Configuration (`vercel.json`):**

```json
{
  "buildCommand": "prisma generate && next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret"
  }
}
```

### Option 2: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**Docker Compose:**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/algol
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret
    depends_on:
      - db
    
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: algol
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Option 3: AWS / DigitalOcean / Other Cloud

1. **Set up server** (Ubuntu 22.04 LTS)
2. **Install Node.js and PM2:**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

3. **Clone and setup:**

```bash
git clone https://github.com/Algol-Insights/algol-digital-solutions-website.git
cd algol-digital-solutions-website
npm install
npx prisma generate
npm run build
```

4. **Start with PM2:**

```bash
pm2 start npm --name "algol-store" -- start
pm2 save
pm2 startup
```

## CI/CD Pipeline

### GitHub Actions (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] SSL/TLS certificate installed
- [ ] DNS records configured
- [ ] Stripe webhooks configured
- [ ] Email service verified
- [ ] Monitoring setup (Sentry, LogRocket, etc.)
- [ ] Backup strategy implemented
- [ ] CDN configured (Cloudflare, etc.)
- [ ] Performance testing completed
- [ ] Security audit passed

## Monitoring & Maintenance

### Health Checks

Create `/api/health/route.ts`:

```typescript
export async function GET() {
  return Response.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  })
}
```

### Error Tracking

Install Sentry:

```bash
npm install @sentry/nextjs
```

### Performance Monitoring

- Use Vercel Analytics
- Google Lighthouse
- WebPageTest

### Backup Strategy

```bash
# Database backup (daily)
pg_dump -U username dbname > backup_$(date +%Y%m%d).sql

# Automated with cron
0 2 * * * /path/to/backup-script.sh
```

## Scaling Considerations

1. **Database:** Use read replicas for high traffic
2. **Caching:** Implement Redis for session and API caching
3. **CDN:** Use Cloudflare or AWS CloudFront
4. **Load Balancing:** Multiple app instances behind load balancer
5. **Image Optimization:** Use Next.js Image Optimization API or external service

## Support

For deployment issues, contact: devops@algoldigital.com
