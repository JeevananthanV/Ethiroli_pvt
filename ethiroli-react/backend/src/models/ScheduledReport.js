import crypto from 'crypto';
import pool from '../config/database.js';

export default class ScheduledReport {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      recipient_emails: row.recipient_emails ? JSON.parse(row.recipient_emails) : null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM scheduled_reports WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ report_definition_id, tenant_id, frequency, format = 'PDF', recipient_emails, next_send_at, is_active = true }) {
    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO scheduled_reports (id, report_definition_id, tenant_id, frequency, format, recipient_emails, next_send_at, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, report_definition_id, tenant_id, frequency, format, JSON.stringify(recipient_emails), next_send_at, is_active]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.frequency !== undefined) { queryParts.push('frequency = ?'); values.push(updates.frequency); }
    if (updates.format !== undefined) { queryParts.push('format = ?'); values.push(updates.format); }
    if (updates.recipient_emails !== undefined) { queryParts.push('recipient_emails = ?'); values.push(JSON.stringify(updates.recipient_emails)); }
    if (updates.last_sent_at !== undefined) { queryParts.push('last_sent_at = ?'); values.push(updates.last_sent_at); }
    if (updates.next_send_at !== undefined) { queryParts.push('next_send_at = ?'); values.push(updates.next_send_at); }
    if (updates.is_active !== undefined) { queryParts.push('is_active = ?'); values.push(updates.is_active); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE scheduled_reports SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM scheduled_reports WHERE id = ?', [id]);
  }

  static async list({ tenant_id, report_definition_id, is_active, status, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM scheduled_reports WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (report_definition_id) { query += ' AND report_definition_id = ?'; values.push(report_definition_id); }
    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    query += ' ORDER BY next_send_at ASC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ tenant_id, report_definition_id, is_active } = {}) {
    let query = 'SELECT COUNT(*) as total FROM scheduled_reports WHERE 1=1';
    const values = [];

    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }
    if (report_definition_id) { query += ' AND report_definition_id = ?'; values.push(report_definition_id); }
    if (is_active !== undefined) { query += ' AND is_active = ?'; values.push(is_active); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
