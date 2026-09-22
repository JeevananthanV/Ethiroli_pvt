/**
 * API Versioning Middleware
 * - Adds X-API-Version header to all responses
 * - Detects API version from URL path (e.g. /api/v1/...)
 * - Logs usage of deprecated API versions
 */

const CURRENT_API_VERSION = 'v1';
const DEPRECATED_VERSIONS = [];

/**
 * Extracts the API version from the request URL.
 * @param {string} url - Request URL
 * @returns {string|null} Detected version string or null
 */
const extractVersion = (url) => {
  const match = url.match(/\/api\/(v\d+)\//);
  return match ? match[1] : null;
};

/**
 * API versioning middleware.
 * Populates req.apiVersion, sets X-API-Version response header, and logs deprecated versions.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
const apiVersioning = (req, res, next) => {
  const detectedVersion = extractVersion(req.originalUrl || req.url) || CURRENT_API_VERSION;

  req.apiVersion = detectedVersion;
  res.setHeader('X-API-Version', detectedVersion);

  if (DEPRECATED_VERSIONS.includes(detectedVersion)) {
    console.warn(
      JSON.stringify({
        level: 'warn',
        message: 'Deprecated API version accessed',
        version: detectedVersion,
        path: req.originalUrl || req.url,
        method: req.method,
        requestId: req.requestId || null
      })
    );
  }

  next();
};

export default apiVersioning;
