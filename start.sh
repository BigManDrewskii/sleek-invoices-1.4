#!/bin/bash

# SleekInvoices Development Server
# Improved start script with dependency check, lock file, and proper dev server management

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RESET='\033[0m'

# Get project root
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

# Lock file to prevent multiple instances
LOCK_FILE="$PROJECT_ROOT/.dev-server.lock"

# Check for lock file
if [ -f "$LOCK_FILE" ]; then
    LOCK_PID=$(cat "$LOCK_FILE" 2>/dev/null)
    # Check if process is still running
    if ps -p "$LOCK_PID" > /dev/null 2>&1; then
        echo -e "${YELLOW}Dev server already running (PID: $LOCK_PID)${RESET}"
        echo -e "${YELLOW}Stop the existing server first or wait for it to finish.${RESET}"
        echo -e "${BLUE}Or run: pnpm dev --host${RESET}"
        exit 1
    fi
fi

# Create lock file with current PID
echo $$ > "$LOCK_FILE"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${RESET}"
    pnpm install --silent --prefer-offline
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Failed to install dependencies${RESET}"
        rm -f "$LOCK_FILE"
        exit 1
    fi
    echo -e "${GREEN}✓ Dependencies installed${RESET}"
fi

# Check if dev server is already running on default port
if lsof -Pi :3003 -sTCP:LISTEN -t &> /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 3003 already in use${RESET}"
    echo -e "${YELLOW}Run: pnpm dev --host to bind to all interfaces${RESET}"
    echo -e "${YELLOW}💡 Tip: Server might be running on different port (0.0.0.0, WiFi). Check 'pnpm dev --host' output.${RESET}"
    lsof -Pi :3003 -sTCP:LISTEN -t | head -1 | awk '{print $2}'
    # Continue to start dev server regardless
fi

# Start dev server with proper options
echo -e "${BLUE}🚀 Starting SleekInvoices development server...${RESET}"
echo -e "${BLUE}   Project: $PROJECT_ROOT${RESET}"
echo -e "${BLUE}   Port: 3003 (all interfaces)${RESET}"
echo -e "${BLUE}   Network: ${GREEN}http://localhost:3003${RESET}"
echo ""

# Clean up lock file on exit
trap 'rm -f "$LOCK_FILE" 2>/dev/null; exit' EXIT INT TERM

# Start server in background
pnpm dev --host &
DEV_PID=$!

# Wait a moment for server to start
sleep 3

# Check if server started successfully
if ps -p $DEV_PID > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Development server started!${RESET}"
    echo ""
    echo -e "${GREEN}➜  Preview URL: ${BLUE}http://localhost:3003${RESET}"
    echo ""
    echo -e "${BLUE}Press Ctrl+C to stop the server${RESET}"
    echo ""
    echo -e "${YELLOW}💡 Tip: Use 'pnpm dev --host' to bind to all network interfaces (0.0.0.0.0, WiFi)${RESET}"
else
    echo -e "${RED}✗ Failed to start development server${RESET}"
    rm -f "$LOCK_FILE"
    exit 1
fi
