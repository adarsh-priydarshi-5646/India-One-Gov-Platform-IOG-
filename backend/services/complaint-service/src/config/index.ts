import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || '3002', 10),
    env: process.env.NODE_ENV || 'development',
  },

  database: {
    url: process.env.DATABASE_URL!,
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '2', 10),
      max: parseInt(process.env.DB_POOL_MAX || '10', 10),
    },
  },

  mongodb: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
    dbName: process.env.MONGODB_DB || 'iog_production',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },

  aws: {
    region: process.env.AWS_REGION || 'ap-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    s3: {
      bucket: process.env.AWS_S3_BUCKET || 'iog-evidence-files',
      endpoint: process.env.AWS_S3_ENDPOINT,
    },
  },

  elasticsearch: {
    url: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },

  services: {
    authService: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    fraudAI: process.env.FRAUD_AI_SERVICE_URL || 'http://localhost:3008',
    notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3009',
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/jpg,application/pdf,video/mp4').split(','),
  },

  assignment: {
    autoAssignEnabled: process.env.AUTO_ASSIGN_ENABLED === 'true',
    escalationDays: parseInt(process.env.ESCALATION_DAYS || '7', 10),
  },

  security: {
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10', 10),
  },

  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
