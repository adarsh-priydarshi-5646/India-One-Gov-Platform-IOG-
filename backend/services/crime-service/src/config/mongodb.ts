import { MongoClient, Db, Collection } from 'mongodb';
import { config } from './index';
import { logger } from '../utils/logger';

class MongoDB {
  private client: MongoClient;
  private db: Db | null = null;
  private static instance: MongoDB;

  private constructor() {
    this.client = new MongoClient(config.mongodb.url);
  }

  public static getInstance(): MongoDB {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB();
    }
    return MongoDB.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db(config.mongodb.dbName);
      logger.info('MongoDB connected successfully');
    } catch (error) {
      logger.error('MongoDB connection failed', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    await this.client.close();
    logger.info('MongoDB disconnected');
  }

  public getDb(): Db {
    if (!this.db) {
      throw new Error('MongoDB not connected');
    }
    return this.db;
  }

  public getCollection<T = any>(name: string): Collection<T> {
    return this.getDb().collection<T>(name);
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.client.db('admin').command({ ping: 1 });
      return true;
    } catch (error) {
      logger.error('MongoDB health check failed', error);
      return false;
    }
  }
}

export const mongodb = MongoDB.getInstance();
