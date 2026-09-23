import crypto from 'crypto';
import pool from '../config/database.js';

export default class RecurringRule {
  static format(row) {
    if (!row) return null;
    const safeParse = (val, fallback = null) => {
      if (!val) return fallback;
      if (typeof val === 'object') return val;
      try { return JSON.parse(val); } catch { return fallback; }
    };

    return {
      ...row,
      days_of_week: safeParse(row.days_of_week, []),
      is_active: Boolean(row.is_active)
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM recurring_rules WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByEventId(eventId) {
    const [rows] = await pool.execute(
      'SELECT * FROM recurring_rules WHERE event_id = ? LIMIT 1',
      [eventId]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  // Alias for backward compatibility
  static async findByCalendarEventId(eventId) {
    return this.findByEventId(eventId);
  }

  static async create({
    id,
    eventId,
    event_id,
    calendarEventId,
    calendar_event_id,
    frequency,
    interval = 1,
    daysOfWeek = [],
    days_of_week,
    dayOfMonth = null,
    day_of_month = null,
    monthOfYear = null,
    month_of_year = null,
    endDate = null,
    end_date = null,
    maxOccurrences = null,
    max_occurrences = null,
    nextOccurrence = null,
    next_occurrence = null,
    isActive = true
  }) {
    const ruleId = id || crypto.randomUUID();
    const targetEventId = eventId || event_id || calendarEventId || calendar_event_id;
    const dow = days_of_week || daysOfWeek;
    const dom = day_of_month || dayOfMonth;
    const moy = month_of_year || monthOfYear;
    const ed = end_date || endDate;
    const maxOcc = max_occurrences || maxOccurrences;
    const nextOcc = next_occurrence || nextOccurrence;

    await pool.execute(
      `INSERT INTO recurring_rules 
       (id, event_id, frequency, \`interval\`, days_of_week, day_of_month, month_of_year, 
        end_date, max_occurrences, instance_count, next_occurrence, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, NOW(), NOW())`,
      [
        ruleId,
        targetEventId,
        frequency ? frequency.toUpperCase() : 'WEEKLY',
        interval || 1,
        JSON.stringify(dow || []),
        dom,
        moy,
        ed,
        maxOcc,
        nextOcc,
        Boolean(isActive)
      ]
    );

    return ruleId;
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    const fieldMap = {
      frequency: 'frequency',
      interval: '`interval`',
      days_of_week: 'days_of_week',
      daysOfWeek: 'days_of_week',
      day_of_month: 'day_of_month',
      dayOfMonth: 'day_of_month',
      month_of_year: 'month_of_year',
      monthOfYear: 'month_of_year',
      end_date: 'end_date',
      endDate: 'end_date',
      max_occurrences: 'max_occurrences',
      maxOccurrences: 'max_occurrences',
      instance_count: 'instance_count',
      next_occurrence: 'next_occurrence',
      nextOccurrence: 'next_occurrence',
      is_active: 'is_active',
      isActive: 'is_active',
    };

    for (const [key, value] of Object.entries(updates)) {
      const dbField = fieldMap[key];
      if (!dbField) continue;
      queryParts.push(`${dbField} = ?`);

      if (key === 'days_of_week' || key === 'daysOfWeek') {
        values.push(JSON.stringify(value || []));
      } else if (key === 'is_active' || key === 'isActive') {
        values.push(Boolean(value));
      } else if (key === 'frequency') {
        values.push(value.toUpperCase());
      } else {
        values.push(value);
      }
    }

    if (queryParts.length === 0) return;
    queryParts.push('updated_at = NOW()');
    values.push(id);
    await pool.execute(`UPDATE recurring_rules SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM recurring_rules WHERE id = ?', [id]);
  }

  static async deleteByEventId(eventId) {
    await pool.execute('DELETE FROM recurring_rules WHERE event_id = ?', [eventId]);
  }

  static async deleteByCalendarEventId(eventId) {
    return this.deleteByEventId(eventId);
  }
}
