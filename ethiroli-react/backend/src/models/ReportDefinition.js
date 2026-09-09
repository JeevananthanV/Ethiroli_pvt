import crypto from 'crypto';
import pool from '../config/database.js';

export default class ReportDefinition {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      dimensions: row.dimensions ? JSON.parse(row.dimensions) : null,
      metrics: row.metrics ? JSON.parse(row.metrics) : null,
      filters: row.filters ? JSON.parse(row.filters) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM report_definitions WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ tenant_id, name, description = null, dimensions, metrics, filters = null, chart_type = 'TABLE', created_by }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO report_definitions (id, tenant_id, name, description, dimensions, metrics, filters, chart_type, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tenant_id, name, description, JSON.stringify(dimensions), JSON.stringify(metrics), filters ? JSON.stringify(filters) : null, chart_type, created_by]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.name !== undefined) { queryParts.push('name = ?'); values.push(updates.name); }
    if (updates.description !== undefined) { queryParts.push('description = ?'); values.push(updates.description); }
    if (updates.dimensions !== undefined) { queryParts.push('dimensions = ?'); values.push(JSON.stringify(updates.dimensions)); }
    if (updates.metrics !== undefined) { queryParts.push('metrics = ?'); values.push(JSON.stringify(updates.metrics)); }
    if (updates.filters !== undefined) { queryParts.push('filters = ?'); values.push(updates.filters ? JSON.stringify(updates.filters) : null); }
    if (updates.chart_type !== undefined) { queryParts.push('chart_type = ?'); values.push(updates.chart_type); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE report_definitions SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM report_definitions WHERE id = ?', [id]);
  }

  static async list({ tenant_id, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM report_definitions WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ tenant_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM report_definitions WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
