# Auth Service

Authentication and authorization microservice for India One-Gov Platform.

## Features

- ✅ **User Registration** with Aadhaar eKYC verification
- ✅ **OTP-based Verification** for phone number confirmation
- ✅ **JWT Authentication** with access and refresh tokens
- ✅ **Role-Based Access Control** (RBAC) for multi-user types
- ✅ **Session Management** with Redis
- ✅ **Password Security** with bcrypt hashing
- ✅ **Rate Limiting** to prevent brute force attacks
- ✅ **Audit Logging** for all authentication events
- ✅ **Health Check** endpoint for monitoring

## Tech Stack

- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (user data), Redis (sessions/OTP)
- **Authentication**: JWT, Passport.js
- **Security**: bcrypt, Helmet, CORS

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user with Aadhaar |
| POST | `/api/auth/verify-otp` | Verify OTP and complete registration |
| POST | `/api/auth/login` | Login with phone/email and password |
| POST | `/api/auth/refresh` | Refresh access token |

### Protected Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/logout` | Logout and invalidate session |
| GET | `/api/auth/me` | Get current user profile |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Service health status |

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 15
- Redis 7

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Database Setup

```sql
-- Create database
CREATE DATABASE iog_production;

-- Run migrations (from project root)
psql -d iog_production -f ../../database/postgresql/schema.sql
```

### Development

```bash
# Run in development mode with hot reload
npm run dev

# Build TypeScript
npm run build

# Run production
npm start

# Run tests
npm test
```

## Environment Variables

See `.env.example` for all required environment variables.

**Critical Variables**:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_REFRESH_SECRET`: Secret key for refresh tokens

## Project Structure

```
src/
├── config/           # Configuration and database connections
├── controllers/      # Request handlers
├── middleware/       # Express middleware
├── repositories/     # Database access layer
├── routes/           # API routes
├── services/         # Business logic
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── app.ts            # Express app setup
└── index.ts          # Server entry point
```

## Security Features

1. **Password Hashing**: bcrypt with 12 salt rounds
2. **JWT Tokens**: RS256 asymmetric encryption
3. **Session Management**: Redis with TTL
4. **Rate Limiting**: 5 login attempts per 15 minutes
5. **Aadhaar Protection**: SHA-256 hashing, never stored in plaintext
6. **Audit Logging**: All auth events logged
7. **HTTPS Only**: TLS 1.3 in production
8. **CORS**: Configured allowed origins

## API Usage Examples

### Register User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "aadhaarNumber": "123456789012",
    "phoneNumber": "+919876543210",
    "email": "[email protected]",
    "password": "SecureP@ssw0rd",
    "role": "CITIZEN"
  }'
```

### Verify OTP

```bash
curl -X POST http://localhost:3001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "otp": "123456"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "+919876543210",
    "password": "SecureP@ssw0rd",
    "deviceId": "web-browser-123"
  }'
```

### Get Current User

```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer {access_token}"
```

## Deployment

### Docker

```bash
# Build image
docker build -t iog-auth-service .

# Run container
docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  iog-auth-service
```

### Kubernetes

```bash
kubectl apply -f ../../infrastructure/kubernetes/auth-service-deployment.yaml
```

## Monitoring

- **Logs**: `/logs` directory (error.log, combined.log)
- **Health**: GET `/health`
- **Metrics**: Prometheus metrics at `/metrics` (TODO)

## License

Proprietary - Government of India

## Contact

IOG Technical Team - [email protected]
