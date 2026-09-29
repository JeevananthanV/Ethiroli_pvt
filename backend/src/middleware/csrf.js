import { AppError, AuthorizationError } from '../utils/errors.js';
import { ALLOWED_ORIGINS as DEFAULT_ALLOWED_ORIGINS } from '../config/constants.js';

const envOrigins = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const ALLOWED_ORIGINS = envOrigins.length > 0 ? envOrigins : DEFAULT_ALLOWED_ORIGINS;

const isAllowedOrigin = (value) => {
  if (!value) return false;
  if (ALLOWED_ORIGINS.includes(value)) return true;
  try {
    const { hostname } = new URL(value);
    if (['localhost', '127.0.0.1', '::1'].includes(hostname)) return true;
    if (hostname === 'ethiroli.net' || hostname.endsWith('.ethiroli.net')) return true;
    if (hostname.endsWith('.hostingersite.com') || hostname.endsWith('.hostinger.com')) return true;
  } catch {
    return false;
  }
  return false;
};

export const csrfProtection = (req, res, next) => {
  const mutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!mutatingMethods.includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // In development, allow server-to-server or curl/Postman requests without Origin/Referer
  if (process.env.NODE_ENV === 'development' && !origin && !referer) {
    return next();
  }

  if (ALLOWED_ORIGINS.length === 0) {
    return next(new AuthorizationError('CSRF Blocked: ALLOWED_ORIGINS is not configured.'));
  }

  if (!origin && !referer) {
    return next(new AuthorizationError('CSRF Blocked: No Origin or Referer header present.'));
  }

  const checkUrl = origin || (referer ? new URL(referer).origin : null);

  if (!checkUrl || !isAllowedOrigin(checkUrl)) {
    return next(new AuthorizationError(
      `CSRF Blocked: Request origin '${checkUrl}' is not in the allowed list.`,
      { allowedOrigins: ALLOWED_ORIGINS, receivedOrigin: checkUrl }
    ));
  }

  next();
};
