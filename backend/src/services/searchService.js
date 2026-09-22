import pool from '../config/database.js';
import { logger } from '../config/logger.js';

export const search = async (query, filters = {}) => {
  logger.info('Searching entities', { query, filters });

  const results = {
    leads: [],
    users: [],
    courses: [],
    jobs: [],
    clients: []
  };

  try {
    if (filters.entities?.includes('leads') || !filters.entities) {
      const [leadRows] = await pool.execute(
        `SELECT id, name, email, phone, status, source, assigned_to, created_at
         FROM leads
         WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR notes LIKE ?
         LIMIT 20`,
        [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
      );
      results.leads = leadRows;
    }

    if (filters.entities?.includes('users') || !filters.entities) {
      const [userRows] = await pool.execute(
        `SELECT id, email, full_name, role, is_active, created_at
         FROM users
         WHERE email LIKE ? OR full_name LIKE ?
         LIMIT 20`,
        [`%${query}%`, `%${query}%`]
      );
      results.users = userRows;
    }

    if (filters.entities?.includes('courses') || !filters.entities) {
      const [courseRows] = await pool.execute(
        `SELECT id, title, description, category, level, price, created_at
         FROM courses
         WHERE title LIKE ? OR description LIKE ?
         LIMIT 20`,
        [`%${query}%`, `%${query}%`]
      );
      results.courses = courseRows;
    }

    if (filters.entities?.includes('jobs') || !filters.entities) {
      const [jobRows] = await pool.execute(
        `SELECT id, title, description, location, type, status, created_at
         FROM jobs
         WHERE title LIKE ? OR description LIKE ? OR location LIKE ?
         LIMIT 20`,
        [`%${query}%`, `%${query}%`, `%${query}%`]
      );
      results.jobs = jobRows;
    }

    if (filters.entities?.includes('clients') || !filters.entities) {
      const [clientRows] = await pool.execute(
        `SELECT id, name, email, phone, company, status, created_at
         FROM clients
         WHERE name LIKE ? OR email LIKE ? OR company LIKE ?
         LIMIT 20`,
        [`%${query}%`, `%${query}%`, `%${query}%`]
      );
      results.clients = clientRows;
    }

    const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

    logger.info('Search completed', { query, totalResults });

    return {
      success: true,
      query,
      results,
      total: totalResults
    };
  } catch (error) {
    logger.error('Search failed', { query, error: error.message });
    throw error;
  }
};

export const indexEntity = async (entityType, entityId, data) => {
  logger.info('Indexing entity', { entityType, entityId });

  try {
    if (entityType === 'leads') {
      await pool.execute(
        `INSERT INTO leads (id, name, email, phone, source, status, assigned_to, notes, follow_up_date, created_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), phone = VALUES(phone), notes = VALUES(notes)`,
        [
          entityId,
          data.name,
          data.email,
          data.phone,
          data.source || 'OTHER',
          data.status || 'NEW',
          data.assigned_to || null,
          data.notes || null,
          data.follow_up_date || null,
          data.created_by || null
        ]
      );
    } else if (entityType === 'courses') {
      await pool.execute(
        `INSERT INTO courses (id, title, description, category, level, price, created_at)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), price = VALUES(price)`,
        [entityId, data.title, data.description, data.category, data.level, data.price]
      );
    } else if (entityType === 'jobs') {
      await pool.execute(
        `INSERT INTO jobs (id, title, description, location, type, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), status = VALUES(status)`,
        [entityId, data.title, data.description, data.location, data.type, data.status || 'OPEN']
      );
    }

    logger.info('Entity indexed', { entityType, entityId });
    return { success: true, entityType, entityId };
  } catch (error) {
    logger.error('Entity indexing failed', { entityType, entityId, error: error.message });
    throw error;
  }
};
