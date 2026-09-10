import { AuthenticationError, AuthorizationError } from '../utils/errors.js';
import { PORTAL_CONFIGS, getPortalConfigBySlug } from '../config/constants.js';
import Session from '../models/Session.js';
import User from '../models/User.js';

export const portalAuth = async (req, res, next) => {
  try {
    const portalSlug = req.headers['x-portal'];

    if (!portalSlug) {
      throw new AuthenticationError('X-Portal header is required.');
    }

    const portalConfig = getPortalConfigBySlug(portalSlug);
    if (!portalConfig) {
      throw new AuthenticationError('Invalid portal.');
    }

    const token = req.cookies?.session_token;
    if (!token) {
      throw new AuthenticationError('Session token required.');
    }

    const session = await Session.findByToken(token);
    if (!session || session.expires_at < new Date()) {
      throw new AuthenticationError('Invalid or expired session.');
    }

    if (session.portal_slug !== portalSlug) {
      throw new AuthenticationError('Session is not valid for this portal.');
    }

    const user = await User.findById(session.user_id);
    if (!user) {
      throw new AuthenticationError('User not found.');
    }

    req.user = user;
    req.portal = portalSlug;
    req.session = session;
    req.portalConfig = portalConfig;

    next();
  } catch (error) {
    next(error);
  }
};
