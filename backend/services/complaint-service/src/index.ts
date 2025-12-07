import { createApp } from './app';
import { config } from './config';
import { db } from './config/database';
import { mongodb } from './config/mongodb';
import { logger } from './utils/logger';

/**
 * Start the Complaint Service
 */
async function startServer(): Promise<void> {
  try {
    // Test PostgreSQL connection
    const dbHealthy = await db.healthCheck();
    if (!dbHealthy) {
      throw new Error('PostgreSQL health check failed');
    }
    logger.info('PostgreSQL connected successfully');

    // Connect to MongoDB
    await mongodb.connect();

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(config.server.port, () => {
      logger.info(`Complaint Service listening on port ${config.server.port}`);
      logger.info(`Environment: ${config.server.env}`);
      logger.info(`Health check: http://localhost:${config.server.port}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        logger.info('HTTP server closed');
        await mongodb.disconnect();
        await db.close();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT signal received: closing HTTP server');
      server.close(async () => {
        logger.info('HTTP server closed');
        await mongodb.disconnect();
        await db.close();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();

