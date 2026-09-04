export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
    }

    next();
  };
};

export const requireLeadOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  // SUPER_ADMIN and ADMIN have full access
  if (['SUPER_ADMIN', 'ADMIN'].includes(req.user.role)) {
    return next();
  }

  // SALES PM etc. can proceed, but the controller will filter or verify record ownership
  next();
};
