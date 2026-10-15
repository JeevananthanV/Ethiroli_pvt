import pool from '../config/database.js';

export default class VideoDelivery {
  static async createDelivery(data) {
    const { task_id, delivered_by, client_approved, client_comments, payment_amount, payment_status } = data;

    const [result] = await pool.execute(
      `INSERT INTO video_deliveries 
        (task_id, delivered_by, client_approved, client_comments, payment_amount, payment_status, delivered_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [task_id, delivered_by, client_approved || 0, client_comments || '', payment_amount || 0, payment_status || 'Unpaid']
    );

    return result.insertId;
  }

  static async getDeliveries(filters = {}) {
    const { task_id, page = 1, limit = 20 } = filters;

    let sql = `
      VD.id, VD.delivered_at, VD.client_approved, VD.client_comments, VD.payment_amount, VD.payment_status,
      U.full_name as delivered_by_name
      FROM video_deliveries VD
      LEFT JOIN users U ON VD.delivered_by = U.id
      WHERE 1=1
    `;
    let countSql = `SELECT COUNT(*) as total FROM video_deliveries VD WHERE 1=1`;
    const params = [];
    const countParams = [];

    if (task_id) {
      sql += ' AND VD.task_id = ?';
      params.push(task_id);
      countSql += ' AND VD.task_id = ?';
      countParams.push(task_id);
    }

    sql += ' ORDER BY VD.delivered_at DESC';
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), offset);

    const [rows] = await pool.execute(sql, params);
    const [[{ total }]] = await pool.execute(countSql, countParams);

    return { items: rows, total, page, limit };
  }

  static async updatePayment(id, paymentStatus, paymentRef) {
    const [result] = await pool.execute(
      `UPDATE video_deliveries SET payment_status = ?, payment_ref = ?, updated_at = NOW() WHERE id = ?`,
      [paymentStatus, paymentRef, id]
    );

    return result.affectedRows > 0;
  }
}