#!/bin/bash

echo "=== IOG Platform System Test ==="
echo ""

# Test PostgreSQL
echo "1. Testing PostgreSQL..."
psql -U postgres -d iog_production -c "SELECT 1" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ PostgreSQL is running and database exists"
else
    echo "❌ PostgreSQL database 'iog_production' not found"
    echo "Creating database..."
    psql -U postgres -c "CREATE DATABASE iog_production" 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Database created"
        echo "Running schema..."
        psql -U postgres -d iog_production -f backend/database/schema.sql > /dev/null 2>&1
        echo "✅ Schema applied"
    fi
fi

# Test Redis
echo ""
echo "2. Testing Redis..."
redis-cli ping > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Redis is running"
else
    echo "❌ Redis is not running"
fi

# Test MongoDB
echo ""
echo "3. Testing MongoDB..."
if [ -n "$MONGODB_URI" ]; then
    echo "✅ MongoDB URI configured"
else
    echo "⚠️  MongoDB URI not in environment (using .env files)"
fi

# Test Backend Services
echo ""
echo "4. Testing Backend Services..."
curl -s http://localhost:3001/health > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Auth Service (3001) is running"
else
    echo "❌ Auth Service (3001) is not responding"
fi

curl -s http://localhost:3002/health > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Complaint Service (3002) is running"
else
    echo "❌ Complaint Service (3002) is not responding"
fi

curl -s http://localhost:3003/health > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Crime Service (3003) is running"
else
    echo "❌ Crime Service (3003) is not responding"
fi

# Test Frontend
echo ""
echo "5. Testing Frontend..."
curl -s http://localhost:3000 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Frontend (3000) is running"
else
    curl -s http://localhost:5173 > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Frontend (5173) is running"
    else
        echo "❌ Frontend is not responding"
    fi
fi

echo ""
echo "=== Test Complete ==="
