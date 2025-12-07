#!/bin/bash

# IOG Platform - Complete Restart Script
# Restarts all services with fresh builds

echo "🔄 Restarting ALL IOG Services"
echo "==============================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Kill existing processes on ports
echo -e "${YELLOW}Stopping existing services...${NC}"
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3002 | xargs kill -9 2>/dev/null || true
lsof -ti:3003 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

sleep 2

echo -e "${GREEN}✓ Ports cleared${NC}"
echo ""

# Build all services
echo "Building services..."
cd /Users/adarshpriydarshi/Desktop/IOG/backend/services/auth-service
npm run build &> /dev/null &

cd /Users/adarshpriydarshi/Desktop/IOG/backend/services/complaint-service  
npm run build &> /dev/null &

cd /Users/adarshpriydarshi/Desktop/IOG/backend/services/crime-service
npm run build &> /dev/null &

wait
echo -e "${GREEN}✓ All services built${NC}"
echo ""

# Instructions
echo "=============================="
echo "📋 Next Steps:"
echo "=============================="
echo ""
echo "Open 4 separate terminals and run:"
echo ""
echo -e "${YELLOW}Terminal 1 - Auth Service:${NC}"
echo "cd /Users/adarshpriydarshi/Desktop/IOG/backend/services/auth-service"
echo "npm run dev"
echo ""
echo -e "${YELLOW}Terminal 2 - Complaint Service:${NC}"
echo "cd /Users/adarshpriydarshi/Desktop/IOG/backend/services/complaint-service"
echo "npm run dev"
echo ""
echo -e "${YELLOW}Terminal 3 - Crime Service:${NC}"
echo "cd /Users/adarshpriydarshi/Desktop/IOG/backend/services/crime-service"
echo "npm run dev"
echo ""
echo -e "${YELLOW}Terminal 4 - Frontend:${NC}"
echo "cd /Users/adarshpriydarshi/Desktop/IOG/frontend"
echo "npm run dev"
echo ""
echo "=============================="
echo -e "${GREEN}Then access: http://localhost:3000${NC}"
echo "=============================="
