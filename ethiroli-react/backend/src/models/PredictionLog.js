import crypto from 'crypto';
import pool from '../config/database.js';

export default class PredictionLog {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      features: row.features ? JSON.parse(row.features) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM prediction_logs WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ tenant_id, entity_type, entity_id, prediction_type, score, confidence, features, explanation = null, model_version = null }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO prediction_logs (id, tenant_id, entity_type, entity_id, prediction_type, score, confidence, features, explanation, model_version)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tenant_id, entity_type, entity_id, prediction_type, score, confidence, JSON.stringify(features), explanation, model_version]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.score !== undefined) { queryParts.push('score = ?'); values.push(updates.score); }
    if (updates.confidence !== undefined) { queryParts.push('confidence = ?'); values.push(updates.confidence); }
    if (updates.features !== undefined) { queryParts.push('features = ?'); values.push(JSON.stringify(updates.features)); }
    if (updates.explanation !== undefined) { queryParts.push('explanation = ?'); values.push(updates.explanation); }
    if (updates.model_version !== undefined) { queryParts.push('model_version = ?'); values.push(updates.model_version); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE prediction_logs SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM prediction_logs WHERE id = ?', [id]);
  }

  static async list({ tenant_id, entity_type, prediction_type, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM prediction_logs WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (entity_type) { query += ' AND entity_type = ?'; values.push(entity_type); }
    if (prediction_type) { query += ' AND prediction_type = ?'; values.push(prediction_type); }

    query += ' ORDER BY predicted_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ tenant_id, entity_type, prediction_type } = {}) {
    let query = 'SELECT COUNT(*) as total FROM prediction_logs WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (entity_type) { query += ' AND entity_type = ?'; values.push(entity_type); }
    if (prediction_type) { query += ' AND prediction_type = ?'; values.push(prediction_type); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
