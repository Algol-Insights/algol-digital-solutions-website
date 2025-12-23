#!/bin/bash

# Algol Digital Solutions - Server Quick Start
# This script starts the full stack with stability optimizations

set -e  # Exit on error

echo "🚀 Starting Algol Digital Solutions Website..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PostgreSQL is running
echo -e "${BLUE}📊 Checking PostgreSQL...${NC}"
if docker ps | grep -q postgres; then
    echo -e "${GREEN}✅ PostgreSQL is running${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL not running, starting...${NC}"
    docker start $(docker ps -aq --filter "ancestor=postgres:17.2-alpine") 2>/dev/null || \
    docker run -d \
      --name algol-postgres \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_DB=algol_digital_solutions \
      -p 5432:5432 \
      postgres:17.2-alpine
    sleep 3
    echo -e "${GREEN}✅ PostgreSQL started${NC}"
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 not installed, installing...${NC}"
    npm install -g pm2
fi

# Navigate to project directory
cd /workspaces/algol-digital-solutions-website

# Kill any process on port 3007
echo -e "${BLUE}🔧 Checking for port conflicts...${NC}"
if lsof -ti:3007 &> /dev/null; then
    echo -e "${YELLOW}⚠️  Port 3007 in use, clearing...${NC}"
    fuser -k 3007/tcp 2>/dev/null || true
    sleep 2
fi

# Start or restart the server with PM2
echo -e "${BLUE}🌐 Starting Next.js server with PM2...${NC}"
if pm2 list | grep -q algol-website; then
    pm2 restart algol-website --update-env
else
    pm2 start ecosystem.config.js
fi

# Save PM2 configuration
pm2 save > /dev/null 2>&1

# Wait for server to be ready
echo -e "${BLUE}⏳ Waiting for server to start...${NC}"
sleep 8

# Test the server
echo -e "${BLUE}🧪 Testing server...${NC}"
if curl -s -f http://localhost:3007/api/products?limit=1 > /dev/null; then
    echo -e "${GREEN}✅ Server is running!${NC}"
else
    echo -e "${YELLOW}⚠️  Server is starting... check logs with: pm2 logs algol-website${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ Server is ready!${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "🌐 URL:           ${BLUE}http://localhost:3007${NC}"
echo -e "📊 Status:        ${BLUE}pm2 status${NC}"
echo -e "📝 Logs:          ${BLUE}pm2 logs algol-website${NC}"
echo -e "🔄 Restart:       ${BLUE}pm2 restart algol-website${NC}"
echo -e "⛔ Stop:          ${BLUE}pm2 stop algol-website${NC}"
echo -e "📈 Monitor:       ${BLUE}pm2 monit${NC}"
echo ""
echo "═══════════════════════════════════════════════════════════"
