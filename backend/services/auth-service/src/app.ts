import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config';
import { morganStream, logger } from './utils/logger';
import authRoutes from './routes/auth.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

/**
 * Create and configure Express application
 */
export function createApp(): Express {
  const app = express();

  // Security middleware
  app.use(helmet()); // Sets various HTTP headers for security
  
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
      const { database } = await import('./database/mongodb');
      
      const dbHealthy = database.getConnection().readyState === 1;
      const status = dbHealthy ? 'healthy' : 'unhealthy';
      const statusCode = status === 'healthy' ? 200 : 503;

      res.status(statusCode).json({
        status,
        timestamp: new Date().toISOString(),
        service: 'auth-service',
        version: '1.0.0',
        database: 'MongoDB',
        checks: {
          mongodb: dbHealthy ? 'up' : 'down',
        },
      });
    } catch (error) {
      logger.error('Health check failed', error);
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'auth-service',
        version: '1.0.0',
      });
    }
  });

  // API routes
  app.use('/api/auth', authRoutes);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
