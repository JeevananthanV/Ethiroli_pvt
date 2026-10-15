import pool from '../config/database.js';

export default class VideoReview {
  static async createReview(data) {
    const { task_id, reviewer, comments, overall_rating, approve, reject, required_revisions } = data;

    const [result] = await pool.execute(
      `INSERT INTO video_reviews 
        (task_id, reviewer, comments, overall_rating, approve, reject, required_revisions, status, review_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())`,
      [task_id, reviewer, comments || '', overall_rating || 0, approve || 0, reject || 0, required_revisions || 0]
    );

    return result.insertId;
  }

  static async getReviews(filters = {}) {
    const { task_id, page = 1, limit = 20 } = filters;

    let sql = `
      VR.id, VR.review_date, VR.overall_rating, VR.comments, VR.approve, VR.reject, VR.required_revisions, VR.status,
      U.full_name as reviewer_name
      FROM video_reviews VR
      LEFT JOIN users U ON VR.reviewer = U.id
      WHERE 1=1
    `;
    let countSql = `SELECT COUNT(*) as total FROM video_reviews VR WHERE 1=1`;
    const params = [];
    const countParams = [];

    if (task_id) {
      sql += ' AND VR.task_id = ?';
      params.push(task_id);
      countSql += ' AND VR.task_id = ?';
      countParams.push(task_id);
    }

    sql += ' ORDER BY VR.review_date DESC';
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), offset);

    const [rows] = await pool.execute(sql, params);
    const [[{ total }]] = await pool.execute(countSql, countParams);

    return { items: rows, total, page, limit };
  }

  static async getTaskReviewsCount(task_id) {
    const [rows] = await pool.execute(
      `SELECT status, COUNT(*) as count FROM video_reviews WHERE task_id = ? GROUP BY status`,
      [task_id]
    );
    return rows;
  }
}