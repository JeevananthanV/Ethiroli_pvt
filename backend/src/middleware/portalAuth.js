import { AuthenticationError } from '../utils/errors.js';
import { getPortalConfigBySlug } from '../config/constants.js';

export const portalAuth = async (req, res, next) => {
  try {
    const portalSlug = req.headers['x-portal'] || req.body?.portal || req.query?.portal;

    if (!portalSlug) {
      throw new AuthenticationError('X-Portal header is required.');
    }

    const portalConfig = getPortalConfigBySlug(portalSlug);
    if (!portalConfig) {
      throw new AuthenticationError('Invalid portal.');
    }

    req.portal = portalSlug;
    req.portalConfig = portalConfig;

    next();
  } catch (error) {
    next(error);
  }
};
