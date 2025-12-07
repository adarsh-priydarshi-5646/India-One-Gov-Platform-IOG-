#!/bin/bash

echo "🧪 IOG Platform - Complete System Test"
echo "======================================"
echo ""

# Test credentials
PHONE="+919876543213"
PASSWORD="Test@123456"

echo "📋 Test Configuration:"
echo "  Phone: $PHONE"
echo "  Password: $PASSWORD"
echo ""

# Test 1: Health Checks
echo "1️⃣  Testing Service Health Checks..."
echo ""

services=(
  "3001:Auth"
  "3002:Complaint"
  "3003:Crime"
  "3004:Corruption"
  "3005:Employment"
  "3006:Notification"
)

for service in "${services[@]}"; do
  IFS=':' read -r port name <<< "$service"
  if curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
    echo "  ✅ $name Service (Port $port) - Healthy"
  else
    echo "  ❌ $name Service (Port $port) - Down"
  fi
done

echo ""

# Test 2: User Login
echo "2️⃣  Testing User Authentication..."
echo ""

LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"$PHONE\",\"password\":\"$PASSWORD\",\"deviceId\":\"test-device-123\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo "  ✅ Login Successful"
  echo "  🔑 Token: ${TOKEN:0:50}..."
else
  echo "  ❌ Login Failed"
  echo "  Response: $LOGIN_RESPONSE"
fi

echo ""

# Test 3: Fetch User Complaints
echo "3️⃣  Testing Complaint Service..."
echo ""

COMPLAINTS_RESPONSE=$(curl -s -X GET "http://localhost:3002/api/complaints?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN")

COMPLAINT_COUNT=$(echo $COMPLAINTS_RESPONSE | grep -o '"total":[0-9]*' | cut -d':' -f2)

if [ -n "$COMPLAINT_COUNT" ]; then
  echo "  ✅ Complaints Fetched Successfully"
  echo "  📊 Total Complaints: $COMPLAINT_COUNT"
else
  echo "  ❌ Failed to Fetch Complaints"
fi

echo ""

# Test 4: Fetch Crime Cases
echo "4️⃣  Testing Crime Service..."
echo ""

CRIME_RESPONSE=$(curl -s -X GET "http://localhost:3003/api/crime/cases?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN")

if echo "$CRIME_RESPONSE" | grep -q "success"; then
  echo "  ✅ Crime Cases Fetched Successfully"
else
  echo "  ❌ Failed to Fetch Crime Cases"
fi

echo ""

# Test 5: Fetch Jobs
echo "5️⃣  Testing Employment Service..."
echo ""

JOBS_RESPONSE=$(curl -s -X GET "http://localhost:3005/api/jobs")

JOB_COUNT=$(echo $JOBS_RESPONSE | grep -o '"total":[0-9]*' | cut -d':' -f2)

if [ -n "$JOB_COUNT" ]; then
  echo "  ✅ Jobs Fetched Successfully"
  echo "  💼 Available Jobs: $JOB_COUNT"
else
  echo "  ❌ Failed to Fetch Jobs"
fi

echo ""

# Test 6: Fetch Notifications
echo "6️⃣  Testing Notification Service..."
echo ""

NOTIF_RESPONSE=$(curl -s -X GET "http://localhost:3006/api/notifications")

if echo "$NOTIF_RESPONSE" | grep -q "success"; then
  echo "  ✅ Notifications Fetched Successfully"
else
  echo "  ❌ Failed to Fetch Notifications"
fi

echo ""

# Test 7: Frontend Accessibility
echo "7️⃣  Testing Frontend..."
echo ""

if curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "  ✅ Frontend is Accessible"
  echo "  🌐 URL: http://localhost:3000"
else
  echo "  ❌ Frontend is Not Accessible"
fi

echo ""
echo "======================================"
echo "✨ System Test Complete!"
echo ""
echo "📱 Access the platform:"
echo "  Frontend: http://localhost:3000"
echo "  Login with: $PHONE / $PASSWORD"
echo ""
echo "🔧 Service Endpoints:"
echo "  Auth:         http://localhost:3001"
echo "  Complaint:    http://localhost:3002"
echo "  Crime:        http://localhost:3003"
echo "  Corruption:   http://localhost:3004"
echo "  Employment:   http://localhost:3005"
echo "  Notification: http://localhost:3006"
echo ""
