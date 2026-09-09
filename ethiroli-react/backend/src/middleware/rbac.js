import { AuthorizationError } from '../utils/errors.js';

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AuthorizationError('Authentication required.');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AuthorizationError(
        `Forbidden. Role '${req.user.role}' is not authorized.`,
        { allowedRoles, currentRole: req.user.role }
      );
    }

    next();
  };
};

export const requireLeadOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    throw new AuthorizationError('Authentication required.');
  }

  const allowedRoles = ['SUPER_ADMIN', 'ADMIN'];
  if (allowedRoles.includes(req.user.role)) {
    return next();
  }

  throw new AuthorizationError(
    'Forbidden. You must be an ADMIN or the lead owner to perform this action.',
    { requiredRoles: allowedRoles }
  );
};
