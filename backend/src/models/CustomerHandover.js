import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class CustomerHandover {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      assigned_person_name: row.assigned_person_name ? decrypt(row.assigned_person_name) : (row.assigned_person_email || null),
      handover_by_name: row.handover_by_name ? decrypt(row.handover_by_name) : (row.handover_by_email || 'Sales Rep'),
      deal_title: row.deal_title || null,
      deal_value: parseFloat(row.deal_value || 0),
      client_name: row.client_name || null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT h.*, 
              u1.full_name as assigned_person_name, u1.email as assigned_person_email,
              u2.full_name as handover_by_name, u2.email as handover_by_email,
              d.title as deal_title, d.deal_value,
              c.company_name as client_name
       FROM customer_handovers h
       LEFT JOIN users u1 ON h.assigned_person_id = u1.id
       LEFT JOIN users u2 ON h.handover_by = u2.id
       LEFT JOIN sales_deals d ON h.deal_id = d.id
       LEFT JOIN clients c ON h.client_id = c.id
       WHERE h.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async list({ status, handover_to, assigned_person_id, client_id, deal_id, page = 1, limit = 50 } = {}) {
    let sql = `
      SELECT h.*, 
             u1.full_name as assigned_person_name, u1.email as assigned_person_email,
             u2.full_name as handover_by_name, u2.email as handover_by_email,
             d.title as deal_title, d.deal_value,
             c.company_name as client_name
      FROM customer_handovers h
      LEFT JOIN users u1 ON h.assigned_person_id = u1.id
      LEFT JOIN users u2 ON h.handover_by = u2.id
      LEFT JOIN sales_deals d ON h.deal_id = d.id
      LEFT JOIN clients c ON h.client_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND h.status = ?';
      params.push(status);
    }
    if (handover_to) {
      sql += ' AND h.handover_to = ?';
      params.push(handover_to);
    }
    if (assigned_person_id) {
      sql += ' AND h.assigned_person_id = ?';
      params.push(assigned_person_id);
    }
    if (client_id) {
      sql += ' AND h.client_id = ?';
      params.push(client_id);
    }
    if (deal_id) {
      sql += ' AND h.deal_id = ?';
      params.push(deal_id);
    }

    sql += ' ORDER BY h.created_at DESC LIMIT ? OFFSET ?';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(sql, params);
    return rows.map(r => this.format(r));
  }

  static async count({ status, handover_to, assigned_person_id, client_id, deal_id } = {}) {
    let sql = `SELECT COUNT(*) as count FROM customer_handovers h WHERE 1=1`;
    const params = [];

    if (status) {
      sql += ' AND h.status = ?';
      params.push(status);
    }
    if (handover_to) {
      sql += ' AND h.handover_to = ?';
      params.push(handover_to);
    }
    if (assigned_person_id) {
      sql += ' AND h.assigned_person_id = ?';
      params.push(assigned_person_id);
    }
    if (client_id) {
      sql += ' AND h.client_id = ?';
      params.push(client_id);
    }
    if (deal_id) {
      sql += ' AND h.deal_id = ?';
      params.push(deal_id);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0]?.count || 0;
  }

  static async create(data) {
    const id = data.id || crypto.randomUUID();
    await pool.execute(
      `INSERT INTO customer_handovers 
        (id, deal_id, client_id, handover_to, assigned_person_id, scope_summary, kickoff_date, status, handover_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.deal_id,
        data.client_id,
        data.handover_to,
        data.assigned_person_id || null,
        data.scope_summary,
        data.kickoff_date,
        data.status || 'PENDING',
        data.handover_by
      ]
    );

    return this.findById(id);
  }

  static async updateStatus(id, status, assigned_person_id = undefined) {
    let sql = 'UPDATE customer_handovers SET status = ?';
    const params = [status];

    if (assigned_person_id !== undefined) {
      sql += ', assigned_person_id = ?';
      params.push(assigned_person_id);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    await pool.execute(sql, params);
    return this.findById(id);
  }

  static async delete(id) {
    const [res] = await pool.execute('DELETE FROM customer_handovers WHERE id = ?', [id]);
    return res.affectedRows > 0;
  }
}
