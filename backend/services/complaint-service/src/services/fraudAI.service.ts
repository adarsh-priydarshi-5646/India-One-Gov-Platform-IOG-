import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';

export interface FraudAnalysisResult {
  fraudProbability: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  reasons?: string[];
}

export interface SentimentAnalysisResult {
  sentiment: {
    score: number; // -1 to 1
    label: 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE';
    confidence: number;
  };
  urgency: {
    score: number; // 0 to 1
    label: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  };
  emotions?: Record<string, number>;
  keywords?: string[];
}

export class FraudAIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.services.fraudAI;
  }

  /**
   * Analyze complaint for fraud detection
   */
  async analyzeFraud(complaintData: {
    userId: string;
    description: string;
    evidenceCount: number;
    category: string;
    location: { lat: number; lng: number };
  }): Promise<FraudAnalysisResult> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/fraud/analyze`,
        {
          entity_type: 'complaint',
          user_id: complaintData.userId,
          description: complaintData.description,
          evidence_count: complaintData.evidenceCount,
          category: complaintData.category,
          location: complaintData.location,
        },
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error('Fraud analysis failed');
    } catch (error: any) {
      logger.error('Fraud AI service error', error);
      
      // Return default (non-fraudulent) if AI service is down
      return {
        fraudProbability: 0.1,
        riskLevel: 'LOW',
        confidence: 0.5,
      };
    }
  }

  /**
   * Analyze sentiment and urgency
   */
  async analyzeSentiment(text: string): Promise<SentimentAnalysisResult> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/sentiment/analyze`,
        { text },
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error('Sentiment analysis failed');
    } catch (error: any) {
      logger.error('Sentiment analysis error', error);
      
      // Return default (neutral) if AI service is down
      return {
        sentiment: {
          score: 0,
          label: 'NEUTRAL',
          confidence: 0.5,
        },
        urgency: {
          score: 0.5,
          label: 'MEDIUM',
        },
      };
    }
  }
}

export const fraudAIService = new FraudAIService();
