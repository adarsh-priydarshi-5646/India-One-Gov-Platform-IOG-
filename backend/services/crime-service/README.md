# Crime Service

Crime reporting and tracking microservice for India One-Gov Platform - handles FIR registration, criminal database, and case management.

## Features

- ✅ **FIR Registration** - File First Information Report online
- ✅ **Anonymous Reporting** - Report crimes anonymously
- ✅ **Evidence Upload** - Upload photos, videos, documents
- ✅ **Case Tracking** - Track FIR status from registration to closure
- ✅ **Criminal Records** - Database of criminals and wanted persons
- ✅ **Officer Assignment** - Auto-assign cases to investigating officers
- ✅ **Statistics & Analytics** - Crime trends and case statistics
- ✅ **Priority Management** - Automatic priority based on crime severity
- ✅ **Location Tracking** - Geolocation of crime incidents

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/firs` | Authenticated | Register new FIR |
| GET | `/api/firs/:id` | Authenticated | Get FIR details |
| GET | `/api/firs` | Authenticated | Search FIRs |
| GET | `/api/firs/stats` | Officer/Admin | Get crime statistics |
| PUT | `/api/firs/:id/status` | Officer/Admin | Update FIR status |
| POST | `/api/firs/:id/assign` | Admin | Assign investigating officer |
| POST | `/api/firs/:id/evidence` | Authenticated | Upload evidence |
| GET | `/health` | Public | Health check |

## Setup

```bash
npm install
cp .env.example .env
# Edit .env
npm run dev
```

## License

Proprietary - Government of India
