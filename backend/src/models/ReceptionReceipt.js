import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class ReceptionReceipt {
  static format(row) {
    if (!row) return null;
    return {
      ...row,
      amount: parseFloat(row.amount || 0),
      issuer_name: row.issuer_name ? decrypt(row.issuer_name) : (row.issuer_email || 'Receptionist'),
      course_title: row.course_title || 'General Fee Deposit'
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT r.*, 
              u.full_name as issuer_name, u.email as issuer_email,
              c.name as course_title
       FROM reception_receipts r
       LEFT JOIN users u ON r.issued_by = u.id
       LEFT JOIN courses c ON r.course_id = c.id
       WHERE r.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByReceiptNumber(receiptNumber) {
    const [rows] = await pool.execute(
      `SELECT r.*, 
              u.full_name as issuer_name, u.email as issuer_email,
              c.name as course_title
       FROM reception_receipts r
       LEFT JOIN users u ON r.issued_by = u.id
       LEFT JOIN courses c ON r.course_id = c.id
       WHERE r.receipt_number = ?`,
      [receiptNumber]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async list({ student_id, purpose, payment_mode, page = 1, limit = 50 } = {}) {
    let sql = `
      SELECT r.*, 
             u.full_name as issuer_name, u.email as issuer_email,
             c.name as course_title
      FROM reception_receipts r
      LEFT JOIN users u ON r.issued_by = u.id
      LEFT JOIN courses c ON r.course_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (student_id) {
      sql += ' AND r.student_id = ?';
      params.push(student_id);
    }
    if (purpose) {
      sql += ' AND r.purpose = ?';
      params.push(purpose);
    }
    if (payment_mode) {
      sql += ' AND r.payment_mode = ?';
      params.push(payment_mode);
    }

    sql += ' ORDER BY r.issued_at DESC LIMIT ? OFFSET ?';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(sql, params);
    return rows.map(r => this.format(r));
  }

  static async count({ student_id, purpose, payment_mode } = {}) {
    let sql = `SELECT COUNT(*) as count FROM reception_receipts r WHERE 1=1`;
    const params = [];

    if (student_id) {
      sql += ' AND r.student_id = ?';
      params.push(student_id);
    }
    if (purpose) {
      sql += ' AND r.purpose = ?';
      params.push(purpose);
    }
    if (payment_mode) {
      sql += ' AND r.payment_mode = ?';
      params.push(payment_mode);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0]?.count || 0;
  }

  static async create(data) {
    const id = data.id || crypto.randomUUID();
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const receiptNumber = data.receipt_number || `REC-${datePrefix}-${randSuffix}`;

    await pool.execute(
      `INSERT INTO reception_receipts 
        (id, receipt_number, student_name, student_id, course_id, amount, 
         payment_mode, purpose, issued_by, transaction_reference, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        receiptNumber,
        data.student_name,
        data.student_id || null,
        data.course_id || null,
        parseFloat(data.amount || 0),
        data.payment_mode || 'UPI',
        data.purpose || 'ADMISSION_FEE',
        data.issued_by,
        data.transaction_reference || null,
        data.notes || null
      ]
    );

    return this.findById(id);
  }

  static async getSummaryStats() {
    const [rows] = await pool.query(`
      SELECT 
        COUNT(*) as total_count,
        COALESCE(SUM(amount), 0) as total_collected,
        COUNT(CASE WHEN DATE(issued_at) = CURRENT_DATE THEN 1 END) as today_count,
        COALESCE(SUM(CASE WHEN DATE(issued_at) = CURRENT_DATE THEN amount ELSE 0 END), 0) as today_collected,
        COALESCE(SUM(CASE WHEN payment_mode = 'UPI' THEN amount ELSE 0 END), 0) as upi_total,
        COALESCE(SUM(CASE WHEN payment_mode = 'CASH' THEN amount ELSE 0 END), 0) as cash_total,
        COALESCE(SUM(CASE WHEN payment_mode = 'CARD' THEN amount ELSE 0 END), 0) as card_total
      FROM reception_receipts
    `);

    return {
      total_count: parseInt(rows[0]?.total_count || 0, 10),
      total_collected: parseFloat(rows[0]?.total_collected || 0),
      today_count: parseInt(rows[0]?.today_count || 0, 10),
      today_collected: parseFloat(rows[0]?.today_collected || 0),
      upi_total: parseFloat(rows[0]?.upi_total || 0),
      cash_total: parseFloat(rows[0]?.cash_total || 0),
      card_total: parseFloat(rows[0]?.card_total || 0)
    };
  }
}
