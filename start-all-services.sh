#!/bin/bash

echo "🚀 Starting IOG Platform Services..."
echo ""

# Kill any existing node processes on these ports
echo "Cleaning up existing processes..."
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:3002 | xargs kill -9 2>/dev/null
lsof -ti:3003 | xargs kill -9 2>/dev/null
lsof -ti:3004 | xargs kill -9 2>/dev/null
lsof -ti:3005 | xargs kill -9 2>/dev/null
lsof -ti:3006 | xargs kill -9 2>/dev/null

sleep 2

# Start Auth Service
echo "Starting Auth Service on port 3001..."
cd backend/services/auth-service
npm run dev > /tmp/auth-service.log 2>&1 &
AUTH_PID=$!
echo "Auth Service PID: $AUTH_PID"
cd ../../..

sleep 3

# Start Complaint Service
echo "Starting Complaint Service on port 3002..."
cd backend/services/complaint-service
npm run dev > /tmp/complaint-service.log 2>&1 &
COMPLAINT_PID=$!
echo "Complaint Service PID: $COMPLAINT_PID"
cd ../../..

sleep 3

# Start Crime Service
echo "Starting Crime Service on port 3003..."
cd backend/services/crime-service
npm run dev > /tmp/crime-service.log 2>&1 &
CRIME_PID=$!
echo "Crime Service PID: $CRIME_PID"
cd ../../..

sleep 3

# Start Corruption Service
echo "Starting Corruption Service on port 3004..."
cd backend/services/corruption-service
npm run dev > /tmp/corruption-service.log 2>&1 &
CORRUPTION_PID=$!
echo "Corruption Service PID: $CORRUPTION_PID"
cd ../../..

sleep 3

# Start Employment Service
echo "Starting Employment Service on port 3005..."
cd backend/services/employment-service
npm run dev > /tmp/employment-service.log 2>&1 &
EMPLOYMENT_PID=$!
echo "Employment Service PID: $EMPLOYMENT_PID"
cd ../../..

sleep 3

# Start Notification Service
echo "Starting Notification Service on port 3006..."
cd backend/services/notification-service
npm run dev > /tmp/notification-service.log 2>&1 &
NOTIFICATION_PID=$!
echo "Notification Service PID: $NOTIFICATION_PID"
cd ../../..

echo ""
echo "Waiting for services to start..."
sleep 10

echo ""
echo "=== Service Status ==="
echo ""

# Check Auth Service
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Auth Service (3001) - Running"
    curl -s http://localhost:3001/health | jq '.' 2>/dev/null || curl -s http://localhost:3001/health
else
    echo "❌ Auth Service (3001) - Failed"
    echo "Last 20 lines of log:"
    tail -20 /tmp/auth-service.log
fi

echo ""

# Check Complaint Service
if curl -s http://localhost:3002/health > /dev/null 2>&1; then
    echo "✅ Complaint Service (3002) - Running"
    curl -s http://localhost:3002/health | jq '.' 2>/dev/null || curl -s http://localhost:3002/health
else
    echo "❌ Complaint Service (3002) - Failed"
    echo "Last 20 lines of log:"
    tail -20 /tmp/complaint-service.log
fi

echo ""

# Check Crime Service
if curl -s http://localhost:3003/health > /dev/null 2>&1; then
    echo "✅ Crime Service (3003) - Running"
    curl -s http://localhost:3003/health | jq '.' 2>/dev/null || curl -s http://localhost:3003/health
else
    echo "❌ Crime Service (3003) - Failed"
    echo "Last 20 lines of log:"
    tail -20 /tmp/crime-service.log
fi

echo ""

# Check Corruption Service
if curl -s http://localhost:3004/health > /dev/null 2>&1; then
    echo "✅ Corruption Service (3004) - Running"
    curl -s http://localhost:3004/health | jq '.' 2>/dev/null || curl -s http://localhost:3004/health
else
    echo "❌ Corruption Service (3004) - Failed"
    echo "Last 20 lines of log:"
    tail -20 /tmp/corruption-service.log
fi

echo ""

# Check Employment Service
if curl -s http://localhost:3005/health > /dev/null 2>&1; then
    echo "✅ Employment Service (3005) - Running"
    curl -s http://localhost:3005/health | jq '.' 2>/dev/null || curl -s http://localhost:3005/health
else
    echo "❌ Employment Service (3005) - Failed"
    echo "Last 20 lines of log:"
    tail -20 /tmp/employment-service.log
fi

echo ""

# Check Notification Service
if curl -s http://localhost:3006/health > /dev/null 2>&1; then
    echo "✅ Notification Service (3006) - Running"
    curl -s http://localhost:3006/health | jq '.' 2>/dev/null || curl -s http://localhost:3006/health
else
    echo "❌ Notification Service (3006) - Failed"
    echo "Last 20 lines of log:"
    tail -20 /tmp/notification-service.log
fi

echo ""
echo "=== All Services Started ==="
echo "Logs available at:"
echo "  - /tmp/auth-service.log"
echo "  - /tmp/complaint-service.log"
echo "  - /tmp/crime-service.log"
echo "  - /tmp/corruption-service.log"
echo "  - /tmp/employment-service.log"
echo "  - /tmp/notification-service.log"
