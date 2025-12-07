import mongoose from 'mongoose';
import { config } from '../config';
import { logger } from '../utils/logger';

class Database {
  private static instance: Database;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      const mongoUri = config.mongodb.uri;
      
      await mongoose.connect(mongoUri, {
        dbName: 'iog_auth',
      });

      logger.info('MongoDB connected successfully');

      mongoose.connection.on('error', (error) => {
        logger.error('MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
      });
    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      logger.info('MongoDB disconnected');
    } catch (error) {
      logger.error('Error disconnecting from MongoDB:', error);
    }
  }

  public getConnection() {
    return mongoose.connection;
  }
}

export const database = Database.getInstance();
