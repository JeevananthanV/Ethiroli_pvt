import crypto from 'crypto';
import pool from '../config/database.js';

export default class ApprovalInstance {
  static async create({ workflow_id, entity_id, initiated_by }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO approval_instances (id, workflow_id, entity_id, initiated_by)
       VALUES (?, ?, ?, ?)`,
      [id, workflow_id, entity_id, initiated_by]
    );
    return id;
  }

  static async updateStatus(id, status, decisions = null) {
    await pool.execute(
      'UPDATE approval_instances SET status = ?, decisions = ? WHERE id = ?',
      [status, decisions ? JSON.stringify(decisions) : null, id]
    );
  }

  static async listPending(userId) {
    const [rows] = await pool.execute(
      `SELECT ai.*, w.name as workflow_name 
       FROM approval_instances ai
       JOIN workflows w ON ai.workflow_id = w.id
       WHERE ai.status = 'PENDING'`
    );
    return rows;
  }
}