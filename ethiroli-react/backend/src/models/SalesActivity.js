import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class SalesActivity {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      duration_minutes: parseInt(row.duration_minutes || 0, 10),
      performed_by_name: row.performed_by_name ? decrypt(row.performed_by_name) : (row.performed_by_email || 'Staff'),
      lead_company: row.lead_company || null,
      lead_name: row.lead_first_name ? `${decrypt(row.lead_first_name)} ${row.lead_last_name ? decrypt(row.lead_last_name) : ''}`.trim() : null,
      deal_title: row.deal_title || null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT a.*, 
              u.full_name as performed_by_name, u.email as performed_by_email,
              l.company_name as lead_company, l.first_name as lead_first_name, l.last_name as lead_last_name,
              d.title as deal_title
       FROM sales_activities a
       LEFT JOIN users u ON a.performed_by = u.id
       LEFT JOIN leads l ON a.lead_id = l.id
       LEFT JOIN sales_deals d ON a.deal_id = d.id
       WHERE a.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async list({ activity_type, deal_id, lead_id, performed_by, start_date, end_date, outcome, page = 1, limit = 50 } = {}) {
    let sql = `
      SELECT a.*, 
             u.full_name as performed_by_name, u.email as performed_by_email,
             l.company_name as lead_company, l.first_name as lead_first_name, l.last_name as lead_last_name,
             d.title as deal_title
      FROM sales_activities a
      LEFT JOIN users u ON a.performed_by = u.id
      LEFT JOIN leads l ON a.lead_id = l.id
      LEFT JOIN sales_deals d ON a.deal_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (activity_type) {
      if (Array.isArray(activity_type)) {
        sql += ` AND a.activity_type IN (${activity_type.map(() => '?').join(',')})`;
        params.push(...activity_type);
      } else {
        sql += ' AND a.activity_type = ?';
        params.push(activity_type);
      }
    }
    if (deal_id) {
      sql += ' AND a.deal_id = ?';
      params.push(deal_id);
    }
    if (lead_id) {
      sql += ' AND a.lead_id = ?';
      params.push(lead_id);
    }
    if (performed_by) {
      sql += ' AND a.performed_by = ?';
      params.push(performed_by);
    }
    if (outcome) {
      sql += ' AND a.outcome = ?';
      params.push(outcome);
    }
    if (start_date) {
      sql += ' AND a.scheduled_at >= ?';
      params.push(start_date);
    }
    if (end_date) {
      sql += ' AND a.scheduled_at <= ?';
      params.push(end_date);
    }

    sql += ' ORDER BY a.scheduled_at DESC LIMIT ? OFFSET ?';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(sql, params);
    return rows.map(r => this.format(r));
  }

  static async count({ activity_type, deal_id, lead_id, performed_by, start_date, end_date, outcome } = {}) {
    let sql = `SELECT COUNT(*) as count FROM sales_activities a WHERE 1=1`;
    const params = [];

    if (activity_type) {
      if (Array.isArray(activity_type)) {
        sql += ` AND a.activity_type IN (${activity_type.map(() => '?').join(',')})`;
        params.push(...activity_type);
      } else {
        sql += ' AND a.activity_type = ?';
        params.push(activity_type);
      }
    }
    if (deal_id) {
      sql += ' AND a.deal_id = ?';
      params.push(deal_id);
    }
    if (lead_id) {
      sql += ' AND a.lead_id = ?';
      params.push(lead_id);
    }
    if (performed_by) {
      sql += ' AND a.performed_by = ?';
      params.push(performed_by);
    }
    if (outcome) {
      sql += ' AND a.outcome = ?';
      params.push(outcome);
    }
    if (start_date) {
      sql += ' AND a.scheduled_at >= ?';
      params.push(start_date);
    }
    if (end_date) {
      sql += ' AND a.scheduled_at <= ?';
      params.push(end_date);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0]?.count || 0;
  }

  static async create(data) {
    const id = data.id || crypto.randomUUID();
    await pool.execute(
      `INSERT INTO sales_activities 
        (id, activity_type, lead_id, deal_id, title, description, outcome, 
         duration_minutes, scheduled_at, completed_at, meeting_link, performed_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.activity_type,
        data.lead_id || null,
        data.deal_id || null,
        data.title,
        data.description || null,
        data.outcome || 'COMPLETED',
        parseInt(data.duration_minutes || 15, 10),
        data.scheduled_at,
        data.completed_at || null,
        data.meeting_link || null,
        data.performed_by
      ]
    );
    return this.findById(id);
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    const allowed = ['activity_type', 'lead_id', 'deal_id', 'title', 'description', 'outcome', 'duration_minutes', 'scheduled_at', 'completed_at', 'meeting_link'];

    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await pool.execute(`UPDATE sales_activities SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async getUpcoming({ performed_by, limit = 10 } = {}) {
    let sql = `
      SELECT a.*, 
             u.full_name as performed_by_name, u.email as performed_by_email,
             l.company_name as lead_company,
             d.title as deal_title
      FROM sales_activities a
      LEFT JOIN users u ON a.performed_by = u.id
      LEFT JOIN leads l ON a.lead_id = l.id
      LEFT JOIN sales_deals d ON a.deal_id = d.id
      WHERE a.scheduled_at >= NOW()
    `;
    const params = [];
    if (performed_by) {
      sql += ' AND a.performed_by = ?';
      params.push(performed_by);
    }
    sql += ' ORDER BY a.scheduled_at ASC LIMIT ?';
    params.push(parseInt(limit));

    const [rows] = await pool.query(sql, params);
    return rows.map(r => this.format(r));
  }

  static async delete(id) {
    const [res] = await pool.execute('DELETE FROM sales_activities WHERE id = ?', [id]);
    return res.affectedRows > 0;
  }
}
