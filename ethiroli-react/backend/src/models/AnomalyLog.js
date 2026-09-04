import pool from '../config/database.js';

export default class AnomalyLog {
  static async create({ tenant_id, user_id = null, anomaly_type, severity = 'MEDIUM', details }) {
    const [result] = await pool.execute(
      `INSERT INTO anomaly_logs (tenant_id, user_id, anomaly_type, severity, details)
       VALUES (?, ?, ?, ?, ?)`,
      [tenant_id, user_id, anomaly_type, severity, JSON.stringify(details)]
    );
    return result.insertId;
  }

  static async list({ tenant_id } = {}) {
    let query = 'SELECT * FROM anomaly_logs';
    const values = [];

    if (tenant_id) {
      query += ' WHERE tenant_id = ?';
      values.push(tenant_id);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}