#!/bin/bash

echo "🚀 Starting IOG Platform - Unified System"
echo "=========================================="
echo ""

# Kill existing processes
echo "🧹 Cleaning up existing processes..."
lsof -ti:3001,3002,3003,3004,3005,3006,4000 | xargs kill -9 2>/dev/null
sleep 2

# Start backend microservices
echo "📡 Starting Backend Microservices..."
echo ""

cd backend/services/auth-service
npm run dev > /tmp/auth-service.log 2>&1 &
echo "  ✓ Auth Service (3001)"
cd ../../..

sleep 2

cd backend/services/complaint-service
npm run dev > /tmp/complaint-service.log 2>&1 &
echo "  ✓ Complaint Service (3002)"
cd ../../..

sleep 2

cd backend/services/crime-service
npm run dev > /tmp/crime-service.log 2>&1 &
echo "  ✓ Crime Service (3003)"
cd ../../..

sleep 2

cd backend/services/corruption-service
npm run dev > /tmp/corruption-service.log 2>&1 &
echo "  ✓ Corruption Service (3004)"
cd ../../..

sleep 2

cd backend/services/employment-service
npm run dev > /tmp/employment-service.log 2>&1 &
echo "  ✓ Employment Service (3005)"
cd ../../..

sleep 2

cd backend/services/notification-service
npm run dev > /tmp/notification-service.log 2>&1 &
echo "  ✓ Notification Service (3006)"
cd ../../..

echo ""
echo "⏳ Waiting for services to initialize..."
sleep 10

# Start API Gateway
echo ""
echo "🌐 Starting API Gateway..."
cd backend/api-gateway
npm run dev > /tmp/api-gateway.log 2>&1 &
API_GATEWAY_PID=$!
echo "  ✓ API Gateway (4000) - PID: $API_GATEWAY_PID"
cd ../..

sleep 5

# Check services
echo ""
echo "🔍 Checking Service Health..."
echo ""

services=(
  "3001:Auth"
  "3002:Complaint"
  "3003:Crime"
  "3004:Corruption"
  "3005:Employment"
  "3006:Notification"
  "4000:API Gateway"
)

all_healthy=true

for service in "${services[@]}"; do
  IFS=':' read -r port name <<< "$service"
  if curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
    echo "  ✅ $name ($port) - Healthy"
  else
    echo "  ❌ $name ($port) - Down"
    all_healthy=false
  fi
done

echo ""
echo "=========================================="

if [ "$all_healthy" = true ]; then
  echo "✨ IOG Platform is READY!"
  echo ""
  echo "📱 Access Points:"
  echo "  🌐 Frontend:    http://localhost:3000"
  echo "  🔌 API Gateway: http://localhost:4000"
  echo ""
  echo "🔐 Test Credentials:"
  echo "  Phone:    +919876543213"
  echo "  Password: Test@123456"
  echo ""
  echo "📊 Features Available:"
  echo "  ✓ Multi-language support (6 languages)"
  echo "  ✓ AI Chatbot assistant"
  echo "  ✓ Role-based dashboards"
  echo "  ✓ Complaint management"
  echo "  ✓ Crime reporting (FIR)"
  echo "  ✓ Job portal"
  echo "  ✓ Real-time notifications"
  echo ""
  echo "📝 Logs:"
  echo "  tail -f /tmp/api-gateway.log"
  echo "  tail -f /tmp/auth-service.log"
  echo ""
else
  echo "⚠️  Some services failed to start"
  echo "Check logs in /tmp/ directory"
fi

echo "=========================================="
