import crypto from 'crypto';
import pool from '../config/database.js';

export default class CalendarEvent {
  static format(row) {
    if (!row) return null;
    const safeParse = (val, fallback = null) => {
      if (!val) return fallback;
      if (typeof val === 'object') return val;
      try { return JSON.parse(val); } catch { return fallback; }
    };

    return {
      ...row,
      assigned_users: safeParse(row.assigned_users, []),
      tags: safeParse(row.tags, []),
      recurrence_rule: safeParse(row.recurrence_rule, null),
      cancelled_instance_dates: safeParse(row.cancelled_instance_dates, []),
      metadata: safeParse(row.metadata, {}),
      is_all_day: Boolean(row.is_all_day)
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM calendar_events WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({
    id,
    title,
    description = null,
    event_type = 'MEETING',
    event_type_id = null,
    start_time,
    end_time,
    created_by,
    tenant_id = null,
    assigned_users = [],
    location = null,
    meeting_link = null,
    is_all_day = false,
    recurrence_rule = null,
    recurrence_end_date = null,
    recurrence_instance_count = null,
    index_key = null,
    parent_event_id = null,
    cancelled_instance_dates = [],
    tags = [],
    metadata = {},
    status = 'scheduled',
    priority = 'medium',
    role = null,
  }) {
    const eventId = id || crypto.randomUUID();
    const safeStringify = (val) => (val !== undefined && val !== null ? JSON.stringify(val) : null);

    await pool.execute(
      `INSERT INTO calendar_events 
       (id, title, description, event_type, event_type_id, start_time, end_time, created_by, tenant_id, 
        assigned_users, location, meeting_link, is_all_day, recurrence_rule, recurrence_end_date,
        recurrence_instance_count, index_key, parent_event_id, cancelled_instance_dates,
        tags, metadata, status, priority, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        eventId,
        title,
        description,
        event_type,
        event_type_id,
        start_time,
        end_time,
        created_by,
        tenant_id,
        safeStringify(assigned_users),
        location,
        meeting_link,
        Boolean(is_all_day),
        safeStringify(recurrence_rule),
        recurrence_end_date,
        recurrence_instance_count,
        index_key,
        parent_event_id,
        safeStringify(cancelled_instance_dates),
        safeStringify(tags),
        safeStringify(metadata),
        status,
        priority,
        role
      ]
    );

    return eventId;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    const fieldMap = {
      title: 'title',
      description: 'description',
      event_type: 'event_type',
      event_type_id: 'event_type_id',
      start_time: 'start_time',
      end_time: 'end_time',
      location: 'location',
      meeting_link: 'meeting_link',
      is_all_day: 'is_all_day',
      recurrence_rule: 'recurrence_rule',
      recurrence_end_date: 'recurrence_end_date',
      recurrence_instance_count: 'recurrence_instance_count',
      index_key: 'index_key',
      parent_event_id: 'parent_event_id',
      cancelled_instance_dates: 'cancelled_instance_dates',
      assigned_users: 'assigned_users',
      tags: 'tags',
      metadata: 'metadata',
      status: 'status',
      priority: 'priority',
      role: 'role',
      tenant_id: 'tenant_id',
    };

    for (const [key, value] of Object.entries(updates)) {
      const dbField = fieldMap[key];
      if (!dbField) continue;
      queryParts.push(`${dbField} = ?`);
      if (['assigned_users', 'tags', 'metadata', 'recurrence_rule', 'cancelled_instance_dates'].includes(key)) {
        values.push(value !== undefined && value !== null ? JSON.stringify(value) : null);
      } else if (key === 'is_all_day') {
        values.push(Boolean(value));
      } else {
        values.push(value);
      }
    }

    if (queryParts.length === 0) return;
    queryParts.push('updated_at = NOW()');
    values.push(id);
    await pool.execute(`UPDATE calendar_events SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    // Delete event and any generated child instances
    await pool.execute('DELETE FROM calendar_events WHERE id = ? OR parent_event_id = ?', [id, id]);
  }

  static async list({
    start_date,
    end_date,
    event_type,
    event_type_id,
    status,
    created_by,
    assigned_to,
    tenant_id,
    role = null,
    include_children = false,
    limit = 50,
    offset = 0
  } = {}) {
    let query = 'SELECT * FROM calendar_events WHERE 1=1';
    const values = [];

    if (start_date && end_date) {
      query += ' AND start_time BETWEEN ? AND ?';
      values.push(start_date, end_date);
    } else if (start_date) {
      query += ' AND start_time >= ?';
      values.push(start_date);
    } else if (end_date) {
      query += ' AND end_time <= ?';
      values.push(end_date);
    }

    if (event_type) { query += ' AND event_type = ?'; values.push(event_type); }
    if (event_type_id) { query += ' AND event_type_id = ?'; values.push(event_type_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }
    if (created_by) { query += ' AND created_by = ?'; values.push(created_by); }
    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }

    if (assigned_to) {
      query += ' AND (created_by = ? OR JSON_CONTAINS(assigned_users, ?))';
      values.push(assigned_to, JSON.stringify(assigned_to));
    }

    if (role && role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      query += ' AND (role IS NULL OR role = ? OR role = "ALL")';
      values.push(role);
    }

    if (!include_children) {
      query += ' AND (parent_event_id IS NULL OR parent_event_id = "")';
    }

    query += ' ORDER BY start_time ASC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({
    start_date,
    end_date,
    event_type,
    event_type_id,
    status,
    created_by,
    assigned_to,
    tenant_id,
    role = null,
    include_children = false
  } = {}) {
    let query = 'SELECT COUNT(*) as total FROM calendar_events WHERE 1=1';
    const values = [];

    if (start_date && end_date) {
      query += ' AND start_time BETWEEN ? AND ?';
      values.push(start_date, end_date);
    } else if (start_date) {
      query += ' AND start_time >= ?';
      values.push(start_date);
    } else if (end_date) {
      query += ' AND end_time <= ?';
      values.push(end_date);
    }

    if (event_type) { query += ' AND event_type = ?'; values.push(event_type); }
    if (event_type_id) { query += ' AND event_type_id = ?'; values.push(event_type_id); }
    if (status) { query += ' AND status = ?'; values.push(status); }
    if (created_by) { query += ' AND created_by = ?'; values.push(created_by); }
    if (tenant_id) { query += ' AND tenant_id = ?'; values.push(tenant_id); }

    if (assigned_to) {
      query += ' AND (created_by = ? OR JSON_CONTAINS(assigned_users, ?))';
      values.push(assigned_to, JSON.stringify(assigned_to));
    }

    if (role && role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      query += ' AND (role IS NULL OR role = ? OR role = "ALL")';
      values.push(role);
    }

    if (!include_children) {
      query += ' AND (parent_event_id IS NULL OR parent_event_id = "")';
    }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  // Merges single parent events and all child recurring instances in range
  static async listExpanded({ start_date, end_date, role = null, userId = null, event_type_id = null }) {
    let query = `
      SELECT e.*, t.label as type_label, t.color as type_color, t.icon as type_icon
      FROM calendar_events e
      LEFT JOIN calendar_event_types t ON e.event_type_id = t.id
      WHERE e.status != 'cancelled'
    `;
    const values = [];

    if (start_date && end_date) {
      query += ' AND e.start_time BETWEEN ? AND ?';
      values.push(start_date, end_date);
    }

    if (event_type_id) {
      query += ' AND e.event_type_id = ?';
      values.push(event_type_id);
    }

    if (userId) {
      query += ' AND (e.created_by = ? OR JSON_CONTAINS(e.assigned_users, ?))';
      values.push(userId, JSON.stringify(userId));
    }

    if (role && role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
      query += ' AND (e.role IS NULL OR e.role = ? OR e.role = "ALL")';
      values.push(role);
    }

    query += ' ORDER BY e.start_time ASC LIMIT 500';

    const [rows] = await pool.execute(query, values);
    return rows.map(r => this.format(r));
  }
}
