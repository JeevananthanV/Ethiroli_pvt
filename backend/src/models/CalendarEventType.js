import crypto from 'crypto';
import pool from '../config/database.js';

export default class CalendarEventType {
  static format(row) {
    if (!row) return null;
    const safeParse = (val, fallback = []) => {
      if (!val) return fallback;
      if (typeof val === 'object') return val;
      try { return JSON.parse(val); } catch { return fallback; }
    };

    return {
      ...row,
      allowed_create_roles: safeParse(row.allowed_create_roles, []),
      allowed_write_roles: safeParse(row.allowed_write_roles, []),
      notification_target_roles: safeParse(row.notification_target_roles, []),
      is_active: Boolean(row.is_active)
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM calendar_event_types WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByType(typeOrId) {
    const [rows] = await pool.execute(
      'SELECT * FROM calendar_event_types WHERE (id = ? OR label = ? OR UPPER(label) = UPPER(?)) AND is_active = 1 LIMIT 1',
      [typeOrId, typeOrId, typeOrId]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({
    id,
    label,
    description = null,
    icon = 'event',
    defaultDuration = 30,
    default_duration_minutes,
    color = '#6366f1',
    allowedCreateRoles = [],
    allowed_create_roles,
    allowedWriteRoles = [],
    allowed_write_roles,
    notificationTargets = [],
    notification_target_roles,
    isActive = true,
    is_active,
    sortOrder = 0,
    sort_order,
  }) {
    const typeId = id || `evt_${label.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString(36)}`;
    const duration = default_duration_minutes !== undefined ? default_duration_minutes : defaultDuration;
    const createRoles = allowed_create_roles || allowedCreateRoles;
    const writeRoles = allowed_write_roles || allowedWriteRoles;
    const targets = notification_target_roles || notificationTargets;
    const active = is_active !== undefined ? Boolean(is_active) : Boolean(isActive);
    const sort = sort_order !== undefined ? sort_order : sortOrder;

    await pool.execute(
      `INSERT INTO calendar_event_types 
       (id, label, description, icon, default_duration_minutes, color, 
        allowed_create_roles, allowed_write_roles, notification_target_roles, 
        is_active, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        typeId,
        label,
        description,
        icon,
        duration,
        color,
        JSON.stringify(createRoles),
        JSON.stringify(writeRoles),
        JSON.stringify(targets),
        active,
        sort,
      ]
    );

    return typeId;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    const fieldMap = {
      label: 'label',
      description: 'description',
      icon: 'icon',
      defaultDuration: 'default_duration_minutes',
      default_duration_minutes: 'default_duration_minutes',
      color: 'color',
      allowedCreateRoles: 'allowed_create_roles',
      allowed_create_roles: 'allowed_create_roles',
      allowedWriteRoles: 'allowed_write_roles',
      allowed_write_roles: 'allowed_write_roles',
      notificationTargets: 'notification_target_roles',
      notification_target_roles: 'notification_target_roles',
      isActive: 'is_active',
      is_active: 'is_active',
      sortOrder: 'sort_order',
      sort_order: 'sort_order',
    };

    for (const [key, value] of Object.entries(updates)) {
      const dbField = fieldMap[key];
      if (!dbField) continue;
      queryParts.push(`${dbField} = ?`);

      if (['allowedCreateRoles', 'allowed_create_roles', 'allowedWriteRoles', 'allowed_write_roles', 'notificationTargets', 'notification_target_roles'].includes(key)) {
        values.push(JSON.stringify(value || []));
      } else if (key === 'isActive' || key === 'is_active') {
        values.push(Boolean(value));
      } else {
        values.push(value);
      }
    }

    if (queryParts.length === 0) return;
    queryParts.push('updated_at = NOW()');
    values.push(id);
    await pool.execute(`UPDATE calendar_event_types SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM calendar_event_types WHERE id = ?', [id]);
  }

  static async list({ isActive = true, limit = 100, offset = 0 } = {}) {
    let query = 'SELECT * FROM calendar_event_types WHERE 1=1';
    const values = [];

    if (isActive !== undefined && isActive !== null) {
      query += ' AND is_active = ?';
      values.push(Boolean(isActive));
    }

    query += ' ORDER BY sort_order ASC, label ASC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ isActive = true } = {}) {
    let query = 'SELECT COUNT(*) as total FROM calendar_event_types WHERE 1=1';
    const values = [];

    if (isActive !== undefined && isActive !== null) {
      query += ' AND is_active = ?';
      values.push(Boolean(isActive));
    }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
