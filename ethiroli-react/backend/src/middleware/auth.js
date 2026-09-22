import { AppError, AuthenticationError, AuthorizationError } from '../utils/errors.js';
import Session from '../models/Session.js';
import TenantUser from '../models/TenantUser.js';
import { ERROR_MESSAGES } from '../config/constants.js';

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

    const sessionRecord = await Session.findByToken(token);

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
      tenant_id: sessionRecord.tenant_id || null,
      tenant_role: sessionRecord.tenant_role || null
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
