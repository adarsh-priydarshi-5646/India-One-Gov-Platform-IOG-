import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),

  // MongoDB Configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/iog_auth',
  },

  // PostgreSQL Configuration (for audit logs)
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/iog_production',
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '2', 10),
      max: parseInt(process.env.DB_POOL_MAX || '10', 10),
    },
  },

  // Redis Configuration (for sessions)
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },

  jwt: {
    secret: process.env.JWT_SECRET as string,
    accessExpiry: '15m' as string,
    refreshExpiry: '7d' as string,
  },

  server: {
    env: process.env.NODE_ENV || 'development',
  },

  aadhaar: {
    apiUrl: process.env.AADHAAR_API_URL || 'https://api.uidai.gov.in/ekyc/v1',
    apiKey: process.env.AADHAAR_API_KEY || '',
    licenseKey: process.env.AADHAAR_LICENSE_KEY || '',
  },

  sms: {
    provider: process.env.SMS_PROVIDER || 'msg91',
    msg91: {
      authKey: process.env.MSG91_AUTH_KEY || '',
      senderId: process.env.MSG91_SENDER_ID || 'IOGGOV',
      route: process.env.MSG91_ROUTE || '4',
    },
  },

  email: {
    from: process.env.EMAIL_FROM || 'noreply@iog.gov.in',
    aws: {
      region: process.env.AWS_REGION || 'ap-south-1',
      accessKey: process.env.AWS_SES_ACCESS_KEY || '',
      secretKey: process.env.AWS_SES_SECRET_KEY || '',
    },
  },

  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5', 10),
  },

  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
