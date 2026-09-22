import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class SalesDeal {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      deal_value: parseFloat(row.deal_value || 0),
      probability: parseInt(row.probability || 0, 10),
      owner_name: row.owner_name ? decrypt(row.owner_name) : (row.owner_email || 'Sales Rep'),
      client_name: row.client_name || null,
      lead_company: row.lead_company || null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT d.*, 
              u.full_name as owner_name, u.email as owner_email,
              c.company_name as client_name,
              l.company_name as lead_company
       FROM sales_deals d
       LEFT JOIN users u ON d.owner_id = u.id
       LEFT JOIN clients c ON d.client_id = c.id
       LEFT JOIN leads l ON d.lead_id = l.id
       WHERE d.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async list({ stage, owner_id, client_id, lead_id, search, page = 1, limit = 50 } = {}) {
    let sql = `
      SELECT d.*, 
             u.full_name as owner_name, u.email as owner_email,
             c.company_name as client_name,
             l.company_name as lead_company
      FROM sales_deals d
      LEFT JOIN users u ON d.owner_id = u.id
      LEFT JOIN clients c ON d.client_id = c.id
      LEFT JOIN leads l ON d.lead_id = l.id
      WHERE 1=1
    `;
    const params = [];

    if (stage) {
      sql += ' AND d.stage = ?';
      params.push(stage);
    }
    if (owner_id) {
      sql += ' AND d.owner_id = ?';
      params.push(owner_id);
    }
    if (client_id) {
      sql += ' AND d.client_id = ?';
      params.push(client_id);
    }
    if (lead_id) {
      sql += ' AND d.lead_id = ?';
      params.push(lead_id);
    }
    if (search) {
      sql += ' AND (d.title LIKE ? OR d.contact_name LIKE ? OR d.contact_email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY d.created_at DESC LIMIT ? OFFSET ?';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(sql, params);
    return rows.map(r => this.format(r));
  }

  static async count({ stage, owner_id, client_id, lead_id, search } = {}) {
    let sql = `SELECT COUNT(*) as count FROM sales_deals d WHERE 1=1`;
    const params = [];

    if (stage) {
      sql += ' AND d.stage = ?';
      params.push(stage);
    }
    if (owner_id) {
      sql += ' AND d.owner_id = ?';
      params.push(owner_id);
    }
    if (client_id) {
      sql += ' AND d.client_id = ?';
      params.push(client_id);
    }
    if (lead_id) {
      sql += ' AND d.lead_id = ?';
      params.push(lead_id);
    }
    if (search) {
      sql += ' AND (d.title LIKE ? OR d.contact_name LIKE ? OR d.contact_email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0]?.count || 0;
  }

  static async create(data) {
    const id = data.id || crypto.randomUUID();
    const dealValue = parseFloat(data.deal_value || 0);
    const prob = parseInt(data.probability !== undefined ? data.probability : 20, 10);

    await pool.execute(
      `INSERT INTO sales_deals 
        (id, title, client_id, lead_id, contact_name, contact_email, contact_phone, 
         deal_value, currency, stage, probability, expected_close_date, owner_id, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.title,
        data.client_id || null,
        data.lead_id || null,
        data.contact_name,
        data.contact_email || null,
        data.contact_phone || null,
        dealValue,
        data.currency || 'INR',
        data.stage || 'QUALIFICATION',
        prob,
        data.expected_close_date,
        data.owner_id,
        data.notes || null
      ]
    );

    return this.findById(id);
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    const allowed = [
      'title', 'client_id', 'lead_id', 'contact_name', 'contact_email', 
      'contact_phone', 'deal_value', 'currency', 'stage', 'probability', 
      'expected_close_date', 'actual_close_date', 'loss_reason', 'owner_id', 'notes'
    ];

    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await pool.execute(`UPDATE sales_deals SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async updateStage(id, stage, loss_reason = null) {
    const isClosedWon = stage === 'CLOSED_WON';
    const isClosedLost = stage === 'CLOSED_LOST';
    const probability = isClosedWon ? 100 : (isClosedLost ? 0 : undefined);
    const actualCloseDate = (isClosedWon || isClosedLost) ? new Date().toISOString().slice(0, 10) : null;

    let sql = `UPDATE sales_deals SET stage = ?, actual_close_date = ?, loss_reason = ?`;
    const params = [stage, actualCloseDate, loss_reason];

    if (probability !== undefined) {
      sql += `, probability = ?`;
      params.push(probability);
    }

    sql += ` WHERE id = ?`;
    params.push(id);

    await pool.execute(sql, params);
    return this.findById(id);
  }

  static async getPipelineSummary(owner_id = null) {
    let sql = `
      SELECT stage, 
             COUNT(*) as deal_count, 
             COALESCE(SUM(deal_value), 0) as total_value,
             AVG(probability) as avg_probability
      FROM sales_deals
    `;
    const params = [];
    if (owner_id) {
      sql += ` WHERE owner_id = ?`;
      params.push(owner_id);
    }
    sql += ` GROUP BY stage`;

    const [rows] = await pool.query(sql, params);
    return rows.map(r => ({
      stage: r.stage,
      deal_count: parseInt(r.deal_count, 10),
      total_value: parseFloat(r.total_value),
      avg_probability: Math.round(parseFloat(r.avg_probability || 0))
    }));
  }

  static async delete(id) {
    const [res] = await pool.execute('DELETE FROM sales_deals WHERE id = ?', [id]);
    return res.affectedRows > 0;
  }
}
