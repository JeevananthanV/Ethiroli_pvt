import pool from '../config/database.js';

export default class VideoRevision {
  static async createRevision(data) {
    const { task_id, version_number, previous_version, video_url, revision_notes, revised_by } = data;

    const [result] = await pool.execute(
      `INSERT INTO video_revisions 
        (task_id, version_number, previous_version, video_url, revision_notes, revised_by, status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending Approval')`,
      [task_id, version_number || 1, previous_version || 0, video_url || '', revision_notes || '', revised_by || '']
    );

    return result.insertId;
  }

  static async getRevisions(filters = {}) {
    const { task_id, page = 1, limit = 20 } = filters;

    let sql = `
      VR.id, VR.version_number, VR.revised_by, VR.revised_at, VR.revision_notes, VR.status,
      U.full_name as editor_name
      FROM video_revisions VR
      LEFT JOIN users U ON VR.revised_by = U.id
      WHERE 1=1
    `;
    let countSql = `SELECT COUNT(*) as total FROM video_revisions VR WHERE 1=1`;
    const params = [];
    const countParams = [];

    if (task_id) {
      sql += ' AND VR.task_id = ?';
      params.push(task_id);
      countSql += ' AND VR.task_id = ?';
      countParams.push(task_id);
    }

    sql += ' ORDER BY VR.version_number DESC';
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), offset);

    const [rows] = await pool.execute(sql, params);
    const [[{ total }]] = await pool.execute(countSql, countParams);

    return { items: rows, total, page, limit };
  }

  static async approveRevision(id, approverId) {
    const [result] = await pool.execute(
      `UPDATE video_revisions SET status = 'Approved', approved_by = ?, approved_at = NOW() WHERE id = ? AND status = 'Pending Approval'`,
      [approverId, id]
    );

    return result.affectedRows > 0;
  }

  static async rejectRevision(id, rejectorId, reason) {
    const [result] = await pool.execute(
      `UPDATE video_revisions SET status = 'Rejected', revised_at = NOW() WHERE id = ? AND status = 'Pending Approval'`,
      [id]
    );

    // Log reason if needed
    return result.affectedRows > 0;
  }
}