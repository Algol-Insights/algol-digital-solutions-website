# Algol Digital Solutions

A modern, full-stack e-commerce platform built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

- 🛍️ Full-featured e-commerce storefront
- 📊 Admin dashboard for inventory, products, and orders management
- 🔐 Customer account management
- 💳 Multiple payment gateway integration (Stripe, PayPal, M-Pesa)
- 📦 Order tracking and management
- 🔍 Advanced product search and filtering
- ⭐ Product reviews and ratings
- 🎨 Responsive design with dark/light theme support
- 📧 Email notifications for orders
- 📈 Analytics and reporting

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **State Management**: Zustand
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL database (or Supabase account)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd algol-digital-solutions
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database and API credentials.

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. Seed the database (optional):
```bash
npm run seed
```

7. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3007](http://localhost:3007) to see the application.

## Available Scripts

- `npm run dev` - Start development server on port 3007
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run seed` - Seed database with sample data
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard pages
│   ├── products/          # Product pages
│   └── ...
├── components/            # React components
│   ├── ui/               # UI components
│   └── ui-lib/           # Shared UI library
├── lib/                   # Utility functions and stores
│   ├── shared/           # Shared libraries (SEO, constants)
│   └── db/               # Database configuration
├── prisma/               # Prisma schema and migrations
└── public/               # Static assets

```

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_API_URL="http://localhost:3007"
# Add other environment variables as needed
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t algol-digital-solutions .
docker run -p 3007:3007 algol-digital-solutions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For support, email support@algol-insights.com or open an issue in the GitHub repository.
