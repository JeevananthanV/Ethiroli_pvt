import crypto from 'crypto';
import pool from '../config/database.js';

export default class AutomationWorkflow {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      trigger_config: row.trigger_config ? JSON.parse(row.trigger_config) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM automation_workflows WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ tenant_id, name, description = null, trigger_type, trigger_config, is_active = true, created_by }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO automation_workflows (id, tenant_id, name, description, trigger_type, trigger_config, is_active, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tenant_id, name, description, trigger_type, JSON.stringify(trigger_config), is_active, created_by]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.name !== undefined) { queryParts.push('name = ?'); values.push(updates.name); }
    if (updates.description !== undefined) { queryParts.push('description = ?'); values.push(updates.description); }
    if (updates.trigger_type !== undefined) { queryParts.push('trigger_type = ?'); values.push(updates.trigger_type); }
    if (updates.trigger_config !== undefined) { queryParts.push('trigger_config = ?'); values.push(JSON.stringify(updates.trigger_config)); }
    if (updates.is_active !== undefined) { queryParts.push('is_active = ?'); values.push(updates.is_active); }
    if (updates.execution_count !== undefined) { queryParts.push('execution_count = ?'); values.push(updates.execution_count); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE automation_workflows SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM automation_workflows WHERE id = ?', [id]);
  }

  static async list({ tenant_id, is_active, status, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM automation_workflows WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ tenant_id, is_active } = {}) {
    let query = 'SELECT COUNT(*) as total FROM automation_workflows WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
