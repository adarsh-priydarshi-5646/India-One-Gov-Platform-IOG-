import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config';
import { morganStream, logger } from './utils/logger';
import crimeRoutes from './routes/crime.routes';
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

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms', {
      stream: morganStream,
    })
  );

  // Health check
  app.get('/health', async (_req: Request, res: Response) => {
    try {
      const { db } = await import('./config/database');
      const dbHealthy = await db.healthCheck();

      res.status(dbHealthy ? 200 : 503).json({
        status: dbHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'crime-service',
        version: '1.0.0',
        checks: {
          postgresql: dbHealthy ? 'up' : 'down',
        },
      });
    } catch (error) {
      logger.error('Health check failed', error);
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'crime-service',
      });
    }
  });

  app.use('/api/firs', crimeRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
