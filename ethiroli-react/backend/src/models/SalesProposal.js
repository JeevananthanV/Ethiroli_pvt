import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class SalesProposal {
  static format(row) {
    if (!row) return null;
    let deliverables = [];
    if (row.deliverables) {
      if (typeof row.deliverables === 'string') {
        try {
          deliverables = JSON.parse(row.deliverables);
        } catch (e) {
          deliverables = [];
        }
      } else {
        deliverables = row.deliverables;
      }
    }

    return {
      ...row,
      total_amount: parseFloat(row.total_amount || 0),
      discount_percentage: parseFloat(row.discount_percentage || 0),
      deliverables,
      created_by_name: row.created_by_name ? decrypt(row.created_by_name) : (row.created_by_email || 'Staff'),
      deal_title: row.deal_title || null,
      client_name: row.client_name || null
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT p.*, 
              u.full_name as created_by_name, u.email as created_by_email,
              d.title as deal_title,
              c.company_name as client_name
       FROM sales_proposals p
       LEFT JOIN users u ON p.created_by = u.id
       LEFT JOIN sales_deals d ON p.deal_id = d.id
       LEFT JOIN clients c ON p.client_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByProposalNumber(propNum) {
    const [rows] = await pool.execute(
      `SELECT p.*, 
              u.full_name as created_by_name, u.email as created_by_email,
              d.title as deal_title,
              c.company_name as client_name
       FROM sales_proposals p
       LEFT JOIN users u ON p.created_by = u.id
       LEFT JOIN sales_deals d ON p.deal_id = d.id
       LEFT JOIN clients c ON p.client_id = c.id
       WHERE p.proposal_number = ?`,
      [propNum]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async list({ status, deal_id, client_id, created_by, page = 1, limit = 50 } = {}) {
    let sql = `
      SELECT p.*, 
             u.full_name as created_by_name, u.email as created_by_email,
             d.title as deal_title,
             c.company_name as client_name
      FROM sales_proposals p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN sales_deals d ON p.deal_id = d.id
      LEFT JOIN clients c ON p.client_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND p.status = ?';
      params.push(status);
    }
    if (deal_id) {
      sql += ' AND p.deal_id = ?';
      params.push(deal_id);
    }
    if (client_id) {
      sql += ' AND p.client_id = ?';
      params.push(client_id);
    }
    if (created_by) {
      sql += ' AND p.created_by = ?';
      params.push(created_by);
    }

    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(sql, params);
    return rows.map(r => this.format(r));
  }

  static async count({ status, deal_id, client_id, created_by } = {}) {
    let sql = `SELECT COUNT(*) as count FROM sales_proposals p WHERE 1=1`;
    const params = [];

    if (status) {
      sql += ' AND p.status = ?';
      params.push(status);
    }
    if (deal_id) {
      sql += ' AND p.deal_id = ?';
      params.push(deal_id);
    }
    if (client_id) {
      sql += ' AND p.client_id = ?';
      params.push(client_id);
    }
    if (created_by) {
      sql += ' AND p.created_by = ?';
      params.push(created_by);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0]?.count || 0;
  }

  static async create(data) {
    const id = data.id || crypto.randomUUID();
    const proposalNumber = data.proposal_number || `PROP-${Date.now().toString().slice(-6)}`;
    const deliverables = data.deliverables ? (typeof data.deliverables === 'string' ? data.deliverables : JSON.stringify(data.deliverables)) : '[]';

    await pool.execute(
      `INSERT INTO sales_proposals 
        (id, proposal_number, deal_id, client_id, title, total_amount, 
         discount_percentage, valid_until, status, deliverables, pdf_url, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        proposalNumber,
        data.deal_id || null,
        data.client_id || null,
        data.title,
        parseFloat(data.total_amount || 0),
        parseFloat(data.discount_percentage || 0),
        data.valid_until,
        data.status || 'DRAFT',
        deliverables,
        data.pdf_url || null,
        data.created_by
      ]
    );

    return this.findById(id);
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    const allowed = ['title', 'deal_id', 'client_id', 'total_amount', 'discount_percentage', 'valid_until', 'status', 'deliverables', 'pdf_url'];

    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        if (key === 'deliverables' && typeof data[key] !== 'string') {
          values.push(JSON.stringify(data[key]));
        } else {
          values.push(data[key]);
        }
      }
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await pool.execute(`UPDATE sales_proposals SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async updateStatus(id, status) {
    await pool.execute('UPDATE sales_proposals SET status = ? WHERE id = ?', [status, id]);
    return this.findById(id);
  }

  static async delete(id) {
    const [res] = await pool.execute('DELETE FROM sales_proposals WHERE id = ?', [id]);
    return res.affectedRows > 0;
  }
}
