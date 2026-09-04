import SystemConfig from '../models/SystemConfig.js';

export const csrfProtection = async (req, res, next) => {
  const mutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!mutatingMethods.includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  if (!origin && !referer) {
    return res.status(403).json({ message: 'CSRF Blocked: No Origin or Referer header present.' });
  }

  try {
    let allowedOrigins = await SystemConfig.get('ALLOWED_ORIGINS');
    if (!allowedOrigins) {
      allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
    }

    const checkUrl = origin || (referer ? new URL(referer).origin : null);

    if (!checkUrl || !allowedOrigins.includes(checkUrl)) {
      return res.status(403).json({ message: `CSRF Blocked: Request origin '${checkUrl}' is not in the allowed list.` });
    }

    next();
  } catch (error) {
    console.error('CSRF validation error:', error);
    res.status(500).json({ message: 'Internal server error during CSRF validation.' });
  }
};
