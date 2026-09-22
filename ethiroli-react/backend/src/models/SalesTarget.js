import crypto from 'crypto';
import pool from '../config/database.js';
import { decrypt } from '../config/encryption.js';

export default class SalesTarget {
  static format(row) {
    if (!row) return null;
    const targetRevenue = parseFloat(row.target_revenue || 0);
    const achievedRevenue = parseFloat(row.achieved_revenue || 0);
    const achievementRate = targetRevenue > 0 ? Math.round((achievedRevenue / targetRevenue) * 1000) / 10 : 0;

    return {
      ...row,
      target_revenue: targetRevenue,
      achieved_revenue: achievedRevenue,
      deals_target: parseInt(row.deals_target || 0, 10),
      deals_won: parseInt(row.deals_won || 0, 10),
      achievement_rate: achievementRate,
      user_name: row.user_name ? decrypt(row.user_name) : (row.user_email || 'Sales Rep')
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT t.*, 
              u.full_name as user_name, u.email as user_email
       FROM sales_targets t
       LEFT JOIN users u ON t.user_id = u.id
       WHERE t.id = ?`,
      [id]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByUserAndPeriod(userId, fiscalYear, periodLabel) {
    const [rows] = await pool.execute(
      `SELECT t.*, 
              u.full_name as user_name, u.email as user_email
       FROM sales_targets t
       LEFT JOIN users u ON t.user_id = u.id
       WHERE t.user_id = ? AND t.fiscal_year = ? AND t.period_label = ?`,
      [userId, fiscalYear, periodLabel]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async list({ user_id, fiscal_year, period_type, page = 1, limit = 50 } = {}) {
    let sql = `
      SELECT t.*, 
             u.full_name as user_name, u.email as user_email
      FROM sales_targets t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (user_id) {
      sql += ' AND t.user_id = ?';
      params.push(user_id);
    }
    if (fiscal_year) {
      sql += ' AND t.fiscal_year = ?';
      params.push(fiscal_year);
    }
    if (period_type) {
      sql += ' AND t.period_type = ?';
      params.push(period_type);
    }

    sql += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(sql, params);
    return rows.map(r => this.format(r));
  }

  static async count({ user_id, fiscal_year, period_type } = {}) {
    let sql = `SELECT COUNT(*) as count FROM sales_targets t WHERE 1=1`;
    const params = [];

    if (user_id) {
      sql += ' AND t.user_id = ?';
      params.push(user_id);
    }
    if (fiscal_year) {
      sql += ' AND t.fiscal_year = ?';
      params.push(fiscal_year);
    }
    if (period_type) {
      sql += ' AND t.period_type = ?';
      params.push(period_type);
    }

    const [rows] = await pool.query(sql, params);
    return rows[0]?.count || 0;
  }

  static async createOrUpdate(data) {
    const existing = await this.findByUserAndPeriod(data.user_id, data.fiscal_year, data.period_label);

    if (existing) {
      await pool.execute(
        `UPDATE sales_targets 
         SET target_revenue = ?, period_type = ?, deals_target = ?
         WHERE id = ?`,
        [
          parseFloat(data.target_revenue || existing.target_revenue),
          data.period_type || existing.period_type,
          parseInt(data.deals_target || existing.deals_target, 10),
          existing.id
        ]
      );
      return this.findById(existing.id);
    }

    const id = data.id || crypto.randomUUID();
    await pool.execute(
      `INSERT INTO sales_targets 
        (id, user_id, fiscal_year, period_type, period_label, target_revenue, achieved_revenue, deals_target, deals_won)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.user_id,
        data.fiscal_year,
        data.period_type || 'QUARTERLY',
        data.period_label,
        parseFloat(data.target_revenue || 0),
        parseFloat(data.achieved_revenue || 0),
        parseInt(data.deals_target || 5, 10),
        parseInt(data.deals_won || 0, 10)
      ]
    );

    return this.findById(id);
  }

  static async recordDealWon(userId, dealValue) {
    // Increment achieved revenue and deals won for current active targets
    await pool.execute(
      `UPDATE sales_targets 
       SET achieved_revenue = achieved_revenue + ?, deals_won = deals_won + 1
       WHERE user_id = ?`,
      [parseFloat(dealValue || 0), userId]
    );
  }

  static async delete(id) {
    const [res] = await pool.execute('DELETE FROM sales_targets WHERE id = ?', [id]);
    return res.affectedRows > 0;
  }
}
