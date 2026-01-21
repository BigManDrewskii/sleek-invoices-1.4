#!/bin/bash
# ============================================
# SleekInvoices Local Development Setup Script
# ============================================
# This script sets up everything you need for local development
# Usage: ./scripts/setup-local.sh
# ============================================

set -e

echo "🚀 SleekInvoices Local Development Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠ pnpm not found. Installing...${NC}"
    npm install -g pnpm
fi
echo -e "${GREEN}✓ pnpm $(pnpm -v)${NC}"

# Check Docker (optional)
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker $(docker -v | cut -d' ' -f3 | tr -d ',')${NC}"
    DOCKER_AVAILABLE=true
else
    echo -e "${YELLOW}⚠ Docker not found. You'll need to provide your own MySQL database.${NC}"
    DOCKER_AVAILABLE=false
fi

echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo -e "${GREEN}✓ Created .env.local${NC}"
else
    echo -e "${YELLOW}⚠ .env.local already exists, skipping...${NC}"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Start Docker if available
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo ""
    echo "🐳 Starting Docker containers..."
    docker-compose up -d
    
    # Wait for MySQL to be ready
    echo "⏳ Waiting for MySQL to be ready..."
    sleep 10
    
    # Check if MySQL is responding
    for i in {1..30}; do
        if docker exec sleekinvoices-db mysqladmin ping -h localhost -u root -plocaldev123 &> /dev/null; then
            echo -e "${GREEN}✓ MySQL is ready${NC}"
            break
        fi
        if [ $i -eq 30 ]; then
            echo -e "${RED}❌ MySQL failed to start. Check docker logs.${NC}"
            exit 1
        fi
        sleep 2
    done
fi

# Push database schema
echo ""
echo "🗄️ Pushing database schema..."
pnpm db:push
echo -e "${GREEN}✓ Database schema pushed${NC}"

# Seed the database
echo ""
echo "🌱 Seeding database with sample data..."
node scripts/seed-local.mjs
echo -e "${GREEN}✓ Database seeded${NC}"

# Done!
echo ""
echo "========================================"
echo -e "${GREEN}✅ Setup complete!${NC}"
echo "========================================"
echo ""
echo "To start development:"
echo "  pnpm dev"
echo ""
echo "Then open:"
echo "  http://localhost:5173"
echo ""
echo "Useful commands:"
echo "  pnpm dev          - Start development server"
echo "  pnpm build        - Build for production"
echo "  pnpm test         - Run tests"
echo "  pnpm db:push      - Push schema changes"
echo "  pnpm db:studio    - Open Drizzle Studio"
echo ""
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "Docker commands:"
    echo "  docker-compose up -d      - Start MySQL"
    echo "  docker-compose down       - Stop MySQL"
    echo "  docker-compose logs -f    - View logs"
    echo ""
    echo "phpMyAdmin available at:"
    echo "  http://localhost:8080"
    echo ""
fi
echo "Happy coding! 🎉"
