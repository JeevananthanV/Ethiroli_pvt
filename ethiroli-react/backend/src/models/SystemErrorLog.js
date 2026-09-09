import pool from '../config/database.js';

export default class SystemErrorLog {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      request_payload: row.request_payload ? JSON.parse(row.request_payload) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM system_error_logs WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ service_name, error_type, message, stack_trace = null, endpoint = null, method = null, status_code = null, request_payload = null, ip_address = null, user_id = null }) {
    const [result] = await pool.execute(
      `INSERT INTO system_error_logs (service_name, error_type, message, stack_trace, endpoint, method, status_code, request_payload, ip_address, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [service_name, error_type, message, stack_trace, endpoint, method, status_code, request_payload ? JSON.stringify(request_payload) : null, ip_address, user_id]
    );
    return result.insertId;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.is_resolved !== undefined) { queryParts.push('is_resolved = ?'); values.push(updates.is_resolved); }
    if (updates.resolution_notes !== undefined) { queryParts.push('resolution_notes = ?'); values.push(updates.resolution_notes); }
    if (updates.resolved_by !== undefined) { queryParts.push('resolved_by = ?'); values.push(updates.resolved_by); }
    if (updates.resolved_at !== undefined) { queryParts.push('resolved_at = ?'); values.push(updates.resolved_at); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE system_error_logs SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM system_error_logs WHERE id = ?', [id]);
  }

  static async list({ service_name, error_type, is_resolved, severity, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM system_error_logs WHERE 1=1';
    const values = [];

    if (service_name) { query += ' AND service_name = ?'; values.push(service_name); }
    if (error_type) { query += ' AND error_type = ?'; values.push(error_type); }
    if (is_resolved !== undefined) { query += ' AND is_resolved = ?'; values.push(is_resolved); }
    if (severity) { query += ' AND severity = ?'; values.push(severity); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ service_name, error_type, is_resolved, severity } = {}) {
    let query = 'SELECT COUNT(*) as total FROM system_error_logs WHERE 1=1';
    const values = [];

    if (service_name) { query += ' AND service_name = ?'; values.push(service_name); }
    if (error_type) { query += ' AND error_type = ?'; values.push(error_type); }
    if (is_resolved !== undefined) { query += ' AND is_resolved = ?'; values.push(is_resolved); }
    if (severity) { query += ' AND severity = ?'; values.push(severity); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  static async resolve(id, notes, resolved_by) {
    await pool.execute(
      'UPDATE system_error_logs SET is_resolved = TRUE, resolved_at = CURRENT_TIMESTAMP, resolution_notes = ?, resolved_by = ? WHERE id = ?',
      [notes, resolved_by, id]
    );
  }
}
