import crypto from 'crypto';
import pool from '../config/database.js';

export default class PredictionLog {
  static async create({ tenant_id, entity_type, entity_id, prediction_type, score, confidence, features }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO prediction_logs (id, tenant_id, entity_type, entity_id, prediction_type, score, confidence, features)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tenant_id, entity_type, entity_id, prediction_type, score, confidence, JSON.stringify(features)]
    );
    return id;
  }

  static async list({ tenant_id } = {}) {
    let query = 'SELECT * FROM prediction_logs';
    const values = [];

    if (tenant_id) {
      query += ' WHERE tenant_id = ?';
      values.push(tenant_id);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }
}