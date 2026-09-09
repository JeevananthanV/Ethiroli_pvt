import pool from '../config/database.js';

export default class AnomalyLog {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      details: row.details ? JSON.parse(row.details) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM anomaly_logs WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ tenant_id, user_id = null, anomaly_type, severity = 'MEDIUM', details, is_resolved = false }) {
    const [result] = await pool.execute(
      `INSERT INTO anomaly_logs (tenant_id, user_id, anomaly_type, severity, details, is_resolved)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tenant_id, user_id, anomaly_type, severity, JSON.stringify(details), is_resolved]
    );
    return result.insertId;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.severity !== undefined) { queryParts.push('severity = ?'); values.push(updates.severity); }
    if (updates.is_resolved !== undefined) { queryParts.push('is_resolved = ?'); values.push(updates.is_resolved); }
    if (updates.resolved_at !== undefined) { queryParts.push('resolved_at = ?'); values.push(updates.resolved_at); }
    if (updates.resolved_by !== undefined) { queryParts.push('resolved_by = ?'); values.push(updates.resolved_by); }
    if (updates.details !== undefined) { queryParts.push('details = ?'); values.push(JSON.stringify(updates.details)); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE anomaly_logs SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM anomaly_logs WHERE id = ?', [id]);
  }

  static async list({ tenant_id, anomaly_type, severity, is_resolved, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM anomaly_logs WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (anomaly_type) { query += ' AND anomaly_type = ?'; values.push(anomaly_type); }
    if (severity) { query += ' AND severity = ?'; values.push(severity); }
    if (is_resolved !== undefined) { query += ' AND is_resolved = ?'; values.push(is_resolved); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ tenant_id, anomaly_type, severity, is_resolved } = {}) {
    let query = 'SELECT COUNT(*) as total FROM anomaly_logs WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (anomaly_type) { query += ' AND anomaly_type = ?'; values.push(anomaly_type); }
    if (severity) { query += ' AND severity = ?'; values.push(severity); }
    if (is_resolved !== undefined) { query += ' AND is_resolved = ?'; values.push(is_resolved); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
