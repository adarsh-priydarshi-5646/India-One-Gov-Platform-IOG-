import { createApp } from './app';
import { config } from './config';
import { db } from './config/database';
import { logger } from './utils/logger';

async function startServer(): Promise<void> {
  try {
    const dbHealthy = await db.healthCheck();
    if (!dbHealthy) {
      throw new Error('PostgreSQL health check failed');
    }
    logger.info('PostgreSQL connected successfully');

    const app = createApp();

    const server = app.listen(config.server.port, () => {
      logger.info(`Crime Service listening on port ${config.server.port}`);
      logger.info(`Environment: ${config.server.env}`);
      logger.info(`Health check: http://localhost:${config.server.port}/health`);
    });

    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        logger.info('HTTP server closed');
        await db.close();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(async () => {
        logger.info('HTTP server closed');
        await db.close();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();

