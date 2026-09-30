import { AppError, AuthenticationError, AuthorizationError } from '../utils/errors.js';
import Session from '../models/Session.js';
import TenantUser from '../models/TenantUser.js';
import { ERROR_MESSAGES } from '../config/constants.js';
import { getRedisClient } from '../config/redis.js';
import { logger } from '../config/logger.js';

const SESSION_CACHE_PREFIX = 'session:';
const SESSION_CACHE_TTL = 30 * 60; // 30 minutes in seconds

const getRedisSession = async (token) => {
  try {
    const redis = getRedisClient();
    if (!redis) {
      logger.debug('Redis client unavailable, skipping cache lookup', { token: token.slice(0, 8) + '...' });
      return null;
    }

    const key = `${SESSION_CACHE_PREFIX}${token}`;
    const cached = await redis.get(key);

    if (cached) {
      logger.info('Session cache hit', { token: token.slice(0, 8) + '...' });
      const sessionData = JSON.parse(cached);
      // Refresh TTL on cache hit (sliding expiration)
      await redis.expire(key, SESSION_CACHE_TTL).catch((err) => {
        logger.warn('Failed to refresh session cache TTL', { error: err.message });
      });
      return sessionData;
    }

    logger.info('Session cache miss, falling back to MySQL', { token: token.slice(0, 8) + '...' });
    return null;
  } catch (error) {
    logger.warn('Redis session lookup failed, falling back to MySQL', { error: error.message });
    return null;
  }
};

const setRedisSession = async (token, sessionData) => {
  try {
    const redis = getRedisClient();
    if (!redis) {
      logger.debug('Redis client unavailable, skipping cache write', { token: token.slice(0, 8) + '...' });
      return;
    }

    const key = `${SESSION_CACHE_PREFIX}${token}`;
    await redis.setex(key, SESSION_CACHE_TTL, JSON.stringify(sessionData));
    logger.info('Session cached in Redis', { token: token.slice(0, 8) + '...' });
  } catch (error) {
    logger.warn('Failed to cache session in Redis', { error: error.message });
  }
};

export const lookupSession = async (token) => {
  // Try Redis cache first
  const cachedSession = await getRedisSession(token);
  if (cachedSession) {
    return cachedSession;
  }

  // Fall back to MySQL
  const sessionRecord = await Session.findByToken(token);

  if (sessionRecord) {
    // Populate Redis cache on MySQL hit
    await setRedisSession(token, sessionRecord);
  }

  return sessionRecord;
};

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : null;
    const token = req.cookies?.session_token || bearerToken || req.headers['x-session-token'];

    if (!token) {
      return next(new AuthenticationError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED));
    }

    const sessionRecord = await lookupSession(token);

    if (!sessionRecord) {
      res.clearCookie('session_token');
      return next(new AuthenticationError(ERROR_MESSAGES.SESSION_EXPIRED));
    }

    if (!sessionRecord.is_active) {
      res.clearCookie('session_token');
      return next(new AuthorizationError(ERROR_MESSAGES.ACCOUNT_DEACTIVATED, { code: 'ACCOUNT_DEACTIVATED' }));
    }

    req.user = {
      id: sessionRecord.user_id,
      email: sessionRecord.email,
      full_name: sessionRecord.full_name,
      role: sessionRecord.role,
      is_active: sessionRecord.is_active,
      avatar_url: sessionRecord.avatar_url || null,
      tenant_id: sessionRecord.tenant_id || null,
      tenant_role: sessionRecord.tenant_role || null,
      impersonated_by: sessionRecord.impersonated_by || null,
      impersonated_by_name: sessionRecord.impersonated_by_name || null,
      impersonated_by_role: sessionRecord.impersonator_role || null,
      impersonation_origin_token: sessionRecord.impersonation_origin_token || null
    };
    req.portal = sessionRecord.portal_slug || 'app';
    req.sessionToken = token;
    req.clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AuthenticationError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED, { original: error.message }));
    }
  }
};
