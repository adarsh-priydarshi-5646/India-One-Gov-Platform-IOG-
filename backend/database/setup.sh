#!/bin/bash

# IOG Platform - Database Setup Script
# This script sets up the PostgreSQL database for the IOG Platform

echo "🇮🇳 India One-Gov Platform - Database Setup"
echo "============================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed${NC}"
    echo "Install PostgreSQL first: brew install postgresql@15"
    exit 1
fi

echo -e "${GREEN}✅ PostgreSQL is installed${NC}"

# Check if Redis is installed
if ! command -v redis-cli &> /dev/null; then
    echo -e "${RED}❌ Redis is not installed${NC}"
    echo "Install Redis first: brew install redis"
    exit 1
fi

echo -e "${GREEN}✅ Redis is installed${NC}"

# Check if Redis is running
if redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis is running${NC}"
else
    echo -e "${YELLOW}⚠️  Starting Redis...${NC}"
    brew services start redis
    sleep 2
fi

# Database name
DB_NAME="iog_production"

# Check if database exists
if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo -e "${YELLOW}⚠️  Database '$DB_NAME' already exists${NC}"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Dropping database..."
        dropdb -U postgres $DB_NAME 2>/dev/null || true
    else
        echo "Using existing database..."
    fi
fi

# Create database if it doesn't exist
if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "Creating database '$DB_NAME'..."
    createdb -U postgres $DB_NAME
    echo -e "${GREEN}✅ Database created${NC}"
fi

# Run schema
echo "Running database schema..."
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
psql -U postgres -d $DB_NAME -f "$SCRIPT_DIR/schema.sql" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Schema created successfully${NC}"
else
    echo -e "${RED}❌ Failed to create schema${NC}"
    exit 1
fi

# Verify tables
echo ""
echo "Verifying tables..."
TABLE_COUNT=$(psql -U postgres -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';")

echo -e "${GREEN}✅ Created $TABLE_COUNT tables${NC}"

# List tables
echo ""
echo "Tables created:"
psql -U postgres -d $DB_NAME -c "\dt" | grep -v "^$"

# Show stats
echo ""
echo "Database info:"
psql -U postgres -d $DB_NAME -c "SELECT * FROM database_info;" 2>/dev/null || true

echo ""
echo -e "${GREEN}✅ Database setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update .env files with your PostgreSQL password"
echo "2. Restart all backend services"
echo "3. Test the application"
echo ""
echo "Connection string:"
echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/$DB_NAME"
echo ""
