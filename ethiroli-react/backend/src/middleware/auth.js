import { AppError, AuthenticationError, AuthorizationError } from '../utils/errors.js';
import Session from '../models/Session.js';
import TenantUser from '../models/TenantUser.js';
import { ERROR_MESSAGES } from '../config/constants.js';

export const authenticate = async (req, res, next) => {
  const token = req.cookies?.session_token;

  if (!token) {
    throw new AuthenticationError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED);
  }

  try {
    const sessionRecord = await Session.findByToken(token);

    if (!sessionRecord) {
      res.clearCookie('session_token');
      throw new AuthenticationError(ERROR_MESSAGES.SESSION_EXPIRED);
    }

    if (!sessionRecord.is_active) {
      res.clearCookie('session_token');
      throw new AuthorizationError(ERROR_MESSAGES.ACCOUNT_DEACTIVATED, { code: 'ACCOUNT_DEACTIVATED' });
    }

    req.user = {
      id: sessionRecord.user_id,
      email: sessionRecord.email,
      full_name: sessionRecord.full_name,
      role: sessionRecord.role,
      is_active: sessionRecord.is_active,
      tenant_id: sessionRecord.tenant_id || null,
      tenant_role: sessionRecord.tenant_role || null
    };
    req.portal = sessionRecord.portal_slug || 'app';
    req.sessionToken = token;
    req.ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AuthenticationError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED, { original: error.message }));
    }
  }
};
