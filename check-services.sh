#!/bin/bash

# Simple health check script
echo "🏥 Checking IOG Platform Services"
echo "=================================="
echo ""

# Check if services are running
check_service() {
    local name=$1
    local url=$2
    
    echo -n "Checking $name... "
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" = "200" ] || [ "$response" = "503" ]; then
        echo "✅ Running (HTTP $response)"
        return 0
    else
        echo "❌ Not responding"
        return 1
    fi
}

check_service "Frontend" "http://localhost:3000"
check_service "Auth Service" "http://localhost:3001/health"
check_service "Complaint Service" "http://localhost:3002/health"
check_service "Crime Service" "http://localhost:3003/health"

echo ""
echo "Database Check:"
psql -U postgres -d iog_production -c "SELECT COUNT(*) as users FROM users;" 2>/dev/null || echo "❌ Database not accessible"

echo ""
echo "=================================="
echo "If services aren't running, start them with:"
echo "cd backend/services/[service-name] && npm run dev"
