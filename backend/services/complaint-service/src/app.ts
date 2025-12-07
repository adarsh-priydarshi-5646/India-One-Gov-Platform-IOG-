import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config';
import { morganStream, logger } from './utils/logger';
import complaintRoutes from './routes/complaint.routes';

// Copy error middleware from auth service
import { Request as Req, Response as Res, NextFunction } from 'express';
import { ApiResponse } from './types';

function errorHandler(err: Error, req: Req, res: Res, _next: NextFunction): void {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isDevelopment ? err.message : 'An unexpected error occurred',
      ...(isDevelopment && { stack: err.stack }),
    },
  } as ApiResponse);
}

function notFoundHandler(req: Req, res: Res): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  } as ApiResponse);
}

/**
 * Create and configure Express application
 */
export function createApp(): Express {
  const app = express();

  // Security middleware
  app.use(helmet());
  
  // CORS configuration
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Logging middleware
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms', {
      stream: morganStream,
    })
  );

  // Health check endpoint
  app.get('/health', async (_req: Request, res: Response) => {
    try {
      const { db } = await import('./config/database');
      const { mongodb } = await import('./config/mongodb');
      const { s3Service } = await import('./config/s3');

      const dbHealthy = await db.healthCheck();
      const mongoHealthy = await mongodb.healthCheck();
      const s3Healthy = await s3Service.healthCheck();

      const status = dbHealthy && mongoHealthy && s3Healthy ? 'healthy' : 'unhealthy';
      const statusCode = status === 'healthy' ? 200 : 503;

      res.status(statusCode).json({
        status,
        timestamp: new Date().toISOString(),
        service: 'complaint-service',
        version: '1.0.0',
        checks: {
          postgresql: dbHealthy ? 'up' : 'down',
          mongodb: mongoHealthy ? 'up' : 'down',
          s3: s3Healthy ? 'up' : 'down',
        },
      });
    } catch (error) {
      logger.error('Health check failed', error);
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'complaint-service',
        version: '1.0.0',
      });
    }
  });

  // API routes
  app.use('/api/complaints', complaintRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
