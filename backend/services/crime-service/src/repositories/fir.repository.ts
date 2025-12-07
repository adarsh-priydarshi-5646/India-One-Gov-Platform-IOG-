import { db } from '../config/database';
import { FIR, FIRStatus, CasePriority, SearchFilters, CrimeType } from '../types';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export class FIRRepository {
  /**
   * Create FIR
   */
  async create(fir: Partial<FIR>): Promise<FIR> {
    try {
      // Generate FIR number: FIR/STATE/DISTRICT/YEAR/SEQUENCE
      const firNumber = await this.generateFIRNumber(fir.state!, fir.district!);

      const result = await db.query(
        `INSERT INTO firs (
          fir_number, reported_by, reporter_name, reporter_contact,
          crime_type, description, incident_date, incident_time,
          location_lat, location_lng, address, state, district, police_station,
          status, priority, is_anonymous, evidence_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *`,
        [
          firNumber,
          fir.reportedBy || 'ANONYMOUS',
          fir.reporterName || 'Anonymous',
          fir.reporterContact || '',
          fir.crimeType,
          fir.description,
          fir.incidentDate,
          fir.incidentTime || null,
          fir.locationLat,
          fir.locationLng,
          fir.address,
          fir.state,
          fir.district,
          fir.policeStation,
          FIRStatus.REGISTERED,
          fir.priority || CasePriority.MEDIUM,
          fir.isAnonymous || false,
          0,
        ]
      );

      return this.mapRowToFIR(result.rows[0]);
    } catch (error) {
      logger.error('Failed to create FIR', error);
      throw error;
    }
  }

  /**
   * Find FIR by ID
   */
  async findById(id: string): Promise<FIR | null> {
    const result = await db.query('SELECT * FROM firs WHERE id = $1', [id]);
    return result.rows.length > 0 ? this.mapRowToFIR(result.rows[0]) : null;
  }

  /**
   * Find FIR by FIR number
   */
  async findByFIRNumber(firNumber: string): Promise<FIR | null> {
    const result = await db.query('SELECT * FROM firs WHERE fir_number = $1', [firNumber]);
    return result.rows.length > 0 ? this.mapRowToFIR(result.rows[0]) : null;
  }

  /**
   * Search FIRs
   */
  async search(filters: SearchFilters): Promise<{ data: FIR[]; total: number }> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.crimeType && filters.crimeType.length > 0) {
      conditions.push(`crime_type = ANY($${paramIndex})`);
      params.push(filters.crimeType);
      paramIndex++;
    }

    if (filters.status && filters.status.length > 0) {
      conditions.push(`status = ANY($${paramIndex})`);
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.priority && filters.priority.length > 0) {
      conditions.push(`priority = ANY($${paramIndex})`);
      params.push(filters.priority);
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

    if (filters.dateFrom) {
      conditions.push(`incident_date >= $${paramIndex}`);
      params.push(filters.dateFrom);
      paramIndex++;
    }

    if (filters.dateTo) {
      conditions.push(`incident_date <= $${paramIndex}`);
      params.push(filters.dateTo);
      paramIndex++;
    }

    if (filters.searchQuery) {
      conditions.push(`(fir_number ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${filters.searchQuery}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total
    const countResult = await db.query(`SELECT COUNT(*) as total FROM firs ${whereClause}`, params);
    const total = parseInt(countResult.rows[0].total, 10);

    // Fetch data
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const dataQuery = `
      SELECT * FROM firs 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const dataResult = await db.query(dataQuery, params);
    const data = dataResult.rows.map(this.mapRowToFIR);

    return { data, total };
  }

  /**
   * Update FIR
   */
  async update(id: string, updates: Partial<FIR>): Promise<FIR> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'firNumber') {
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
      `UPDATE firs SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('FIR not found');
    }

    return this.mapRowToFIR(result.rows[0]);
  }

  /**
   * Assign investigating officer
   */
  async assignOfficer(id: string, officerId: string): Promise<FIR> {
    return await this.update(id, {
      investigatingOfficerId: officerId,
      status: FIRStatus.UNDER_INVESTIGATION,
    });
  }

  /**
   * Get statistics
   */
  async getStatistics(filters: Partial<SearchFilters> = {}): Promise<any> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

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
        COUNT(*) FILTER (WHERE status = 'REGISTERED') as registered,
        COUNT(*) FILTER (WHERE status = 'UNDER_INVESTIGATION') as under_investigation,
        COUNT(*) FILTER (WHERE status = 'CHARGE_SHEET_FILED') as charge_sheet_filed,
        COUNT(*) FILTER (WHERE status = 'TRIAL') as trial,
        COUNT(*) FILTER (WHERE status = 'CLOSED') as closed
       FROM firs ${whereClause}`,
      params
    );

    // Get crime type distribution
    const typeResult = await db.query(
      `SELECT crime_type, COUNT(*) as count FROM firs ${whereClause} GROUP BY crime_type`,
      params
    );

    const byType: Record<string, number> = {};
    typeResult.rows.forEach((row) => {
      byType[row.crime_type] = parseInt(row.count, 10);
    });

    // Get priority distribution
    const priorityResult = await db.query(
      `SELECT priority, COUNT(*) as count FROM firs ${whereClause} GROUP BY priority`,
      params
    );

    const byPriority: Record<string, number> = {};
    priorityResult.rows.forEach((row) => {
      byPriority[row.priority] = parseInt(row.count, 10);
    });

    return {
      ...result.rows[0],
      byType,
      byPriority,
    };
  }

  /**
   * Generate FIR number
   */
  private async generateFIRNumber(state: string, district: string): Promise<string> {
    const year = new Date().getFullYear();
    const stateCode = state.substring(0, 2).toUpperCase();
    const districtCode = district.substring(0, 3).toUpperCase();

    // Get sequence number
    const result = await db.query(
      `SELECT COUNT(*) + 1 as sequence FROM firs WHERE state = $1 AND district = $2 AND EXTRACT(YEAR FROM created_at) = $3`,
      [state, district, year]
    );

    const sequence = result.rows[0].sequence.toString().padStart(6, '0');

    return `FIR/${stateCode}/${districtCode}/${year}/${sequence}`;
  }

  /**
   * Map database row to FIR object
   */
  private mapRowToFIR(row: any): FIR {
    return {
      id: row.id,
      firNumber: row.fir_number,
      reportedBy: row.reported_by,
      reporterName: row.reporter_name,
      reporterContact: row.reporter_contact,
      crimeType: row.crime_type as CrimeType,
      description: row.description,
      incidentDate: row.incident_date,
      incidentTime: row.incident_time,
      locationLat: parseFloat(row.location_lat),
      locationLng: parseFloat(row.location_lng),
      address: row.address,
      state: row.state,
      district: row.district,
      policeStation: row.police_station,
      status: row.status as FIRStatus,
      priority: row.priority as CasePriority,
      assignedOfficer: row.assigned_officer,
      investigatingOfficerId: row.investigating_officer_id,
      suspects: row.suspects ? JSON.parse(row.suspects) : [],
      victims: row.victims ? JSON.parse(row.victims) : [],
      witnesses: row.witnesses ? JSON.parse(row.witnesses) : [],
      isAnonymous: row.is_anonymous,
      evidenceCount: row.evidence_count,
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

export const firRepository = new FIRRepository();
