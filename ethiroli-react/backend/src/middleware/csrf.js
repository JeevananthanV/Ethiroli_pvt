import { AppError, AuthorizationError } from '../utils/errors.js';

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

export const csrfProtection = async (req, res, next) => {
  const mutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!mutatingMethods.includes(req.method)) {
    return next();
  }

  if (ALLOWED_ORIGINS.length === 0) {
    if (process.env.NODE_ENV === 'production') {
      throw new AuthorizationError('CSRF Blocked: ALLOWED_ORIGINS is not configured.');
    }
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  if (!origin && !referer) {
    throw new AuthorizationError('CSRF Blocked: No Origin or Referer header present.');
  }

  const checkUrl = origin || (referer ? new URL(referer).origin : null);

  if (!checkUrl || !ALLOWED_ORIGINS.includes(checkUrl)) {
    throw new AuthorizationError(
      `CSRF Blocked: Request origin '${checkUrl}' is not in the allowed list.`,
      { allowedOrigins: ALLOWED_ORIGINS, receivedOrigin: checkUrl }
    );
  }

  next();
};
