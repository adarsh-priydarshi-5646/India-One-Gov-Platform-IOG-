#!/bin/bash

echo "🧪 Testing MongoDB Auth Service"
echo "================================"
echo ""

# Wait for service to be ready
echo "Waiting for service to start..."
sleep 3

# Test 1: Health Check
echo "Test 1: Health Check"
echo "--------------------"
curl -s http://localhost:3001/health | python3 -m json.tool
echo ""
echo ""

# Test 2: Register New User
echo "Test 2: Register New User"
echo "-------------------------"
TIMESTAMP=$(date +%s)
REGISTER_DATA="{
  \"aadhaarNumber\": \"$(printf '%012d' $TIMESTAMP)\",
  \"phoneNumber\": \"+9198765$((TIMESTAMP % 100000))\",
  \"email\": \"test$TIMESTAMP@iog.gov.in\",
  \"password\": \"SecurePass@123\",
  \"role\": \"CITIZEN\"
}"

echo "Registering user..."
echo "$REGISTER_DATA" | python3 -m json.tool
echo ""

response=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "$REGISTER_DATA")

echo "Response:"
echo "$response" | python3 -m json.tool
echo ""

# Extract user ID
USER_ID=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin).get('data', {}).get('userId', ''))" 2>/dev/null)

if [ -n "$USER_ID" ]; then
  echo "✅ Registration successful! User ID: $USER_ID"
  
  # Test 3: Login
  echo ""
  echo "Test 3: Login"
  echo "-------------"
  phone=$(echo "$REGISTER_DATA" | python3 -c "import sys, json; print(json.load(sys.stdin).get('phoneNumber', ''))")
  
  LOGIN_DATA="{
    \"identifier\": \"$phone\",
    \"password\": \"SecurePass@123\",
    \"deviceId\": \"test-device-001\"
  }"
  
  echo "Logging in..."
  curl -s -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d "$LOGIN_DATA" | python3 -m json.tool
  
  echo ""
  echo "✅ All tests completed!"
else
  echo "❌ Registration failed"
fi

echo ""
echo "================================"
echo "MongoDB Auth Service Test Complete!"
