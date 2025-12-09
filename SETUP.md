# Algol Digital Solutions - Setup Guide

This guide will help you set up the Algol Digital Solutions e-commerce platform as an independent project.

## 🎉 What's Been Done

Your project has been successfully separated from the monorepo and is now a standalone application:

✅ All source files copied to `/workspaces/algol-digital-solutions/`
✅ Monorepo dependencies converted to local packages
✅ Git repository initialized with initial commit
✅ Configuration files updated for standalone operation
✅ Import paths updated to use local modules
✅ Environment template created (`.env.example`)

## 📁 Project Structure

```
algol-digital-solutions/
├── app/                      # Next.js App Router pages & API routes
│   ├── api/                 # Backend API endpoints
│   ├── admin/               # Admin dashboard
│   └── ...                  # Public pages (products, cart, etc.)
├── components/              # React components
│   ├── ui/                  # Custom UI components
│   └── ui-lib/              # Shared UI library (from monorepo)
├── lib/                     # Utilities and state management
│   ├── shared/              # Shared utilities (from monorepo)
│   └── db/                  # Database configuration
├── prisma/                  # Database schema & seeds
├── public/                  # Static assets
└── package.json            # Dependencies & scripts
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /workspaces/algol-digital-solutions
npm install
```

### 2. Set Up Environment Variables

Copy the environment template and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your database URL and other credentials:
- `DATABASE_URL`: Your PostgreSQL connection string
- Payment gateway credentials (if using)
- Email service credentials (if using)

### 3. Set Up Database

Generate Prisma client:
```bash
npm run prisma:generate
```

Run migrations (if needed):
```bash
npm run prisma:migrate
```

Seed database with sample data (optional):
```bash
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3007](http://localhost:3007)

## 🌐 Deploying to Production

### Option 1: Vercel (Recommended)

1. Create a GitHub repository:
   ```bash
   # On GitHub, create a new repository: algol-digital-solutions
   
   # Add remote and push
   git remote add origin https://github.com/YOUR_USERNAME/algol-digital-solutions.git
   git branch -M main
   git push -u origin main
   ```

2. Deploy to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env`
   - Deploy!

### Option 2: Docker

```bash
# Build image
docker build -t algol-digital-solutions .

# Run container
docker run -p 3007:3007 --env-file .env algol-digital-solutions
```

### Option 3: Traditional VPS/Server

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 📦 Key Changes from Monorepo

1. **Dependencies**: All `@algol/*` packages are now local:
   - `@algol/ui` → `@/components/ui-lib`
   - `@algol/lib` → `@/lib/shared`
   - `@algol/config-*` → Inline configurations

2. **Configuration Files**: 
   - `next.config.ts` - No longer transpiles monorepo packages
   - `tsconfig.json` - Standalone TypeScript config
   - `tailwind.config.ts` - Standalone Tailwind config

3. **Import Paths**: All imports use local paths (`@/...`)

## 🔧 Available Scripts

```bash
npm run dev              # Start development server (port 3007)
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run typecheck       # TypeScript type checking
npm run seed            # Seed database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio
```

## 🐛 Troubleshooting

### Port Already in Use
If port 3007 is in use, you can change it in `package.json`:
```json
"dev": "next dev -p 3008"
```

### Database Connection Issues
- Verify `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Check firewall/network settings

### Module Not Found Errors
Run:
```bash
rm -rf node_modules .next
npm install
npm run prisma:generate
```

## 📝 Next Steps

1. **Set up GitHub repository** (see deployment section above)
2. **Configure environment variables** for your production environment
3. **Set up CI/CD** (optional) - GitHub Actions, etc.
4. **Configure domain** and SSL certificate
5. **Set up monitoring** and analytics
6. **Configure payment gateways** if using e-commerce features

## 🆘 Support

For issues or questions:
- Check the [README.md](README.md) for general documentation
- Review [BACKEND_SETUP.md](BACKEND_SETUP.md) for backend details
- Open an issue on GitHub (once repository is created)

---

**You're all set!** 🎊 Your Algol Digital Solutions platform is now an independent project.
