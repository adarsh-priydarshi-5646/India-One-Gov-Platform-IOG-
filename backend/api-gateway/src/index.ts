import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(cors({ 
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true 
}));
app.use(express.json());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Service routes with proxy
const services = [
  { path: '/api/auth', target: process.env.AUTH_SERVICE_URL || 'http://localhost:3001' },
  { path: '/api/complaints', target: process.env.COMPLAINT_SERVICE_URL || 'http://localhost:3002' },
  { path: '/api/crime', target: process.env.CRIME_SERVICE_URL || 'http://localhost:3003' },
  { path: '/api/corruption', target: process.env.CORRUPTION_SERVICE_URL || 'http://localhost:3004' },
  { path: '/api/jobs', target: process.env.EMPLOYMENT_SERVICE_URL || 'http://localhost:3005' },
  { path: '/api/notifications', target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006' },
];

services.forEach(({ path, target }) => {
  app.use(
    path,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: (path, req) => {
        // Keep the full path including /api
        return path;
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying ${req.method} ${req.url} to ${target}`);
      },
      onError: (err, req, res: any) => {
        console.error(`Proxy error for ${path}:`, err.message);
        res.status(503).json({
          success: false,
          error: {
            code: 'SERVICE_UNAVAILABLE',
            message: `Service temporarily unavailable: ${path}`,
          },
        });
      },
    })
  );
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Gateway error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📡 Proxying to services:`);
  services.forEach(({ path, target }) => {
    console.log(`   ${path} -> ${target}`);
  });
});
