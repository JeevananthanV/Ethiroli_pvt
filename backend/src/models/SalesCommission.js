import pool from '../config/database.js';
import AuditLog from '../models/AuditLog.js';

export default class SalesCommission {
  static async createCommission(data) {
    const {
      deal_id,
      bda_user_id,
      eligible_amount,
      commission_rate,
      commission_amount,
      status = 'Pending Approval',
    } = data;

    const [result] = await pool.execute(
      `INSERT INTO sales_commissions 
        (deal_id, bda_user_id, eligible_amount, commission_rate, commission_amount, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        deal_id,
        bda_user_id,
        eligible_amount,
        commission_rate,
        commission_amount,
        status,
        data.created_by,
      ]
    );

    const [commission] = await pool.execute(
      `SELECT sc.*, u.full_name as bda_name, u.email as bda_email
       FROM sales_commissions sc
       LEFT JOIN users u ON sc.bda_user_id = u.id
       WHERE sc.id = ?`,
      [result.insertId]
    );

    // Log the commission creation
    await AuditLog.log({
      userId: data.created_by,
      action: 'CREATE',
      entityType: 'SALES_COMMISSION',
      entityId: result.insertId,
      details: {
        dealId: deal_id,
        bdaId: bda_user_id,
        commissionAmount: commission_amount,
        commissionRate: commission_rate,
        status,
      },
      ipAddress: data.ipAddress,
    });

    return commission[0];
  }

  static async getCommissions(filters = {}) {
    const {
      bda_id,
      status,
      page = 1,
      limit = 20,
    } = filters;

    let sql = `
      SELECT sc.*, u.full_name as bda_name, u.email as bda_email,
             d.title as deal_title, d.client_id,
             c.company_name as client_name
      FROM sales_commissions sc
      LEFT JOIN users u ON sc.bda_user_id = u.id
      LEFT JOIN sales_deals d ON sc.deal_id = d.id
      LEFT JOIN clients c ON d.client_id = c.id
      WHERE 1=1
    `;
    const params = [];
    const countSql = `
      SELECT COUNT(*) as total
      FROM sales_commissions sc
      LEFT JOIN users u ON sc.bda_user_id = u.id
      LEFT JOIN sales_deals d ON sc.deal_id = d.id
      LEFT JOIN clients c ON d.client_id = c.id
      WHERE 1=1
    `;
    const countParams = [];

    if (bda_id) {
      sql += ' AND sc.bda_user_id = ?';
      params.push(bda_id);
      countSql += ' AND sc.bda_user_id = ?';
      countParams.push(bda_id);
    }

    if (status) {
      sql += ' AND sc.status = ?';
      params.push(status);
      countSql += ' AND sc.status = ?';
      countParams.push(status);
    }

    sql += ' ORDER BY sc.created_at DESC';
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), offset);

    const [rows] = await pool.execute(sql, params);
    const [[{ total }]] = await pool.execute(countSql, countParams);

    return {
      items: rows,
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };
  }

  static async getCommissionById(id) {
    const [rows] = await pool.execute(
      `SELECT sc.*, u.full_name as bda_name, u.email as bda_email,
              d.title as deal_title, d.client_id,
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

    return rows.length > 0 ? rows[0] : null;
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

    // Log the approval
    await AuditLog.log({
      userId: approverId,
      action: 'UPDATE',
      entityType: 'SALES_COMMISSION',
      entityId: id,
      details: {
        action: 'approve',
        previousStatus: 'Pending Approval',
        newStatus: 'Approved',
      },
      ipAddress: null,
    });

    return result.affectedRows > 0;
  }

  static async payCommission(id, payeeId, paymentRef) {
    const [result] = await pool.execute(
      `UPDATE sales_commissions 
       SET status = 'Paid',
           paid_at = NOW(),
           payment_reference = ?,
           updated_at = NOW()
       WHERE id = ? AND status = 'Approved'`,
      [paymentRef, id]
    );

    // Log the payment
    await AuditLog.log({
      userId: payeeId,
      action: 'UPDATE',
      entityType: 'SALES_COMMISSION',
      entityId: id,
      details: {
        action: 'pay',
        previousStatus: 'Approved',
        newStatus: 'Paid',
        paymentReference: paymentRef,
      },
      ipAddress: null,
    });

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

    // Log the rejection
    await AuditLog.log({
      userId: rejectorId,
      action: 'UPDATE',
      entityType: 'SALES_COMMISSION',
      entityId: id,
      details: {
        action: 'reject',
        reason,
      },
      ipAddress: null,
    });

    return result.affectedRows > 0;
  }

  static async calculateCommission(dealId, bdaId) {
    // Get the deal details
    const [deals] = await pool.execute(
      `SELECT d.*, u.full_name as owner_name
       FROM sales_deals d
       LEFT JOIN users u ON d.owner_id = u.id
       WHERE d.id = ? AND d.stage = 'WON'`,
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

    // Calculate 10% commission
    const commissionRate = 10.00;
    const commissionAmount = Math.round(dealValue * (commissionRate / 100) * 100) / 100;

    // Check if commission already exists for this deal
    const [existing] = await pool.execute(
      `SELECT id FROM sales_commissions WHERE deal_id = ?`,
      [dealId]
    );

    if (existing.length > 0) {
      return { alreadyExists: true, commissionId: existing[0].id };
    }

    // Create the commission record (status = Pending Approval by default)
    const [commission] = await pool.execute(
      `INSERT INTO sales_commissions 
        (deal_id, bda_user_id, eligible_amount, commission_rate, commission_amount, status, created_by)
       VALUES (?, ?, ?, ?, ?, 'Pending Approval', ?)`,
      [
        dealId,
        bdaId,
        dealValue,
        commissionRate,
        commissionAmount,
        bdaId,
      ]
    );

    return {
      commissionId: commission.insertId,
      eligibleAmount: dealValue,
      commissionRate,
      commissionAmount,
      status: 'Pending Approval',
    };
  }
}
