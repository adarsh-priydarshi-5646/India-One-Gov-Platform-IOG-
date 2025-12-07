#!/bin/bash

echo "🧪 IOG Platform - Complete API Testing"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0.32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    local data=$4
    
    echo -n "Testing $name... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "$data" 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" "$url" 2>&1)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ PASSED${NC} (HTTP $http_code)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAILED${NC} (HTTP $http_code)"
        ((FAILED++))
        return 1
    fi
}

echo "1. HEALTH CHECKS"
echo "----------------"
test_endpoint "Auth Service Health" "http://localhost:3001/health"
test_endpoint "Complaint Service Health" "http://localhost:3002/health"
test_endpoint "Crime Service Health" "http://localhost:3003/health"
test_endpoint "Frontend" "http://localhost:3000"
echo ""

echo "2. AUTH SERVICE TESTS"
echo "---------------------"

# Register new user
REGISTER_DATA='{
  "phoneNumber": "+919876543210",
  "email": "test@example.com",
  "aadhaarNumber": "123456789012",
  "fullName": "Test User",
  "password": "Test@123456",
  "state": "Maharashtra",
  "district": "Mumbai"
}'

test_endpoint "Register User" "http://localhost:3001/api/auth/register" "POST" "$REGISTER_DATA"

# Login
LOGIN_DATA='{
  "phoneNumber": "+919876543210",
  "password": "Test@123456"
}'

echo -n "Testing Login... "
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:3001/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "$LOGIN_DATA" 2>&1)

if echo "$LOGIN_RESPONSE" | grep -q "accessToken"; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((PASSED++))
    ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken' 2>/dev/null)
    echo "  Token: ${ACCESS_TOKEN:0:20}..."
else
    echo -e "${RED}❌ FAILED${NC}"
    ((FAILED++))
    ACCESS_TOKEN=""
fi

# Get current user (protected route)
if [ -n "$ACCESS_TOKEN" ]; then
    echo -n "Testing Get Current User (Protected)... "
    ME_RESPONSE=$(curl -s "http://localhost:3001/api/auth/me" \
        -H "Authorization: Bearer $ACCESS_TOKEN" 2>&1)
    
    if echo "$ME_RESPONSE" | grep -q "fullName"; then
        echo -e "${GREEN}✅ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}"
        ((FAILED++))
    fi
fi

echo ""

echo "3. COMPLAINT SERVICE TESTS"
echo "--------------------------"

if [ -n "$ACCESS_TOKEN" ]; then
    # File complaint
    COMPLAINT_DATA='{
      "category": "Infrastructure",
      "subCategory": "Road Damage",
      "title": "Pothole on Main Street",
      "description": "Large pothole causing traffic issues",
      "locationLat": 19.0760,
      "locationLng": 72.8777,
      "address": "Main Street, Andheri West",
      "state": "Maharashtra",
      "district": "Mumbai",
      "pincode": "400053",
      "priority": "HIGH"
    }'
    
    echo -n "Testing File Complaint... "
    COMPLAINT_RESPONSE=$(curl -s -X POST "http://localhost:3002/api/complaints" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -d "$COMPLAINT_DATA" 2>&1)
    
    if echo "$COMPLAINT_RESPONSE" | grep -q "complaintNumber"; then
        echo -e "${GREEN}✅ PASSED${NC}"
        ((PASSED++))
        COMPLAINT_ID=$(echo "$COMPLAINT_RESPONSE" | jq -r '.data.id' 2>/dev/null)
        COMPLAINT_NUMBER=$(echo "$COMPLAINT_RESPONSE" | jq -r '.data.complaintNumber' 2>/dev/null)
        echo "  Complaint Number: $COMPLAINT_NUMBER"
    else
        echo -e "${RED}❌ FAILED${NC}"
        ((FAILED++))
        COMPLAINT_ID=""
    fi
    
    # Get complaints list
    test_endpoint "Get Complaints List" "http://localhost:3002/api/complaints?page=1&limit=10" "GET"
    
    # Get complaint by ID
    if [ -n "$COMPLAINT_ID" ]; then
        test_endpoint "Get Complaint Details" "http://localhost:3002/api/complaints/$COMPLAINT_ID" "GET"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping (no auth token)${NC}"
fi

echo ""

echo "4. CRIME SERVICE TESTS"
echo "----------------------"

if [ -n "$ACCESS_TOKEN" ]; then
    # File FIR
    FIR_DATA='{
      "reporterName": "Test Reporter",
      "reporterContact": "+919876543210",
      "crimeType": "THEFT",
      "description": "Bike stolen from parking lot",
      "incidentDate": "2025-12-07",
      "incidentTime": "14:30:00",
      "locationLat": 19.0760,
      "locationLng": 72.8777,
      "address": "Parking Lot, Andheri West",
      "state": "Maharashtra",
      "district": "Mumbai",
      "policeStation": "Andheri Police Station",
      "priority": "HIGH"
    }'
    
    echo -n "Testing File FIR... "
    FIR_RESPONSE=$(curl -s -X POST "http://localhost:3003/api/firs" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -d "$FIR_DATA" 2>&1)
    
    if echo "$FIR_RESPONSE" | grep -q "firNumber"; then
        echo -e "${GREEN}✅ PASSED${NC}"
        ((PASSED++))
        FIR_ID=$(echo "$FIR_RESPONSE" | jq -r '.data.id' 2>/dev/null)
        FIR_NUMBER=$(echo "$FIR_RESPONSE" | jq -r '.data.firNumber' 2>/dev/null)
        echo "  FIR Number: $FIR_NUMBER"
    else
        echo -e "${RED}❌ FAILED${NC}"
        ((FAILED++))
        FIR_ID=""
    fi
    
    # Get FIRs list
    test_endpoint "Get FIRs List" "http://localhost:3003/api/firs?page=1&limit=10" "GET"
    
    # Get FIR by ID
    if [ -n "$FIR_ID" ]; then
        test_endpoint "Get FIR Details" "http://localhost:3003/api/firs/$FIR_ID" "GET"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping (no auth token)${NC}"
fi

echo ""
echo "========================================"
echo "TEST SUMMARY"
echo "========================================"
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed${NC}"
    exit 1
fi
