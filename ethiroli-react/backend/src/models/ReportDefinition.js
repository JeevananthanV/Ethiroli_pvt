import crypto from 'crypto';
import pool from '../config/database.js';

export default class ReportDefinition {
  static async create({ tenant_id, name, description = null, dimensions, metrics, filters = null, chart_type = 'TABLE', created_by }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO report_definitions (id, tenant_id, name, description, dimensions, metrics, filters, chart_type, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tenant_id, name, description, JSON.stringify(dimensions), JSON.stringify(metrics), filters ? JSON.stringify(filters) : null, chart_type, created_by]
    );
    return id;
  }

  static async list({ tenant_id } = {}) {
    let query = 'SELECT * FROM report_definitions';
    const values = [];

    if (tenant_id) {
      query += ' WHERE tenant_id = ?';
      values.push(tenant_id);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}