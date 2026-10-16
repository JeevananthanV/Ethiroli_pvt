import pool from '../config/database.js';
import AuditLog from '../models/AuditLog.js';
import crypto from 'crypto';
import { decrypt } from '../config/encryption.js';

export default class SalesCommission {
  static formatCommission(row) {
    if (!row) return null;
    return {
      ...row,
      eligible_amount: parseFloat(row.eligible_amount || 0),
      commission_rate: parseFloat(row.commission_rate || 0),
      commission_amount: parseFloat(row.commission_amount || 0),
      bda_name: row.bda_name ? decrypt(row.bda_name) : 'Assigned BDA',
      bda_email: row.bda_email ? decrypt(row.bda_email) : null,
      approved_by_name: row.approved_by_name ? decrypt(row.approved_by_name) : null,
    };
  }

  static async createCommission(data) {
    const {
      deal_id,
      bda_user_id,
      eligible_amount,
      commission_rate = 10.00,
      commission_amount,
      status = 'Pending Approval',
    } = data;

    const id = crypto.randomUUID();

    await pool.execute(
      `INSERT INTO sales_commissions 
        (id, deal_id, bda_user_id, eligible_amount, commission_rate, commission_amount, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        id,
        deal_id,
        bda_user_id,
        eligible_amount,
        commission_rate,
        commission_amount,
        status,
      ]
    );

    const [rows] = await pool.execute(
      `SELECT sc.*, u.full_name as bda_name, u.email as bda_email,
              d.title as deal_title, d.client_id,
              c.company_name as client_name
       FROM sales_commissions sc
       LEFT JOIN users u ON sc.bda_user_id = u.id
       LEFT JOIN sales_deals d ON sc.deal_id = d.id
       LEFT JOIN clients c ON d.client_id = c.id
       WHERE sc.id = ?`,
      [id]
    );

    // Log the commission creation safely
    try {
      await AuditLog.create({
        user_id: data.created_by || bda_user_id,
        action: 'CREATE_SALES_COMMISSION',
        entity_type: 'SALES_COMMISSION',
        entity_id: id,
        new_value: {
          dealId: deal_id,
          bdaId: bda_user_id,
          commissionAmount: commission_amount,
          commissionRate: commission_rate,
          status,
        },
        ip_address: data.ipAddress || 'system'
      });
    } catch (e) {
      console.warn('AuditLog error:', e.message);
    }

    return this.formatCommission(rows[0]);
  }

  static async getCommissions(filters = {}) {
    const {
      bda_id,
      status,
      category,
      page = 1,
      limit = 50,
    } = filters;

    let sql = `
      SELECT sc.*, u.full_name as bda_name, u.email as bda_email,
             d.title as deal_title, d.client_id, d.notes as deal_notes,
             c.company_name as client_name
      FROM sales_commissions sc
      LEFT JOIN users u ON sc.bda_user_id = u.id
      LEFT JOIN sales_deals d ON sc.deal_id = d.id
      LEFT JOIN clients c ON d.client_id = c.id
      WHERE 1=1
    `;
    const params = [];
    let countSql = `
      SELECT COUNT(*) as total
      FROM sales_commissions sc
      LEFT JOIN users u ON sc.bda_user_id = u.id
      LEFT JOIN sales_deals d ON sc.deal_id = d.id
      LEFT JOIN clients c ON d.client_id = c.id
      WHERE 1=1
    `;
    const countParams = [];

    if (bda_id && bda_id !== 'all') {
      sql += ' AND sc.bda_user_id = ?';
      params.push(bda_id);
      countSql += ' AND sc.bda_user_id = ?';
      countParams.push(bda_id);
    }

    if (status && status !== 'all') {
      sql += ' AND sc.status = ?';
      params.push(status);
      countSql += ' AND sc.status = ?';
      countParams.push(status);
    }

    if (category && category !== 'all') {
      sql += ' AND (d.title LIKE ? OR d.notes LIKE ?)';
      params.push(`%${category}%`, `%${category}%`);
      countSql += ' AND (d.title LIKE ? OR d.notes LIKE ?)';
      countParams.push(`%${category}%`, `%${category}%`);
    }

    sql += ' ORDER BY sc.created_at DESC';
    const parsedLimit = parseInt(limit, 10) || 50;
    const parsedPage = parseInt(page, 10) || 1;
    const offset = (parsedPage - 1) * parsedLimit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(parsedLimit, offset);

    const [rows] = await pool.execute(sql, params);
    const [[{ total }]] = await pool.execute(countSql, countParams);

    return {
      items: rows.map(r => this.formatCommission(r)),
      total,
      page: parsedPage,
      limit: parsedLimit,
    };
  }

  static async getCommissionById(id) {
    const [rows] = await pool.execute(
      `SELECT sc.*, u.full_name as bda_name, u.email as bda_email,
              d.title as deal_title, d.client_id, d.notes as deal_notes,
              c.company_name as client_name,
              u2.full_name as approved_by_name
       FROM sales_commissions sc
       LEFT JOIN users u ON sc.bda_user_id = u.id
       LEFT JOIN sales_deals d ON sc.deal_id = d.id
       LEFT JOIN clients c ON d.client_id = c.id
       LEFT JOIN users u2 ON sc.approved_by = u2.id
       WHERE sc.id = ?`,
      [id]
    );

    return rows.length > 0 ? this.formatCommission(rows[0]) : null;
  }

  static async approveCommission(id, approverId, notes = null) {
    const [result] = await pool.execute(
      `UPDATE sales_commissions 
       SET status = 'Approved',
           approved_by = ?,
           approved_at = NOW(),
           updated_at = NOW()
       WHERE id = ? AND status = 'Pending Approval'`,
      [approverId, id]
    );

    try {
      await AuditLog.create({
        user_id: approverId,
        action: 'APPROVE_SALES_COMMISSION',
        entity_type: 'SALES_COMMISSION',
        entity_id: id,
        new_value: { action: 'approve', newStatus: 'Approved', notes },
      });
    } catch (e) {
      console.warn('AuditLog error:', e.message);
    }

    return result.affectedRows > 0;
  }

  static async payCommission(id, payeeId, paymentRef) {
    const ref = paymentRef || `TXN-ETH-${Math.floor(100000 + Math.random() * 900000)}`;
    const [result] = await pool.execute(
      `UPDATE sales_commissions 
       SET status = 'Paid',
           paid_at = NOW(),
           payment_reference = ?,
           updated_at = NOW()
       WHERE id = ? AND status IN ('Approved', 'Payable')`,
      [ref, id]
    );

    try {
      await AuditLog.create({
        user_id: payeeId,
        action: 'PAY_SALES_COMMISSION',
        entity_type: 'SALES_COMMISSION',
        entity_id: id,
        new_value: { action: 'pay', newStatus: 'Paid', paymentReference: ref },
      });
    } catch (e) {
      console.warn('AuditLog error:', e.message);
    }

    return result.affectedRows > 0;
  }

  static async rejectCommission(id, rejectorId, reason) {
    const [result] = await pool.execute(
      `UPDATE sales_commissions 
       SET status = 'Rejected',
           updated_at = NOW()
       WHERE id = ? AND status = 'Pending Approval'`,
      [id]
    );

    try {
      await AuditLog.create({
        user_id: rejectorId,
        action: 'REJECT_SALES_COMMISSION',
        entity_type: 'SALES_COMMISSION',
        entity_id: id,
        new_value: { action: 'reject', reason },
      });
    } catch (e) {
      console.warn('AuditLog error:', e.message);
    }

    return result.affectedRows > 0;
  }

  static async calculateCommission(dealId, bdaId) {
    const [deals] = await pool.execute(
      `SELECT d.*, u.full_name as owner_name
       FROM sales_deals d
       LEFT JOIN users u ON d.owner_id = u.id
       WHERE d.id = ? AND d.stage IN ('CLOSED_WON', 'WON')`,
      [dealId]
    );

    if (deals.length === 0) {
      return null;
    }

    const deal = deals[0];
    const dealValue = parseFloat(deal.deal_value || 0);

    if (dealValue <= 0) {
      return null;
    }

    const commissionRate = 10.00;
    const commissionAmount = Math.round(dealValue * (commissionRate / 100) * 100) / 100;

    const [existing] = await pool.execute(
      `SELECT id FROM sales_commissions WHERE deal_id = ?`,
      [dealId]
    );

    if (existing.length > 0) {
      return { alreadyExists: true, commissionId: existing[0].id };
    }

    const id = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO sales_commissions 
        (id, deal_id, bda_user_id, eligible_amount, commission_rate, commission_amount, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'Pending Approval', NOW(), NOW())`,
      [
        id,
        dealId,
        bdaId,
        dealValue,
        commissionRate,
        commissionAmount,
      ]
    );

    return {
      commissionId: id,
      eligibleAmount: dealValue,
      commissionRate,
      commissionAmount,
      status: 'Pending Approval',
    };
  }
}
