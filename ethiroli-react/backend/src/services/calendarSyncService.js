import { logger } from '../config/logger.js';
import pool from '../config/database.js';

export const createEvent = async (event) => {
  logger.info('Creating calendar event', { event });

  try {
    const [result] = await pool.execute(
      `INSERT INTO calendar_events (title, description, start_time, end_time, user_id, created_by, provider, external_id, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event.title,
        event.description || null,
        event.start_time || event.start,
        event.end_time || event.end,
        event.user_id,
        event.created_by || event.user_id,
        event.provider || 'internal',
        event.external_id || null,
        event.metadata ? JSON.stringify(event.metadata) : null
      ]
    );

    return { success: true, eventId: result.insertId };
  } catch (error) {
    logger.error('Failed to create calendar event', { error: error.message, event });
    throw error;
  }
};

export const updateEvent = async (eventId, updates) => {
  logger.info('Updating calendar event', { eventId, updates });

  try {
    const queryParts = [];
    const values = [];

    const updatableFields = ['title', 'description', 'start_time', 'end_time', 'status', 'metadata'];
    for (const field of updatableFields) {
      if (updates[field] !== undefined) {
        queryParts.push(`${field} = ?`);
        values.push(field === 'metadata' ? JSON.stringify(updates[field]) : updates[field]);
      }
    }

    if (queryParts.length === 0) {
      return { success: true, message: 'No updates provided' };
    }

    values.push(eventId);
    await pool.execute(`UPDATE calendar_events SET ${queryParts.join(', ')} WHERE id = ?`, values);

    return { success: true, eventId };
  } catch (error) {
    logger.error('Failed to update calendar event', { eventId, error: error.message });
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  logger.info('Deleting calendar event', { eventId });

  try {
    await pool.execute('DELETE FROM calendar_events WHERE id = ?', [eventId]);
    return { success: true, eventId };
  } catch (error) {
    logger.error('Failed to delete calendar event', { eventId, error: error.message });
    throw error;
  }
};

export const listEvents = async (user_id, start, end, { limit = 50, offset = 0 } = {}) => {
  logger.info('Listing calendar events', { user_id, start, end });

  try {
    let query = 'SELECT * FROM calendar_events WHERE 1=1';
    const values = [];

    if (user_id) {
      query += ' AND user_id = ?';
      values.push(user_id);
    }

    if (start) {
      query += ' AND start_time >= ?';
      values.push(start);
    }

    if (end) {
      query += ' AND end_time <= ?';
      values.push(end);
    }

    query += ' ORDER BY start_time ASC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    const [rows] = await pool.execute(query, values);
    return { success: true, data: rows, total: rows.length };
  } catch (error) {
    logger.error('Failed to list calendar events', { user_id, error: error.message });
    throw error;
  }
};
