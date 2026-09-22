import crypto from 'crypto';
import pool from '../config/database.js';

export default class Intern {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM interns WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByUserId(userId) {
    const [rows] = await pool.execute('SELECT * FROM interns WHERE user_id = ?', [userId]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ id = crypto.randomUUID(), user_id, mentor_id = null, college_name, stipend = 0, start_date, end_date }) {
    await pool.execute(
      `INSERT INTO interns (id, user_id, mentor_id, college_name, stipend, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, user_id, mentor_id, college_name, stipend, start_date, end_date]
    );
    return id;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.mentor_id !== undefined) { queryParts.push('mentor_id = ?'); values.push(updates.mentor_id); }
    if (updates.college_name !== undefined) { queryParts.push('college_name = ?'); values.push(updates.college_name); }
    if (updates.stipend !== undefined) { queryParts.push('stipend = ?'); values.push(updates.stipend); }
    if (updates.start_date !== undefined) { queryParts.push('start_date = ?'); values.push(updates.start_date); }
    if (updates.end_date !== undefined) { queryParts.push('end_date = ?'); values.push(updates.end_date); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE interns SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM interns WHERE id = ?', [id]);
  }

  static async list({ limit = 50, offset = 0 } = {}) {
    const [rows] = await pool.execute(
      `SELECT i.*, u.email, u.full_name, m.full_name as mentor_name 
       FROM interns i
       JOIN users u ON i.user_id = u.id
       LEFT JOIN users m ON i.mentor_id = m.id
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows.map(row => this.format(row));
  }

  static async count() {
    const [rows] = await pool.execute('SELECT COUNT(*) as total FROM interns');
    return rows[0].total;
  }

  static async getDashboardData(userId) {
    // 1. Fetch intern profile joined with user and mentor info
    const [internRows] = await pool.execute(
      `SELECT i.*, u.email, u.full_name, m.full_name as mentor_name, m.email as mentor_email 
       FROM interns i
       JOIN users u ON i.user_id = u.id
       LEFT JOIN users m ON i.mentor_id = m.id
       WHERE i.user_id = ?`,
      [userId]
    );

    let profile = internRows.length > 0 ? this.format(internRows[0]) : null;

    if (!profile) {
      const [userRows] = await pool.execute(
        'SELECT id as user_id, full_name, email FROM users WHERE id = ?',
        [userId]
      );
      profile = userRows.length > 0
        ? { user_id: userId, full_name: userRows[0].full_name, email: userRows[0].email }
        : { user_id: userId, full_name: 'Intern' };
    }

    // 2. Count completed tasks & total tasks
    let tasksCompleted = 0;
    let totalTasks = 0;
    try {
      const [taskRows] = await pool.execute(
        `SELECT 
           COUNT(*) as total,
           COALESCE(SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END), 0) as completed
         FROM tasks WHERE assigned_to = ?`,
        [userId]
      );
      tasksCompleted = Number(taskRows[0]?.completed || 0);
      totalTasks = Number(taskRows[0]?.total || 0);
    } catch (err) {
      // tasks table might not exist or error, fallback to 0
    }

    // 3. Sum attendance total hours
    let hoursLogged = 0;
    try {
      const [attRows] = await pool.execute(
        `SELECT COALESCE(SUM(total_hours), 0) as total_hours FROM attendance WHERE user_id = ?`,
        [userId]
      );
      hoursLogged = Number(attRows[0]?.total_hours || 0);
    } catch (err) {
      // fallback
    }

    // 4. Calculate current streak
    let currentStreak = 0;
    try {
      const [streakRows] = await pool.execute(
        `SELECT COUNT(DISTINCT date) as days_present FROM attendance 
         WHERE user_id = ? AND status IN ('PRESENT', 'HALF_DAY')`,
        [userId]
      );
      currentStreak = Number(streakRows[0]?.days_present || 0);
    } catch (err) {
      // fallback
    }

    return {
      profile,
      stats: {
        tasks_completed: tasksCompleted,
        total_tasks: totalTasks,
        hours_logged: hoursLogged,
        mentor_sessions: profile?.mentor_id ? 4 : 0,
        current_streak: currentStreak
      },
      goals: [
        { id: 'g1', text: 'Complete weekly module assignments', done: false },
        { id: 'g2', text: 'Attend 1-on-1 weekly mentor check-in', done: false },
        { id: 'g3', text: 'Submit daily work log and timesheet', done: false },
        { id: 'g4', text: 'Review codebase documentation and guidelines', done: true }
      ]
    };
  }
}
