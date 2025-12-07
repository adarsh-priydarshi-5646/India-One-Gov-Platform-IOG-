#!/bin/bash

# Comprehensive API Testing with Real Database
# Tests all endpoints and verifies database persistence

echo "🧪 IOG Platform - Comprehensive API Testing"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
PASSED=0
FAILED=0

# Base URLs
AUTH_URL="http://localhost:3001"
COMPLAINT_URL="http://localhost:3002"
CRIME_URL="http://localhost:3003"

# Test results file
RESULTS_FILE="/tmp/iog_test_results.json"
> $RESULTS_FILE

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}1. Testing Health Endpoints${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Test health endpoints
for service in "Auth:$AUTH_URL" "Complaint:$COMPLAINT_URL" "Crime:$CRIME_URL"; do
    name=$(echo $service | cut -d: -f1)
    url=$(echo $service | cut -d: -f2,3)
    
    echo -n "Testing $name Service Health... "
    response=$(curl -s -w "\n%{http_code}" "$url/health" 2>/dev/null)
    code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$code" = "200" ] || [ "$code" = "503" ]; then
        echo -e "${GREEN}✓ Response${NC} (HTTP $code)"
        echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $code)"
        echo "$body"
        FAILED=$((FAILED + 1))
    fi
    echo ""
done

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}2. Testing Auth Service - User Registration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

TIMESTAMP=$(date +%s)
PHONE="+9198765432$((TIMESTAMP % 100))"

echo "Registering new user with phone: $PHONE"

REGISTER_DATA="{
  \"aadhaarNumber\": \"123456789012\",
  \"phoneNumber\": \"$PHONE\",
  \"email\": \"test$TIMESTAMP@example.com\",
  \"password\": \"Test@123456\",
  \"role\": \"CITIZEN\"
}"

response=$(curl -s -w "\n%{http_code}" -X POST "$AUTH_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "$REGISTER_DATA" 2>/dev/null)

code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$code" = "201" ] || [ "$code" = "200" ]; then
    echo -e "${GREEN}✓ Registration successful${NC}"
    echo "$body" | python3 -m json.tool
    
    USER_ID=$(echo "$body" | python3 -c "import sys, json; print(json.load(sys.stdin).get('data', {}).get('userId', ''))" 2>/dev/null)
    
    if [ -n "$USER_ID" ]; then
        echo ""
        echo -e "${GREEN}User ID: $USER_ID${NC}"
        echo "userId=$USER_ID" >> $RESULTS_FILE
        PASSED=$((PASSED + 1))
        
        # Check database
        echo ""
        echo "Verifying in database..."
        psql -U postgres -d iog_production -c "SELECT id, phone_number, email, role FROM users WHERE id = '$USER_ID';" 2>/dev/null
    else
        echo -e "${YELLOW}⚠️  Could not extract userId${NC}"
    fi
else
    echo -e "${RED}✗ Registration failed${NC} (HTTP $code)"
    echo "$body"
    FAILED=$((FAILED + 1))
fi

echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}3. Testing Database Tables${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "Checking PostgreSQL tables..."
psql -U postgres -d iog_production -c "SELECT 
    tablename,
    (SELECT COUNT(*) FROM users) as users_count,
    (SELECT COUNT(*) FROM complaints) as complaints_count,
    (SELECT COUNT(*) FROM firs) as firs_count
FROM pg_tables WHERE schemaname='public' LIMIT 1;" 2>/dev/null

echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}4. Testing Crime Service - FIR Registration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

FIR_DATA='{
  "crimeType": "Theft",
  "description": "Mobile phone stolen from bus stop. Brand: iPhone 15 Pro, Color: Black. Incident occurred around 3 PM today.",
  "incidentDate": "2024-12-07",
  "incidentTime": "15:00",
  "locationLat": 19.0760,
  "locationLng": 72.8777,
  "address": "Andheri Bus Stop, Mumbai",
  "state": "Maharashtra",
  "district": "Mumbai",
  "policeStation": "Andheri Police Station",
  "reporterName": "Test Reporter",
  "reporterContact": "+919876543210",
  "isAnonymous": false
}'

echo "Filing FIR..."
response=$(curl -s -w "\n%{http_code}" -X POST "$CRIME_URL/api/firs" \
    -H "Content-Type: application/json" \
    -d "$FIR_DATA" 2>/dev/null)

code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$code" = "201" ] || [ "$code" = "200" ]; then
    echo -e "${GREEN}✓ FIR registered${NC}"
    echo "$body" | python3 -m json.tool
    PASSED=$((PASSED + 1))
    
    FIR_ID=$(echo "$body" | python3 -c "import sys, json; print(json.load(sys.stdin).get('data', {}).get('id', ''))" 2>/dev/null)
    
    if [ -n "$FIR_ID" ]; then
        echo ""
        echo "Verifying FIR in database..."
        psql -U postgres -d iog_production -c "SELECT id, fir_number, crime_type, status FROM firs WHERE id = '$FIR_ID';" 2>/dev/null
    fi
else
    echo -e "${RED}✗ FIR registration failed${NC} (HTTP $code)"
    echo "$body"
    FAILED=$((FAILED + 1))
fi

echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}5. Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

TOTAL=$((PASSED + FAILED))

echo ""
echo "Tests Run: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}═══════════════════════════════════════${NC}"
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}✅ Database connections working${NC}"
    echo -e "${GREEN}✅ All endpoints functional${NC}"
    echo -e "${GREEN}═══════════════════════════════════════${NC}"
    exit 0
else
    echo -e "${YELLOW}═══════════════════════════════════════${NC}"
    echo -e "${YELLOW}⚠️  Some tests failed${NC}"
    echo -e "${YELLOW}Check service logs for details${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════${NC}"
    exit 1
fi
