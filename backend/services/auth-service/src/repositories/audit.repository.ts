import { db } from '../config/database';
import { AuditLogEntry } from '../types';
import { logger } from '../utils/logger';

export class AuditRepository {
  /**
   * Create audit log entry
   */
  async createLog(entry: AuditLogEntry): Promise<void> {
    try {
      await db.query(
        `INSERT INTO auth_audit_logs (
          user_id, action, ip_address, user_agent, status, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          entry.userId || null,
          entry.action,
          entry.ipAddress || null,
          entry.userAgent || null,
          entry.status,
          entry.metadata ? JSON.stringify(entry.metadata) : null,
        ]
      );
    } catch (error) {
      logger.error('Failed to create audit log', error);
      // Don't throw error - audit logging should not break the main flow
    }
  }

  /**
   * Get audit logs for a user
   */
  async findByUserId(userId: string, limit: number = 100): Promise<any[]> {
    const result = await db.query(
      `SELECT * FROM auth_audit_logs 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  }

  /**
   * Get failed login attempts for an IP
   */
  async getFailedLoginAttempts(ipAddress: string, minutesAgo: number = 15): Promise<number> {
    const result = await db.query(
      `SELECT COUNT(*) as count 
       FROM auth_audit_logs 
       WHERE ip_address = $1 
       AND action = 'LOGIN' 
       AND status = 'FAILURE' 
       AND created_at >= NOW() - INTERVAL '${minutesAgo} minutes'`,
      [ipAddress]
    );
    return parseInt(result.rows[0].count, 10);
  }
}

export const auditRepository = new AuditRepository();
