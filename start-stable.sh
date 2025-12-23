#!/bin/bash

# Stable Development Server Startup Script
# This script ensures the server starts cleanly and handles crashes better

set -e  # Exit on error

echo "🚀 Starting Algol Digital Solutions - Stable Mode"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if PostgreSQL container is running
echo -e "\n${YELLOW}1. Checking PostgreSQL container...${NC}"
if docker ps --filter "name=algol-postgres" --format "{{.Names}}" | grep -q algol-postgres; then
    echo -e "${GREEN}✓ PostgreSQL container is running${NC}"
else
    echo -e "${RED}✗ PostgreSQL container is not running. Starting...${NC}"
    docker start algol-postgres 2>/dev/null || docker run -d \
      --name algol-postgres \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_DB=algol_digital_solutions \
      -p 5432:5432 \
      postgres:17.2
    sleep 3
fi

# Generate Prisma Client
echo -e "\n${YELLOW}2. Generating Prisma Client...${NC}"
npx prisma generate > /dev/null 2>&1
echo -e "${GREEN}✓ Prisma Client generated${NC}"

# Push schema changes (if any)
echo -e "\n${YELLOW}3. Syncing database schema...${NC}"
npx prisma db push --accept-data-loss > /dev/null 2>&1
echo -e "${GREEN}✓ Database schema synced${NC}"

# Check for port conflicts
echo -e "\n${YELLOW}4. Checking port 3007...${NC}"
if lsof -Pi :3007 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${RED}✗ Port 3007 is in use. Killing process...${NC}"
    kill -9 $(lsof -ti:3007) 2>/dev/null || true
    sleep 1
fi
echo -e "${GREEN}✓ Port 3007 is available${NC}"

# Clear Next.js cache for clean start
echo -e "\n${YELLOW}5. Clearing Next.js cache...${NC}"
rm -rf .next
echo -e "${GREEN}✓ Cache cleared${NC}"

# Set optimal Node.js memory settings for stability
export NODE_OPTIONS="--max-old-space-size=4096 --max-http-header-size=32768"

# Start the development server with Turbopack
echo -e "\n${GREEN}6. Starting Next.js development server...${NC}"
echo -e "${YELLOW}   URL: http://localhost:3007${NC}"
echo -e "${YELLOW}   Press Ctrl+C to stop${NC}"
echo -e "${YELLOW}   With Turbopack enabled for faster rebuilds${NC}"
echo "=================================================="
echo ""

# Use --turbopack for faster builds and better stability
exec npm run dev:stable
