import AWS from 'aws-sdk';
import { config } from './index';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

class S3Service {
  private s3: AWS.S3;
  private static instance: S3Service;

  private constructor() {
    AWS.config.update({
      region: config.aws.region,
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey,
    });

    this.s3 = new AWS.S3({
      ...(config.aws.s3.endpoint && { endpoint: config.aws.s3.endpoint }),
    });
  }

  public static getInstance(): S3Service {
    if (!S3Service.instance) {
      S3Service.instance = new S3Service();
    }
    return S3Service.instance;
  }

  /**
   * Upload file to S3
   */
  public async uploadFile(
    file: Express.Multer.File,
    folder: string = 'complaints'
  ): Promise<{ key: string; url: string; size: number }> {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const key = `${folder}/${uuidv4()}.${fileExtension}`;

      const params: AWS.S3.PutObjectRequest = {
        Bucket: config.aws.s3.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'private', // Files are private, accessible via signed URLs only
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
        },
      };

      const result = await this.s3.upload(params).promise();

      logger.info('File uploaded to S3', { key, size: file.size });

      return {
        key: result.Key,
        url: result.Location,
        size: file.size,
      };
    } catch (error) {
      logger.error('S3 upload failed', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Generate signed URL for secure file access
   */
  public getSignedUrl(key: string, expiresIn: number = 3600): string {
    try {
      const url = this.s3.getSignedUrl('getObject', {
        Bucket: config.aws.s3.bucket,
        Key: key,
        Expires: expiresIn, // 1 hour by default
      });

      return url;
    } catch (error) {
      logger.error('Failed to generate signed URL', error);
      throw new Error('Failed to generate file URL');
    }
  }

  /**
   * Delete file from S3
   */
  public async deleteFile(key: string): Promise<void> {
    try {
      await this.s3
        .deleteObject({
          Bucket: config.aws.s3.bucket,
          Key: key,
        })
        .promise();

      logger.info('File deleted from S3', { key });
    } catch (error) {
      logger.error('S3 delete failed', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Delete multiple files from S3
   */
  public async deleteFiles(keys: string[]): Promise<void> {
    try {
      if (keys.length === 0) return;

      await this.s3
        .deleteObjects({
          Bucket: config.aws.s3.bucket,
          Delete: {
            Objects: keys.map((key) => ({ Key: key })),
          },
        })
        .promise();

      logger.info('Multiple files deleted from S3', { count: keys.length });
    } catch (error) {
      logger.error('S3 batch delete failed', error);
      throw new Error('Failed to delete files');
    }
  }

  /**
   * Check if S3 bucket is accessible
   */
  public async healthCheck(): Promise<boolean> {
    try {
      await this.s3.headBucket({ Bucket: config.aws.s3.bucket }).promise();
      return true;
    } catch (error) {
      logger.error('S3 health check failed', error);
      return false;
    }
  }
}

export const s3Service = S3Service.getInstance();
