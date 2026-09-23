import pool from '../config/database.js';

export default class CalendarRoleConfig {
  static format(row) {
    if (!row) return null;
    const safeParse = (val, fallback = []) => {
      if (!val) return fallback;
      if (typeof val === 'object') return val;
      try { return JSON.parse(val); } catch { return fallback; }
    };

    return {
      ...row,
      event_type_visibility: safeParse(row.event_type_visibility, []),
      quick_create_types: safeParse(row.quick_create_types, []),
      show_others_events: Boolean(row.show_others_events),
      is_active: Boolean(row.is_active)
    };
  }

  static async findByRole(role) {
    const [rows] = await pool.execute(
      'SELECT * FROM calendar_role_configs WHERE role = ? LIMIT 1',
      [role]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async upsert({
    id,
    role,
    calendar_title = 'Calendar',
    default_view = 'month',
    work_start_time = '09:00:00',
    work_end_time = '18:00:00',
    show_others_events = true,
    event_type_visibility = [],
    quick_create_types = [],
    is_active = true
  }) {
    const configId = id || `cfg_${role.toLowerCase()}`;
    const safeStringify = (val) => (val !== undefined && val !== null ? JSON.stringify(val) : '[]');

    await pool.execute(
      `INSERT INTO calendar_role_configs 
       (id, role, calendar_title, default_view, work_start_time, work_end_time, 
        show_others_events, event_type_visibility, quick_create_types, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE 
         calendar_title = VALUES(calendar_title),
         default_view = VALUES(default_view),
         work_start_time = VALUES(work_start_time),
         work_end_time = VALUES(work_end_time),
         show_others_events = VALUES(show_others_events),
         event_type_visibility = VALUES(event_type_visibility),
         quick_create_types = VALUES(quick_create_types),
         is_active = VALUES(is_active),
         updated_at = NOW()`,
      [
        configId,
        role,
        calendar_title,
        default_view,
        work_start_time,
        work_end_time,
        Boolean(show_others_events),
        safeStringify(event_type_visibility),
        safeStringify(quick_create_types),
        Boolean(is_active)
      ]
    );

    return this.findByRole(role);
  }

  static async list({ isActive = true } = {}) {
    let query = 'SELECT * FROM calendar_role_configs WHERE 1=1';
    const values = [];

    if (isActive !== undefined && isActive !== null) {
      query += ' AND is_active = ?';
      values.push(Boolean(isActive));
    }

    query += ' ORDER BY role ASC';
    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async delete(role) {
    await pool.execute('DELETE FROM calendar_role_configs WHERE role = ?', [role]);
  }
}
