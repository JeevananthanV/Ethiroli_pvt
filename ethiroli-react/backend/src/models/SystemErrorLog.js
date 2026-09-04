import pool from '../config/database.js';

export default class SystemErrorLog {
  static async create({ service_name, error_type, message, stack_trace = null, endpoint = null, method = null, status_code = null, request_payload = null, ip_address = null, user_id = null }) {
    const [result] = await pool.execute(
      `INSERT INTO system_error_logs (service_name, error_type, message, stack_trace, endpoint, method, status_code, request_payload, ip_address, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [service_name, error_type, message, stack_trace, endpoint, method, status_code, request_payload ? JSON.stringify(request_payload) : null, ip_address, user_id]
    );
    return result.insertId;
  }

  static async list() {
    const [rows] = await pool.execute('SELECT * FROM system_error_logs ORDER BY created_at DESC');
    return rows;
  }

  static async resolve(id, notes, resolved_by) {
    await pool.execute(
      'UPDATE system_error_logs SET is_resolved = TRUE, resolved_at = CURRENT_TIMESTAMP, resolution_notes = ?, resolved_by = ? WHERE id = ?',
      [notes, resolved_by, id]
    );
  }
}