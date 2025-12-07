# Database Setup Guide

## Prerequisites

1. **PostgreSQL 15+** installed
2. **MongoDB Atlas** account (already provided)
3. **Redis** installed and running

---

## Step 1: Create PostgreSQL Database

```bash
# Option 1: Using createdb command
createdb iog_production

# Option 2: Using psql
psql -U postgres
CREATE DATABASE iog_production;
\q
```

---

## Step 2: Run Database Schema

```bash
# Run the schema file
psql -U postgres -d iog_production -f /Users/adarshpriydarshi/Desktop/IOG/backend/database/schema.sql

# Verify tables were created
psql -U postgres -d iog_production -c "\dt"
```

Expected output:
```
                List of relations
 Schema |           Name            | Type  |  Owner   
--------+---------------------------+-------+----------
 public | auth_audit_logs           | table | postgres
 public | complaint_status_history  | table | postgres
 public | complaints                | table | postgres
 public | criminal_records          | table | postgres
 public | firs                      | table | postgres
 public | users                     | table | postgres
```

---

## Step 3: Update Database Connection

The `.env` files have been updated with:

### PostgreSQL (Local)
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/iog_production
```

**Change `password` to your PostgreSQL password!**

### MongoDB Atlas (Cloud)
```
MONGODB_URL=mongodb+srv://adarshpriydarshi5646_db_user:7SKx4g2X1WOnIBJO@cluster0.fvnajhe.mongodb.net/
MONGODB_DB=iog_production
```

---

## Step 4: Test Database Connections

### Test PostgreSQL

```bash
psql -U postgres -d iog_production -c "SELECT * FROM database_info;"
```

### Test MongoDB

```bash
# Using mongosh (MongoDB Shell)
mongosh "mongodb+srv://adarshpriydarshi5646_db_user:7SKx4g2X1WOnIBJO@cluster0.fvnajhe.mongodb.net/"

# In mongosh:
use iog_production
db.evidence_files.insertOne({test: "connection"})
db.evidence_files.find()
db.evidence_files.deleteOne({test: "connection"})
exit
```

### Test Redis

```bash
redis-cli ping
# Should return: PONG
```

---

## Step 5: Update PostgreSQL Password

If your PostgreSQL password is different from `password`, update in ALL service .env files:

```bash
# Auth Service
nano /Users/adarshpriydarshi/Desktop/IOG/backend/services/auth-service/.env
# Change: DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/iog_production

# Complaint Service
nano /Users/adarshpriydarshi/Desktop/IOG/backend/services/complaint-service/.env

# Crime Service  
nano /Users/adarshpriydarshi/Desktop/IOG/backend/services/crime-service/.env
```

---

## Step 6: Restart Services

```bash
# Stop all running services (Ctrl+C in each terminal)

# Restart Auth Service
cd /Users/adarshpriydarshi/Desktop/IOG/backend/services/auth-service
npm run dev

# Restart Complaint Service
cd /Users/adarshpriydarshi/Desktop/IOG/backend/services/complaint-service
npm run dev

# Restart Crime Service
cd /Users/adarshpriydarshi/Desktop/IOG/backend/services/crime-service
npm run dev
```

---

## Step 7: Verify Everything Works

### Test Auth Service

```bash
# Health check
curl http://localhost:3001/health

# Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "aadhaarNumber": "123456789012",
    "phoneNumber": "+919876543210",
    "email": "[email protected]",
    "password": "SecureP@ssw0rd123!",
    "role": "CITIZEN"
  }'

# Check database
psql -U postgres -d iog_production -c "SELECT id, phone_number, email, full_name, role FROM users;"
```

### Test Complaint Service

```bash
# Health check (should show MongoDB connection)
curl http://localhost:3002/health
```

### Test Crime Service

```bash
# Health check
curl http://localhost:3003/health
```

---

## Troubleshooting

### PostgreSQL Connection Error

```bash
# Check if PostgreSQL is running
pg_isready

# Check connection
psql -U postgres -c "SELECT version();"

# If password issue:
# Edit pg_hba.conf to allow local connections
# Location: /usr/local/var/postgresql@15/pg_hba.conf (macOS)
```

### MongoDB Atlas Connection Error

```bash
# Test connection string directly
mongosh "mongodb+srv://adarshpriydarshi5646_db_user:7SKx4g2X1WOnIBJO@cluster0.fvnajhe.mongodb.net/" --eval "db.runCommand({ping:1})"

# Check IP whitelist in MongoDB Atlas
# Go to: https://cloud.mongodb.com → Network Access → Add your IP
```

### Redis Not Running

```bash
# Start Redis (macOS)
brew services start redis

# Or run directly
redis-server

# Test
redis-cli ping
```

---

## Database Schema Overview

### Auth Service Tables
- `users` - User accounts with Aadhaar hash
- `auth_audit_logs` - Authentication event logs

### Complaint Service Tables
- `complaints` - Complaint records
- `complaint_status_history` - Status change audit trail

### Crime Service Tables
- `firs` - First Information Reports
- `criminal_records` - Criminal database

### MongoDB Collections
- `evidence_files` - Complaint evidence metadata
- `crime_evidence` - Crime evidence metadata

---

## Default Admin User

A super admin user is created by default:

- **Phone**: +919999999999
- **Email**: [email protected]
- **Password**: Admin@123456
- **Role**: SUPER_ADMIN

**Change this password immediately in production!**

---

## Next Steps

1. ✅ Schema created
2. ✅ MongoDB connected
3. ✅ Services updated
4. 🔄 Restart services
5. ✅ Test everything works

---

**Database Setup Complete!** 🎉
