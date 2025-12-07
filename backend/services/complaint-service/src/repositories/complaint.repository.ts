import { db } from '../config/database';
import { 
  Complaint, 
  ComplaintStatus, 
  ComplaintPriority,
  ComplaintSearchFilters,
  UpdateStatusRequest
} from '../types';
import { logger } from '../utils/logger';

export class ComplaintRepository {
  /**
   * Create a new complaint
   */
  async create(complaint: Partial<Complaint>): Promise<Complaint> {
    try {
      const result = await db.query(
        `INSERT INTO complaints (
          citizen_id, category, sub_category, title, description,
          location_lat, location_lng, address, state, district, pincode,
          department, priority, status, sentiment_score, urgency_score
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *`,
        [
          complaint.citizenId,
          complaint.category,
          complaint.subCategory || null,
          complaint.title,
          complaint.description,
          complaint.locationLat,
          complaint.locationLng,
          complaint.address,
          complaint.state,
          complaint.district,
          complaint.pincode || null,
          complaint.department || null,
          complaint.priority || ComplaintPriority.MEDIUM,
          ComplaintStatus.SUBMITTED,
          complaint.sentimentScore || null,
          complaint.urgencyScore || null,
        ]
      );

      return this.mapRowToComplaint(result.rows[0]);
    } catch (error) {
      logger.error('Failed to create complaint', error);
      throw error;
    }
  }

  /**
   * Find complaint by ID
   */
  async findById(id: string): Promise<Complaint | null> {
    const result = await db.query('SELECT * FROM complaints WHERE id = $1', [id]);
    return result.rows.length > 0 ? this.mapRowToComplaint(result.rows[0]) : null;
  }

  /**
   * Find complaint by complaint number
   */
  async findByComplaintNumber(complaintNumber: string): Promise<Complaint | null> {
    const result = await db.query('SELECT * FROM complaints WHERE complaint_number = $1', [complaintNumber]);
    return result.rows.length > 0 ? this.mapRowToComplaint(result.rows[0]) : null;
  }

  /**
   * Search complaints with filters and pagination
   */
  async search(filters: ComplaintSearchFilters): Promise<{ data: Complaint[]; total: number }> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Build WHERE clause
    if (filters.citizenId) {
      conditions.push(`citizen_id = $${paramIndex}`);
      params.push(filters.citizenId);
      paramIndex++;
    }

    if (filters.assignedTo) {
      conditions.push(`assigned_to = $${paramIndex}`);
      params.push(filters.assignedTo);
      paramIndex++;
    }

    if (filters.status && filters.status.length > 0) {
      conditions.push(`status = ANY($${paramIndex})`);
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.category && filters.category.length > 0) {
      conditions.push(`category = ANY($${paramIndex})`);
      params.push(filters.category);
      paramIndex++;
    }

    if (filters.district) {
      conditions.push(`district = $${paramIndex}`);
      params.push(filters.district);
      paramIndex++;
    }

    if (filters.state) {
      conditions.push(`state = $${paramIndex}`);
      params.push(filters.state);
      paramIndex++;
    }

    if (filters.priority && filters.priority.length > 0) {
      conditions.push(`priority = ANY($${paramIndex})`);
      params.push(filters.priority);
      paramIndex++;
    }

    if (filters.isEscalated !== undefined) {
      conditions.push(`is_escalated = $${paramIndex}`);
      params.push(filters.isEscalated);
      paramIndex++;
    }

    if (filters.dateFrom) {
      conditions.push(`created_at >= $${paramIndex}`);
      params.push(filters.dateFrom);
      paramIndex++;
    }

    if (filters.dateTo) {
      conditions.push(`created_at <= $${paramIndex}`);
      params.push(filters.dateTo);
      paramIndex++;
    }

    if (filters.searchQuery) {
      conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${filters.searchQuery}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total
    const countResult = await db.query(`SELECT COUNT(*) as total FROM complaints ${whereClause}`, params);
    const total = parseInt(countResult.rows[0].total, 10);

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    // Sorting
    const sortBy = filters.sortBy || 'createdAt';
    const order = filters.order || 'desc';
    const sortColumn = this.camelToSnake(sortBy);

    // Fetch data
    const dataQuery = `
      SELECT * FROM complaints 
      ${whereClause}
      ORDER BY ${sortColumn} ${order.toUpperCase()}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const dataResult = await db.query(dataQuery, params);
    const data = dataResult.rows.map(this.mapRowToComplaint);

    return { data, total };
  }

  /**
   * Update complaint
   */
  async update(id: string, updates: Partial<Complaint>): Promise<Complaint> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'complaintNumber') {
        const snakeKey = this.camelToSnake(key);
        fields.push(`${snakeKey} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await db.query(
      `UPDATE complaints SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('Complaint not found');
    }

    return this.mapRowToComplaint(result.rows[0]);
  }

  /**
   * Update complaint status
   */
  async updateStatus(id: string, statusUpdate: UpdateStatusRequest, userId?: string): Promise<Complaint> {
    const updates: Partial<Complaint> = {
      status: statusUpdate.status,
    };

    if (statusUpdate.notes) {
      updates.resolutionNotes = statusUpdate.notes;
    }

    if (statusUpdate.estimatedResolutionDays) {
      updates.estimatedResolutionDays = statusUpdate.estimatedResolutionDays;
    }

    if (statusUpdate.status === ComplaintStatus.RESOLVED) {
      updates.resolvedAt = new Date();
    }

    if (statusUpdate.status === ComplaintStatus.CLOSED) {
      updates.closedAt = new Date();
    }

    const complaint = await this.update(id, updates);

    // Log status change
    await this.logStatusChange(id, statusUpdate.status, userId, statusUpdate.notes);

    return complaint;
  }

  /**
   * Assign complaint to officer
   */
  async assign(id: string, officerId: string): Promise<Complaint> {
    return await this.update(id, {
      assignedTo: officerId,
      assignedAt: new Date(),
      status: ComplaintStatus.ASSIGNED,
    });
  }

  /**
   * Escalate complaint
   */
  async escalate(id: string): Promise<Complaint> {
    return await this.update(id, {
      isEscalated: true,
      escalatedAt: new Date(),
      priority: ComplaintPriority.URGENT,
    });
  }

  /**
   * Submit feedback
   */
  async submitFeedback(id: string, rating: number, feedback?: string): Promise<Complaint> {
    return await this.update(id, {
      citizenRating: rating,
      citizenFeedback: feedback,
    });
  }

  /**
   * Log status change to history table
   */
  private async logStatusChange(
    complaintId: string,
    newStatus: ComplaintStatus,
    changedBy?: string,
    comment?: string
  ): Promise<void> {
    try {
      // Get previous status
      const complaint = await this.findById(complaintId);
      
      await db.query(
        `INSERT INTO complaint_status_history (complaint_id, previous_status, new_status, changed_by, comment)
         VALUES ($1, $2, $3, $4, $5)`,
        [complaintId, complaint?.status || null, newStatus, changedBy || null, comment || null]
      );
    } catch (error) {
      logger.error('Failed to log status change', error);
      // Don't throw - status change logging should not break the main flow
    }
  }

  /**
   * Get complaints requiring escalation
   */
  async getComplaintsForEscalation(days: number = 7): Promise<Complaint[]> {
    const result = await db.query(
      `SELECT * FROM complaints 
       WHERE status IN ('SUBMITTED', 'ASSIGNED', 'IN_PROGRESS')
       AND is_escalated = FALSE
       AND created_at < NOW() - INTERVAL '${days} days'`,
      []
    );

    return result.rows.map(this.mapRowToComplaint);
  }

  /**
   * Get statistics
   */
  async getStatistics(filters: Partial<ComplaintSearchFilters> = {}): Promise<any> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.citizenId) {
      conditions.push(`citizen_id = $${paramIndex}`);
      params.push(filters.citizenId);
      paramIndex++;
    }

    if (filters.district) {
      conditions.push(`district = $${paramIndex}`);
      params.push(filters.district);
      paramIndex++;
    }

    if (filters.state) {
      conditions.push(`state = $${paramIndex}`);
      params.push(filters.state);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await db.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'SUBMITTED') as submitted,
        COUNT(*) FILTER (WHERE status = 'ASSIGNED') as assigned,
        COUNT(*) FILTER (WHERE status = 'IN_PROGRESS') as in_progress,
        COUNT(*) FILTER (WHERE status = 'RESOLVED') as resolved,
        COUNT(*) FILTER (WHERE status = 'CLOSED') as closed,
        COUNT(*) FILTER (WHERE status = 'REJECTED') as rejected,
        COUNT(*) FILTER (WHERE is_escalated = TRUE) as escalated,
        AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/86400) FILTER (WHERE resolved_at IS NOT NULL) as avg_resolution_days
       FROM complaints ${whereClause}`,
      params
    );

    return result.rows[0];
  }

  /**
   * Map database row to Complaint object
   */
  private mapRowToComplaint(row: any): Complaint {
    return {
      id: row.id,
      complaintNumber: row.complaint_number,
      citizenId: row.citizen_id,
      category: row.category,
      subCategory: row.sub_category,
      title: row.title,
      description: row.description,
      locationLat: parseFloat(row.location_lat),
      locationLng: parseFloat(row.location_lng),
      address: row.address,
      state: row.state,
      district: row.district,
      pincode: row.pincode,
      department: row.department,
      priority: row.priority as ComplaintPriority,
      status: row.status as ComplaintStatus,
      assignedTo: row.assigned_to,
      assignedAt: row.assigned_at,
      resolvedAt: row.resolved_at,
      closedAt: row.closed_at,
      resolutionNotes: row.resolution_notes,
      citizenRating: row.citizen_rating,
      citizenFeedback: row.citizen_feedback,
      estimatedResolutionDays: row.estimated_resolution_days,
      isEscalated: row.is_escalated,
      escalatedAt: row.escalated_at,
      sentimentScore: row.sentiment_score ? parseFloat(row.sentiment_score) : undefined,
      urgencyScore: row.urgency_score ? parseFloat(row.urgency_score) : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Convert camelCase to snake_case
   */
  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}

export const complaintRepository = new ComplaintRepository();
