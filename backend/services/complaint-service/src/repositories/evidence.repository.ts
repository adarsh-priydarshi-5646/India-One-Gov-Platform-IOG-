import { mongodb } from '../config/mongodb';
import { EvidenceDocument, EvidenceFile } from '../types';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export class EvidenceRepository {
  private collectionName = 'evidence_files';

  /**
   * Create evidence document for a complaint
   */
  async create(complaintId: string, files: EvidenceFile[]): Promise<EvidenceDocument> {
    try {
      const document: EvidenceDocument = {
        complaintId,
        entityType: 'COMPLAINT',
        files,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const collection = mongodb.getCollection<EvidenceDocument>(this.collectionName);
      const result = await collection.insertOne(document);

      return { ...document, _id: result.insertedId.toString() };
    } catch (error) {
      logger.error('Failed to create evidence document', error);
      throw error;
    }
  }

  /**
   * Find evidence by complaint ID
   */
  async findByComplaintId(complaintId: string): Promise<EvidenceDocument | null> {
    try {
      const collection = mongodb.getCollection<EvidenceDocument>(this.collectionName);
      const document = await collection.findOne({ complaintId });

      return document;
    } catch (error) {
      logger.error('Failed to find evidence', error);
      return null;
    }
  }

  /**
   * Add files to existing evidence document
   */
  async addFiles(complaintId: string, files: EvidenceFile[]): Promise<void> {
    try {
      const collection = mongodb.getCollection<EvidenceDocument>(this.collectionName);
      
      await collection.updateOne(
        { complaintId },
        {
          $push: { files: { $each: files } },
          $set: { updatedAt: new Date() },
        },
        { upsert: true }
      );
    } catch (error) {
      logger.error('Failed to add evidence files', error);
      throw error;
    }
  }

  /**
   * Delete a specific file from evidence
   */
  async deleteFile(complaintId: string, fileId: string): Promise<void> {
    try {
      const collection = mongodb.getCollection<EvidenceDocument>(this.collectionName);
      
      await collection.updateOne(
        { complaintId },
        {
          $pull: { files: { fileId } },
          $set: { updatedAt: new Date() },
        }
      );
    } catch (error) {
      logger.error('Failed to delete evidence file', error);
      throw error;
    }
  }

  /**
   * Delete all evidence for a complaint
   */
  async deleteByComplaintId(complaintId: string): Promise<void> {
    try {
      const collection = mongodb.getCollection<EvidenceDocument>(this.collectionName);
      await collection.deleteOne({ complaintId });
    } catch (error) {
      logger.error('Failed to delete evidence document', error);
      throw error;
    }
  }

  /**
   * Get file count for a complaint
   */
  async getFileCount(complaintId: string): Promise<number> {
    try {
      const evidence = await this.findByComplaintId(complaintId);
      return evidence?.files.length || 0;
    } catch (error) {
      logger.error('Failed to get file count', error);
      return 0;
    }
  }
}

export const evidenceRepository = new EvidenceRepository();
