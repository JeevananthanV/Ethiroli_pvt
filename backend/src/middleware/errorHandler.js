import { AppError } from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const userId = req.user?.id || null;
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const route = req.originalUrl || req.url;

  const logMeta = {
    timestamp,
    level: 'error',
    message: err.message || 'Unhandled server error',
    userId,
    ip,
    route,
    method: req.method,
    ...(err.details && { details: err.details }),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  };

  console.error(JSON.stringify(logMeta));

  if (err instanceof AppError) {
    const response = {
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }),
      code: err.code || 'APP_ERROR'
    };
    return res.status(err.statusCode).json(response);
  }

  const statusCode = err.status || err.statusCode || 500;
  // Never leak raw DB/SQL error messages, table names, or database identifiers to clients.
  const isSqlError = Boolean(err.code && (String(err.code).startsWith('ER_') || err.sqlState || err.sql || /Table '.*' doesn't exist/i.test(err.message || '')));
  const isProd = process.env.NODE_ENV === 'production' || isSqlError;
  const message = isProd
    ? (isSqlError ? 'A database operation failed. Please contact the administrator.' : 'Internal server error')
    : (err.message || 'Internal server error');

  const response = {
    success: false,
    message,
    ...(err.details && !isSqlError && { details: err.details }),
    code: isSqlError ? 'DATABASE_ERROR' : (err.code || 'INTERNAL_ERROR')
  };

  return res.status(statusCode).json(response);
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
