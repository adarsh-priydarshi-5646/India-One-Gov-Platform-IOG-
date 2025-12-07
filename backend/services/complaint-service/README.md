# Complaint Service

Complaint management microservice for India One-Gov Platform - handles citizen grievances with AI-powered analysis.

## Features

- ✅ **Complaint Filing** with evidence upload (images, videos, PDFs)
- ✅ **AI-Powered Sentiment Analysis** for priority determination
- ✅ **Fraud Detection** using ML algorithms
- ✅ **Evidence Management** with S3 storage and MongoDB metadata
- ✅ **Status Tracking** with complete audit trail
- ✅ **Auto-Assignment** to departments based on category
- ✅ **Escalation System** for complaints exceeding resolution time
- ✅ **Feedback Collection** with ratings and comments
- ✅ **Advanced Search** with filters and pagination
- ✅ **Statistics & Analytics** for dashboards

## Tech Stack

- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Databases**: PostgreSQL (complaints), MongoDB (evidence), Redis (cache)
- **Storage**: AWS S3 for evidence files
- **AI Integration**: Fraud AI Service for sentiment & fraud detection

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/complaints` | Authenticated | Create new complaint with files |
| GET | `/api/complaints/:id` | Authenticated | Get complaint details |
| GET | `/api/complaints` | Authenticated | Search complaints |
| GET | `/api/complaints/stats` | Authenticated | Get statistics |
| PUT | `/api/complaints/:id/status` | Officer/Admin | Update complaint status |
| POST | `/api/complaints/:id/assign` | Admin | Assign to officer |
| POST | `/api/complaints/:id/escalate` | Officer/Admin | Escalate complaint |
| POST | `/api/complaints/:id/feedback` | Citizen | Submit feedback |
| POST | `/api/complaints/:id/evidence` | Citizen/Officer | Upload additional evidence |
| GET | `/health` | Public | Health check |

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 15
- MongoDB 6
- Redis 7
- AWS S3 (or compatible  storage)

### Installation

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
```

### Development

```bash
npm run dev  # Development mode
npm run build  # Build TypeScript
npm start  # Production mode
```

## File Upload

**Supported Formats**:
- Images: JPEG, PNG, JPG
- Videos: MP4
- Documents: PDF

**Size Limit**: 10MB per file  
**Max Files**: 5 files per request

## Environment Variables

See `.env.example` for all configurable options.

**Required**:
- `DATABASE_URL` - PostgreSQL connection
- `MONGODB_URL` - MongoDB connection
- `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY` - S3 credentials
- `AWS_S3_BUCKET` - S3 bucket name
- `FRAUD_AI_SERVICE_URL` - AI service endpoint

## Example Usage

### Create Complaint

```bash
curl -X POST http://localhost:3002/api/complaints \
  -H "Authorization: Bearer {token}" \
  -F "category=Water Supply" \
  -F "title=No water supply for 3 days" \
  -F "description=There has been no water supply in our area for the past 3 days. Many families are facing difficulty." \
  -F "locationLat=19.0760" \
  -F "locationLng=72.8777" \
  -F "address=Andheri West,Mumbai, Maharashtra" \
  -F "state=Maharashtra" \
  -F "district=Mumbai" \
  -F "files=@evidence1.jpg" \
  -F "files=@evidence2.jpg"
```

### Search Complaints

```bash
curl "http://localhost:3002/api/complaints?status=SUBMITTED,IN_PROGRESS&category=Water Supply&page=1&limit=10" \
  -H "Authorization: Bearer {token}"
```

### Update Status

```bash
curl -X PUT http://localhost:3002/api/complaints/{id}/status \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS",
    "notes": "Work has been assigned to water department",
    "estimatedResolutionDays": 3
  }'
```

## License

Proprietary - Government of India
