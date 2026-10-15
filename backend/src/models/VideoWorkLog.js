import pool from '../config/database.js';

export default class VideoWorkLog {
  static async createLog(data) {
    const { task_id, editor, start_time, end_time, blockers, notes } = data;
    const actual_hours = parseFloat(
      ((new Date(end_time).getTime() - new Date(start_time).getTime()) / 3600000).toFixed(2)
    ) || 0;

    const [result] = await pool.execute(
      `INSERT INTO video_work_logs 
        (task_id, editor, start_time, end_time, actual_hours, blockers, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [task_id, editor, start_time, end_time, actual_hours, JSON.stringify(blockers || []), notes || '']
    );

    return result.insertId;
  }

  static async getLogs(filters = {}) {
    const { task_id, editor, page = 1, limit = 50 } = filters;

    let sql = `
      VL.id, VL.start_time, VL.end_time, VL.actual_hours, VL.task_completed,
      VL.notes, U.full_name as editor_name
      FROM video_work_logs VL
      LEFT JOIN users U ON VL.editor = U.id
      WHERE 1=1
    `;
    let countSql = `SELECT COUNT(*) as total FROM video_work_logs VL WHERE 1=1`;
    const params = [];
    const countParams = [];

    if (task_id) {
      sql += ' AND VL.task_id = ?';
      params.push(task_id);
      countSql += ' AND VL.task_id = ?';
      countParams.push(task_id);
    }

    if (editor) {
      sql += ' AND VL.editor = ?';
      params.push(editor);
      countSql += ' VL.editor = ?';
      countParams.push(editor);
    }

    sql += ' ORDER BY VL.created_at DESC';
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), offset);

    const [rows] = await pool.execute(sql, params);
    const [[{ total }]] = await pool.execute(countSql, countParams);

    return { items: rows, total, page, limit };
  }

  static async getEditorStats(editorId) {
    const [rows] = await pool.execute(`
      SELECT 
        COUNT(*) as total_logs,
        SUM(actual_hours) as total_hours,
        SUM(task_completed) as tasks_completed,
        AVG(actual_hours) as avg_hours_per_log
      FROM video_work_logs
      WHERE editor = ?
    `, [editorId]);

    return rows[0];
  }
}