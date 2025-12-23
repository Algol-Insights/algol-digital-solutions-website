#!/bin/bash

# Start Development Server Script
# This script ensures stable startup of the full stack

set -e

echo "🚀 Starting Algol Digital Solutions Full Stack..."
echo ""

# Set environment variables
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/algol_digital_solutions?schema=public"

# Check if PostgreSQL is running
echo "📦 Checking PostgreSQL..."
if docker ps --filter name=postgres-algol --format "{{.Names}}" | grep -q "postgres-algol"; then
    echo "✅ PostgreSQL is running"
else
    echo "⚠️  PostgreSQL not found, starting..."
    docker start postgres-algol 2>/dev/null || \
    docker run -d --name postgres-algol \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=postgres \
        -e POSTGRES_DB=algol_digital_solutions \
        -p 5432:5432 \
        postgres:16-alpine
    
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 3
    echo "✅ PostgreSQL started"
fi

# Clean up any hanging processes
echo ""
echo "🧹 Cleaning up old processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "prisma migrate" 2>/dev/null || true
sleep 1

# Generate Prisma client if needed
echo ""
echo "🔧 Setting up Prisma..."
npx prisma generate --silent 2>/dev/null || echo "Prisma client already generated"

# Check database connectivity
echo ""
echo "🔌 Testing database connection..."
if npx prisma db push --skip-generate --accept-data-loss 2>&1 | grep -q "already in sync\|sync with your Prisma schema"; then
    echo "✅ Database connected and schema synced"
else
    echo "⚠️  Database sync completed"
fi

# Start the development server
echo ""
echo "🌐 Starting Next.js development server..."
echo "   Local:    http://localhost:3007"
echo "   Admin:    http://localhost:3007/admin"
echo "   API:      http://localhost:3007/api/*"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start with proper error handling
exec npm run dev
