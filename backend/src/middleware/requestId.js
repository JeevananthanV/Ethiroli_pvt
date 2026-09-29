import { randomUUID } from 'crypto';

/**
 * Generates a unique request ID for each incoming HTTP request.
 * Adds X-Request-ID to response headers and makes it available on req for tracing.
 */

/**
 * Generates a unique request ID using crypto.randomUUID().
 * @returns {string} Unique request ID
 */
const generateRequestId = () => {
  return randomUUID();
};

/**
 * Request ID middleware.
 * Generates a unique request ID, attaches it to req, and adds it to response headers.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
const requestId = (req, res, next) => {
  const requestId = generateRequestId();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};

export default requestId;
