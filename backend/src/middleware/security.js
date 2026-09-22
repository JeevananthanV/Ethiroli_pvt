import { AppError, AuthorizationError } from '../utils/errors.js';

/**
 * Security headers middleware.
 * Adds standard security headers to all responses.
 */
export const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.removeHeader('X-Powered-By');

  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
};

/**
 * Request logging middleware.
 * Logs method, url, status, and response time.
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.headers['user-agent'] || null,
      ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      userId: req.user?.id || null
    };

    if (res.statusCode >= 500) {
      console.error(JSON.stringify({ ...logData, level: 'error' }));
    } else if (res.statusCode >= 400) {
      console.warn(JSON.stringify({ ...logData, level: 'warn' }));
    } else {
      console.log(JSON.stringify({ ...logData, level: 'info' }));
    }
  });

  next();
};
