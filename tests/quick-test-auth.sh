#!/bin/bash

echo "🚀 Testing Auth Service with MongoDB Registration & Login"
echo "=========================================================="
echo ""

# Test Registration
echo "📝 Test 1: Register New User"
echo "-----------------------------"

TIMESTAMP=$(date +%s)
PHONE="+9198765$((TIMESTAMP % 100000))"

curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"aadhaarNumber\": \"$(printf '%012d' $TIMESTAMP)\",
    \"phoneNumber\": \"$PHONE\",
    \"email\": \"test$TIMESTAMP@iog.gov.in\",
    \"password\": \"Test@123456\",
    \"role\": \"CITIZEN\"
  }" | python3 -m json.tool

echo ""
echo ""

# Test Login
echo "🔐 Test 2: Login with Sample User"
echo "-----------------------------------"

curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"identifier\": \"$PHONE\",
    \"password\": \"Test@123456\",
    \"deviceId\": \"test-device\"
  }" | python3 -m json.tool

echo ""
echo "✅ Tests Complete!"
