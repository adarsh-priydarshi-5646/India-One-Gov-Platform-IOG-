#!/bin/bash

# Test IOG Platform Login/Signup Flow

echo "🧪 Testing IOG Platform Authentication"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

AUTH_URL="http://localhost:3001"

echo -e "${BLUE}Test 1: Register New User${NC}"
echo "--------------------------------"

TIMESTAMP=$(date +%s)
PHONE="+9198765$((TIMESTAMP % 100000))"

REGISTER_DATA="{
  \"aadhaarNumber\": \"123456789012\",
  \"phoneNumber\": \"$PHONE\",
  \"email\": \"test$TIMESTAMP@example.com\",
  \"password\": \"Test@123456\",
  \"role\": \"CITIZEN\"
}"

echo "Registering user with phone: $PHONE"
response=$(curl -s -X POST "$AUTH_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "$REGISTER_DATA")

echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"

USER_ID=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin).get('data', {}).get('userId', ''))" 2>/dev/null)

if [ -n "$USER_ID" ]; then
    echo -e "${GREEN}✓ Registration successful${NC}"
    echo "User ID: $USER_ID"
    
    echo ""
    echo "Checking database..."
    psql -U postgres -d iog_production -c "SELECT id, phone_number, email, is_verified FROM users WHERE id = '$USER_ID';" 2>/dev/null
else
    echo -e "${RED}✗ Registration failed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Test 2: Login with Sample User${NC}"
echo "--------------------------------"

# Try to login with sample user
LOGIN_DATA='{
  "identifier": "+919876543210",
  "password": "Test@123456",
  "deviceId": "test-device-001"
}'

echo "Logging in with sample user..."
response=$(curl -s -X POST "$AUTH_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "$LOGIN_DATA")

echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"

ACCESS_TOKEN=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin).get('data', {}).get('accessToken', ''))" 2>/dev/null)

if [ -n "$ACCESS_TOKEN" ]; then
    echo -e "${GREEN}✓ Login successful${NC}"
    echo "Access Token: ${ACCESS_TOKEN:0:50}..."
    
    echo ""
    echo -e "${BLUE}Test 3: Get Current User${NC}"
    echo "--------------------------------"
    
    profile=$(curl -s "$AUTH_URL/api/auth/me" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    
    echo "$profile" | python3 -m json.tool 2>/dev/null || echo "$profile"
    
    if echo "$profile" | grep -q "fullName"; then
        echo -e "${GREEN}✓ Profile fetch successful${NC}"
    else
        echo -e "${RED}✗ Profile fetch failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Login failed - user might not be verified${NC}"
fi

echo ""
echo -e "${GREEN}✅ Testing Complete!${NC}"
echo ""
echo "Sample credentials for testing:"
echo "================================"
echo "Phone: +919876543210"
echo "Email: [email protected]"
echo "Password: Test@123456"
echo ""
echo "You can now test login on: http://localhost:3000"
