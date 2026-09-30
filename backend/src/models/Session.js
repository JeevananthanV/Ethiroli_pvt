import pool from '../config/database.js';
import { getRedisClient } from '../config/redis.js';
import { logger } from '../config/logger.js';

const SESSION_CACHE_PREFIX = 'session:';
const SESSION_CACHE_TTL = 30 * 60; // 30 minutes in seconds

const getSessionCacheKey = (token) => `${SESSION_CACHE_PREFIX}${token}`;

export default class Session {
  static format(row) {
    if (!row) return null;
    return row;
  }

  static async findByTokenRedis(token) {
    try {
      const redis = getRedisClient();
      if (!redis || redis.status !== 'ready') {
        return null;
      }

      const key = getSessionCacheKey(token);
      const cached = await redis.get(key);

      if (cached) {
        logger.info('Session cache hit', { token: token.slice(0, 8) + '...' });
        const sessionData = JSON.parse(cached);
        await redis.expire(key, SESSION_CACHE_TTL).catch((err) => {
          logger.warn('Failed to refresh session cache TTL', { error: err.message });
        });
        return sessionData;
      }

      logger.info('Session cache miss', { token: token.slice(0, 8) + '...' });
      return null;
    } catch (error) {
      logger.warn('Redis session lookup failed', { error: error.message });
      return null;
    }
  }

  static async setSessionRedis(session) {
    try {
      const redis = getRedisClient();
      if (!redis || redis.status !== 'ready') {
        return;
      }

      const key = getSessionCacheKey(session.token);
      await redis.setex(key, SESSION_CACHE_TTL, JSON.stringify(session));
      logger.info('Session cached in Redis', { session_id: session.id });
    } catch (error) {
      logger.warn('Failed to cache session in Redis', { error: error.message });
    }
  }

  static async deleteSessionRedis(token) {
    try {
      const redis = getRedisClient();
      if (!redis || redis.status !== 'ready') {
        return;
      }

      const key = getSessionCacheKey(token);
      await redis.del(key);
      logger.info('Session cache deleted', { token: token.slice(0, 8) + '...' });
    } catch (error) {
      logger.warn('Failed to delete session cache in Redis', { error: error.message });
    }
  }

  static async refreshSessionTTL(token) {
    try {
      const redis = getRedisClient();
      if (!redis) {
        logger.debug('Redis client unavailable, skipping TTL refresh', { token: token.slice(0, 8) + '...' });
        return;
      }

      const key = getSessionCacheKey(token);
      await redis.expire(key, SESSION_CACHE_TTL);
      logger.info('Session cache TTL refreshed', { token: token.slice(0, 8) + '...' });
    } catch (error) {
      logger.warn('Failed to refresh session cache TTL', { error: error.message });
    }
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM sessions WHERE id = ?', [id]);
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async findByToken(token) {
    const [rows] = await pool.execute(
      `SELECT s.*, u.role, u.email, u.full_name, u.is_active, u.avatar_url,
              tu.tenant_id, tu.tenant_role,
              im.role AS impersonator_role,
              im.full_name AS impersonated_by_name
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN tenant_users tu ON tu.user_id = u.id AND tu.is_primary = 1
       LEFT JOIN users im ON s.impersonated_by = im.id
       WHERE s.token = ? AND s.expires_at > CURRENT_TIMESTAMP`,
      [token]
    );
    return rows.length > 0 ? this.format(rows[0]) : null;
  }

  static async create({ user_id, token, expires_at, user_agent = null, ip_address = null, portal_slug = 'app', impersonated_by = null, impersonation_origin_token = null }) {
    await pool.execute(
      `INSERT INTO sessions (user_id, token, portal_slug, expires_at, user_agent, ip_address, impersonated_by, impersonation_origin_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, token, portal_slug, expires_at, user_agent, ip_address, impersonated_by, impersonation_origin_token]
    );
  }

  static async update(id, updates) {
    const queryParts = [];
    const values = [];

    if (updates.expires_at !== undefined) { queryParts.push('expires_at = ?'); values.push(updates.expires_at); }
    if (updates.user_agent !== undefined) { queryParts.push('user_agent = ?'); values.push(updates.user_agent); }
    if (updates.ip_address !== undefined) { queryParts.push('ip_address = ?'); values.push(updates.ip_address); }

    if (queryParts.length === 0) return;
    values.push(id);
    await pool.execute(`UPDATE sessions SET ${queryParts.join(', ')} WHERE id = ?`, values);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM sessions WHERE id = ?', [id]);
  }

  static async deleteByToken(token) {
    await pool.execute('DELETE FROM sessions WHERE token = ?', [token]);
  }

  static async deleteByUserId(user_id) {
    await pool.execute('DELETE FROM sessions WHERE user_id = ?', [user_id]);
  }

  static async list({ user_id } = {}) {
    let query = 'SELECT * FROM sessions WHERE 1=1';
    const values = [];

    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }

    query += ' ORDER BY created_at DESC LIMIT 100';
    const [rows] = await pool.execute(query, values);
    return rows.map(row => this.format(row));
  }

  static async count({ user_id } = {}) {
    let query = 'SELECT COUNT(*) as total FROM sessions WHERE 1=1';
    const values = [];

    if (user_id) { query += ' AND user_id = ?'; values.push(user_id); }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }
}
