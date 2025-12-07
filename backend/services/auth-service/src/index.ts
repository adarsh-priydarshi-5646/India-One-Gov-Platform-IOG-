import { createApp } from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { database } from './database/mongodb';

async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB
    await database.connect();
    logger.info('✅ MongoDB connection established');

    // Connect to Redis
    const { redis } = await import('./config/redis');
    await redis.connect();
    logger.info('✅ Redis connection established');

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`🚀 Auth Service running on port ${config.port}`);
      logger.info(`📍 Environment: ${config.env}`);
      logger.info(`💾 Database: MongoDB Atlas`);
      logger.info(`❤️  Health: http://localhost:${config.port}/health`);
    });

    // Graceful shutdown handlers
    const shutdown = async (signal: string) => {
      logger.info(`${signal} signal received: closing HTTP server`);
      server.close(async () => {
        logger.info('HTTP server closed');
        const { redis } = await import('./config/redis');
        await redis.disconnect();
        logger.info('Redis disconnected');
        await database.disconnect();
        logger.info('MongoDB disconnected');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
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
