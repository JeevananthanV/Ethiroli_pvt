import { RateLimitError } from '../utils/errors.js';
import { logger } from '../config/logger.js';
import { getRedisClient } from '../config/redis.js';

const fallbackStore = new Map();
let cleanupIntervalId = null;

// Initialize cleanup interval for fallback store
if (typeof setInterval !== 'undefined' && cleanupIntervalId === null) {
  cleanupIntervalId = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of fallbackStore.entries()) {
      if (now > record.resetTime) {
        fallbackStore.delete(key);
      }
    }
  }, 60000);
}

/**
 * Builds a rate limit key that incorporates authenticated user ID when available.
 * Falls back to IP-based keying when the request is unauthenticated.
 * @param {import('express').Request} req - Express request
 * @param {string} suffix - Additional path or category suffix
 * @returns {string} Composite rate limit key
 */
const buildRateLimitKey = (req, suffix) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const userId = req.user?.id || req.apiKeyUserId || null;
  const identity = userId ? 'user:' + userId : 'ip:' + ip;
  return identity + ':' + suffix;
};

/**
 * Creates a tiered rate limiter.
 * @param {Object} options - Limiter configuration
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum requests per window
 * @param {string} options.message - Error message on limit exceeded
 * @param {string} options.suffix - Unique suffix for the limiter key
 * @returns {import('express').RequestHandler} Express middleware
 */
export const createLimiter = ({ windowMs, max, message, suffix }) => {
  return async (req, res, next) => {
    const key = buildRateLimitKey(req, suffix || req.path);
    const now = Date.now();

    // Try Redis first
    try {
      const redis = getRedisClient();
      if (!redis || redis.status !== 'ready') {
        throw new Error('Redis not ready, use in-memory limiter');
      }
      const redisKey = 'rate_limit:' + key;
      const count = await redis.incr(redisKey);
      
      // Set expiry on first increment
      if (count === 1) {
        await redis.expire(redisKey, Math.ceil(windowMs / 1000));
      }
      
      const currentCount = Number(count);
      const remaining = Math.max(0, max - currentCount);
      const resetTime = new Date(now + windowMs);
      
      res.setHeader('X-RateLimit-Limit', String(max));
      res.setHeader('X-RateLimit-Remaining', String(remaining));
      res.setHeader('X-RateLimit-Reset', String(Math.ceil(resetTime.getTime() / 1000)));
      
      if (currentCount > max) {
        const retryAfter = Math.ceil((resetTime.getTime() - now) / 1000);
        res.setHeader('Retry-After', String(retryAfter));
        return next(new RateLimitError(message || 'Too many requests, please try again later.'));
      }
      
      return next();
    } catch (redisError) {
      // Redis failed, fall back to in-memory store
      logger.warn('Redis rate limiting failed, falling back to in-memory store', { 
        error: redisError.message,
        key
      });
      
      // Fallback to original in-memory implementation
      let record = fallbackStore.get(key);
      
      if (!record || now > record.resetTime) {
        record = {
          count: 0,
          resetTime: now + windowMs
        };
      }
      
      record.count += 1;
      fallbackStore.set(key, record);
      
      const remaining = Math.max(0, max - record.count);
      const resetTime = new Date(record.resetTime);
      
      res.setHeader('X-RateLimit-Limit', String(max));
      res.setHeader('X-RateLimit-Remaining', String(remaining));
      res.setHeader('X-RateLimit-Reset', String(Math.ceil(resetTime.getTime() / 1000)));
      
      if (record.count > max) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        res.setHeader('Retry-After', String(retryAfter));
        return next(new RateLimitError(message || 'Too many requests, please try again later.'));
      }
      
      next();
    }
  };
};

/**
 * Global API rate limiter. Applied to all /api routes.
 */
export const apiLimiter = createLimiter({
  windowMs: Number(process.env.API_RATE_LIMIT_WINDOW_MS || 60 * 1000),
  max: Number(process.env.API_RATE_LIMIT_MAX || 100),
  message: 'Global API rate limit exceeded. Please slow down.',
  suffix: 'global'
});

/**
 * Login rate limiter. Tighter limit to prevent brute-force attacks.
 */
export const loginLimiter = createLimiter({
  windowMs: Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.LOGIN_RATE_LIMIT_MAX || 5),
  message: 'Too many login attempts. Please try again after 15 minutes.',
  suffix: 'auth:login'
});

/**
 * Write operation rate limiter. Stricter than reads to protect data integrity.
 */
export const writeLimiter = createLimiter({
  windowMs: Number(process.env.WRITE_RATE_LIMIT_WINDOW_MS || 60 * 1000),
  max: Number(process.env.WRITE_RATE_LIMIT_MAX || 30),
  message: 'Too many write requests. Please slow down.',
  suffix: 'write'
});

/**
 * Read operation rate limiter. More lenient than writes for GET-heavy workloads.
 */
export const readLimiter = createLimiter({
  windowMs: Number(process.env.READ_RATE_LIMIT_WINDOW_MS || 60 * 1000),
  max: Number(process.env.READ_RATE_LIMIT_MAX || 200),
  message: 'Too many read requests. Please slow down.',
  suffix: 'read'
});

/**
 * Upload rate limiter. Very strict to prevent abuse of storage resources.
 */
export const uploadLimiter = createLimiter({
  windowMs: Number(process.env.UPLOAD_RATE_LIMIT_WINDOW_MS || 60 * 1000),
  max: Number(process.env.UPLOAD_RATE_LIMIT_MAX || 10),
  message: 'Upload rate limit exceeded. Please try again later.',
  suffix: 'upload'
});
