import { createClient, RedisClientType } from 'redis';
import { config } from './index';
import { logger } from '../utils/logger';

class RedisClient {
  private client: RedisClientType;
  private static instance: RedisClient;

  private constructor() {
    this.client = createClient({
      url: config.redis.url,
      password: config.redis.password,
      database: config.redis.db,
    });

    this.client.on('error', (err) => {
      logger.error('Redis Client Error', err);
    });

    this.client.on('connect', () => {
      logger.info('Redis client connected');
    });

    this.client.on('ready', () => {
      logger.info('Redis client ready');
    });

    this.client.on('reconnecting', () => {
      logger.warn('Redis client reconnecting');
    });
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  public async connect(): Promise<void> {
    await this.client.connect();
  }

  public async disconnect(): Promise<void> {
    await this.client.disconnect();
    logger.info('Redis client disconnected');
  }

  // Session management
  public async setSession(userId: string, deviceId: string, data: any, ttl: number = 604800): Promise<void> {
    const key = `session:${userId}:${deviceId}`;
    await this.client.setEx(key, ttl, JSON.stringify(data));
  }

  public async getSession(userId: string, deviceId: string): Promise<any | null> {
    const key = `session:${userId}:${deviceId}`;
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  public async deleteSession(userId: string, deviceId: string): Promise<void> {
    const key = `session:${userId}:${deviceId}`;
    await this.client.del(key);
  }

  // OTP management
  public async setOTP(phoneNumber: string, type: string, otp: string, ttl: number = 600): Promise<void> {
    const key = `otp:${phoneNumber}:${type}`;
    await this.client.setEx(key, ttl, otp);
  }

  public async getOTP(phoneNumber: string, type: string): Promise<string | null> {
    const key = `otp:${phoneNumber}:${type}`;
    return await this.client.get(key);
  }

  public async deleteOTP(phoneNumber: string, type: string): Promise<void> {
    const key = `otp:${phoneNumber}:${type}`;
    await this.client.del(key);
  }

  // Rate limiting
  public async incrementRateLimit(key: string, ttl: number): Promise<number> {
    const current = await this.client.incr(key);
    if (current === 1) {
      await this.client.expire(key, ttl);
    }
    return current;
  }

  public async getRateLimit(key: string): Promise<number> {
    const value = await this.client.get(key);
    return value ? parseInt(value, 10) : 0;
  }

  // Generic operations
  public async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  public async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  public async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch (error) {
      logger.error('Redis health check failed', error);
      return false;
    }
  }
}

export const redis = RedisClient.getInstance();
