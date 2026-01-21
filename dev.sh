#!/bin/bash
# SleekInvoices Local Development Startup Script
# This ensures all environment variables are loaded correctly

set -e

echo "🚀 Starting SleekInvoices Local Development..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker Desktop first."
  exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ .env.local not found. Copying from .env.local.example..."
  cp .env.local.example .env.local
  echo "✅ Created .env.local - please review and update if needed"
fi

# Start Docker MySQL
echo "🐳 Starting MySQL database..."
docker-compose up -d

# Wait for database to be healthy
echo "⏳ Waiting for database to be ready..."
timeout=30
while [ $timeout -gt 0 ]; do
  if docker exec sleekinvoices-db mysqladmin ping -h localhost -uroot -plocaldev123 --silent 2>/dev/null; then
    echo "✅ Database is healthy"
    break
  fi
  sleep 1
  timeout=$((timeout - 1))
done

if [ $timeout -eq 0 ]; then
  echo "❌ Database failed to start within 30 seconds"
  exit 1
fi

# Load environment variables and start dev server
echo "🔧 Starting development server with auth bypass..."
echo "   → Auth bypass enabled (SKIP_AUTH=true)"
echo "   → Database: sleekinvoices_dev (Docker MySQL)"
echo "   → Auto-login as: dev@localhost.test"
echo ""
echo "🌐 Server will be available at: http://localhost:3000/"
echo "   → Landing page: http://localhost:3000/landing"
echo "   → Documentation: http://localhost:3000/docs"
echo "   → Dashboard: http://localhost:3000/dashboard"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Export environment variables from .env.local
export $(grep -v '^#' .env.local | grep -v '^$' | xargs)

# Start development server
pnpm dev
