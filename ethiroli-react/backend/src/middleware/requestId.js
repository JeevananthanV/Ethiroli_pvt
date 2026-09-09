/**
 * Generates a unique request ID for each incoming HTTP request.
 * Adds X-Request-ID to response headers and makes it available on req for tracing.
 */

let counter = 0;

/**
 * Generates a unique request ID using timestamp, random, and an incrementing counter.
 * @returns {string} Unique request ID
 */
const generateRequestId = () => {
  const now = Date.now();
  const randomPart = Math.random().toString(36).slice(2, 10);
  counter = (counter + 1) % 10000;
  return `req_${now}_${randomPart}_${String(counter).padStart(4, '0')}`;
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
