#!/bin/bash

echo "🧪 IOG Platform - Complete Flow Testing"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0

# Test function
test_api() {
    local name=$1
    local method=$2
    local url=$3
    local data=$4
    local token=$5
    
    echo -n "Testing $name... "
    
    if [ "$method" = "POST" ]; then
        if [ -n "$token" ]; then
            response=$(curl -s -w "\n%{http_code}" -X POST "$url" \
                -H "Content-Type: application/json" \
                -H "Authorization: Bearer $token" \
                -d "$data" 2>&1)
        else
            response=$(curl -s -w "\n%{http_code}" -X POST "$url" \
                -H "Content-Type: application/json" \
                -d "$data" 2>&1)
        fi
    else
        if [ -n "$token" ]; then
            response=$(curl -s -w "\n%{http_code}" "$url" \
                -H "Authorization: Bearer $token" 2>&1)
        else
            response=$(curl -s -w "\n%{http_code}" "$url" 2>&1)
        fi
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ PASSED${NC} (HTTP $http_code)"
        ((PASSED++))
        echo "$body"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC} (HTTP $http_code)"
        ((FAILED++))
        return 1
    fi
}

echo "1. HEALTH CHECKS"
echo "----------------"
test_api "Auth Service" "GET" "http://localhost:3001/health"
test_api "Complaint Service" "GET" "http://localhost:3002/health"
test_api "Crime Service" "GET" "http://localhost:3003/health"
test_api "Frontend" "GET" "http://localhost:3000"
echo ""

echo "2. AUTHENTICATION FLOW"
echo "----------------------"

# Login
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:3001/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
      "identifier": "+919876543213",
      "password": "Test@123456",
      "deviceId": "test-device-001"
    }')

if echo "$LOGIN_RESPONSE" | grep -q "accessToken"; then
    echo -e "${GREEN}✅ Login successful${NC}"
    ((PASSED++))
    ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken')
    USER_NAME=$(echo "$LOGIN_RESPONSE" | jq -r '.data.user._doc.fullName')
    echo "  User: $USER_NAME"
    echo "  Token: ${ACCESS_TOKEN:0:30}..."
else
    echo -e "${RED}❌ Login failed${NC}"
    ((FAILED++))
    ACCESS_TOKEN=""
fi
echo ""

if [ -n "$ACCESS_TOKEN" ]; then
    echo "3. PROTECTED ROUTES"
    echo "-------------------"
    test_api "Get Current User" "GET" "http://localhost:3001/api/auth/me" "" "$ACCESS_TOKEN"
    echo ""

    echo "4. COMPLAINT OPERATIONS"
    echo "-----------------------"
    
    # File complaint
    COMPLAINT_DATA='{
      "category": "Infrastructure",
      "subCategory": "Road Damage",
      "title": "Test Pothole on Highway",
      "description": "Large pothole causing traffic issues on NH-48",
      "locationLat": 19.0760,
      "locationLng": 72.8777,
      "address": "NH-48, Near Andheri West",
      "state": "Maharashtra",
      "district": "Mumbai",
      "pincode": "400053",
      "priority": "HIGH"
    }'
    
    echo "Filing complaint..."
    COMPLAINT_RESPONSE=$(curl -s -X POST "http://localhost:3002/api/complaints" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -d "$COMPLAINT_DATA")
    
    if echo "$COMPLAINT_RESPONSE" | grep -q "complaintNumber"; then
        echo -e "${GREEN}✅ Complaint filed${NC}"
        ((PASSED++))
        COMPLAINT_ID=$(echo "$COMPLAINT_RESPONSE" | jq -r '.data.id')
        COMPLAINT_NUMBER=$(echo "$COMPLAINT_RESPONSE" | jq -r '.data.complaintNumber')
        echo "  Complaint Number: $COMPLAINT_NUMBER"
        echo "  Complaint ID: $COMPLAINT_ID"
    else
        echo -e "${RED}❌ Failed to file complaint${NC}"
        ((FAILED++))
        COMPLAINT_ID=""
    fi
    
    # List complaints
    test_api "List Complaints" "GET" "http://localhost:3002/api/complaints?page=1&limit=10" "" "$ACCESS_TOKEN"
    
    # Get complaint details
    if [ -n "$COMPLAINT_ID" ]; then
        test_api "Get Complaint Details" "GET" "http://localhost:3002/api/complaints/$COMPLAINT_ID" "" "$ACCESS_TOKEN"
    fi
    echo ""

    echo "5. CRIME/FIR OPERATIONS"
    echo "-----------------------"
    
    # File FIR
    FIR_DATA='{
      "reporterName": "Test Reporter",
      "reporterContact": "+919876543213",
      "crimeType": "THEFT",
      "description": "Bike stolen from parking lot near office",
      "incidentDate": "2025-12-07",
      "incidentTime": "14:30:00",
      "locationLat": 19.0760,
      "locationLng": 72.8777,
      "address": "Office Parking, Andheri West",
      "state": "Maharashtra",
      "district": "Mumbai",
      "policeStation": "Andheri Police Station",
      "priority": "HIGH"
    }'
    
    echo "Filing FIR..."
    FIR_RESPONSE=$(curl -s -X POST "http://localhost:3003/api/firs" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -d "$FIR_DATA")
    
    if echo "$FIR_RESPONSE" | grep -q "firNumber"; then
        echo -e "${GREEN}✅ FIR filed${NC}"
        ((PASSED++))
        FIR_ID=$(echo "$FIR_RESPONSE" | jq -r '.data.id')
        FIR_NUMBER=$(echo "$FIR_RESPONSE" | jq -r '.data.firNumber')
        echo "  FIR Number: $FIR_NUMBER"
        echo "  FIR ID: $FIR_ID"
    else
        echo -e "${RED}❌ Failed to file FIR${NC}"
        ((FAILED++))
        FIR_ID=""
    fi
    
    # List FIRs
    test_api "List FIRs" "GET" "http://localhost:3003/api/firs?page=1&limit=10" "" "$ACCESS_TOKEN"
    
    # Get FIR details
    if [ -n "$FIR_ID" ]; then
        test_api "Get FIR Details" "GET" "http://localhost:3003/api/firs/$FIR_ID" "" "$ACCESS_TOKEN"
    fi
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
    echo ""
    echo "✅ SYSTEM IS FULLY OPERATIONAL"
    echo ""
    echo "📱 Test Login Credentials:"
    echo "   Phone: +919876543213"
    echo "   Password: Test@123456"
    echo ""
    echo "🌐 Access the platform:"
    echo "   Frontend: http://localhost:3000"
    echo "   Login and explore all features!"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed${NC}"
    exit 1
fi
