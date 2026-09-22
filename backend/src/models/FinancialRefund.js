import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class FinancialRefund {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      customer_name: row.customer_name || 'Customer',
      customer_email: row.customer_email || null,
      processor_name: row.processor_name ? decrypt(row.processor_name) : null,
      amount: parseFloat(row.amount || 0)
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT r.*, 
              u.full_name as processor_name,
              i.invoice_number
       FROM financial_refunds r
       LEFT JOIN users u ON r.processed_by = u.id
       LEFT JOIN invoices i ON r.invoice_id = i.id
       WHERE r.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async list({ status, invoice_id, page = 1, limit = 50 } = {}) {
    let sql = `
      SELECT r.*, 
             u.full_name as processor_name,
             i.invoice_number
      FROM financial_refunds r
      LEFT JOIN users u ON r.processed_by = u.id
      LEFT JOIN invoices i ON r.invoice_id = i.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND r.status = ?';
      params.push(status);
    }
    if (invoice_id) {
      sql += ' AND r.invoice_id = ?';
      params.push(invoice_id);
    }

    sql += ' ORDER BY r.requested_at DESC LIMIT ? OFFSET ?';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(sql, params);
    return rows.map(r => this.format(r));
  }

  static async count({ status, invoice_id } = {}) {
    let sql = 'SELECT COUNT(*) as total FROM financial_refunds WHERE 1=1';
    const params = [];
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (invoice_id) {
      sql += ' AND invoice_id = ?';
      params.push(invoice_id);
    }
    const [rows] = await pool.query(sql, params);
    return rows[0]?.total || 0;
  }

  static async create({
    id = crypto.randomUUID(),
    invoice_id = null,
    payment_id = null,
    customer_name,
    customer_email = null,
    amount,
    currency = 'INR',
    reason,
    status = 'PENDING',
    notes = null
  }) {
    await pool.execute(
      `INSERT INTO financial_refunds
       (id, invoice_id, payment_id, customer_name, customer_email, amount, currency, reason, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, invoice_id, payment_id, customer_name, customer_email, amount, currency, reason, status, notes]
    );
    return { id, status };
  }

  static async processRefund(id, { processed_by, utr_number, gateway_refund_id = null, notes = null }) {
    await pool.execute(
      `UPDATE financial_refunds
       SET status = 'PROCESSED',
           processed_by = ?,
           processed_at = NOW(),
           utr_number = ?,
           gateway_refund_id = ?,
           notes = COALESCE(?, notes)
       WHERE id = ?`,
      [processed_by, utr_number, gateway_refund_id, notes, id]
    );
    return this.findById(id);
  }

  static async updateStatus(id, status, { processed_by = null, notes = null } = {}) {
    await pool.execute(
      `UPDATE financial_refunds
       SET status = ?,
           processed_by = COALESCE(?, processed_by),
           notes = COALESCE(?, notes)
       WHERE id = ?`,
      [status, processed_by, notes, id]
    );
    return this.findById(id);
  }
}
