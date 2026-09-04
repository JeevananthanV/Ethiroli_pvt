import Session from '../models/Session.js';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  const token = req.cookies?.session_token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. No session token provided.' });
  }

  try {
    const sessionRecord = await Session.findByToken(token);
    if (!sessionRecord) {
      res.clearCookie('session_token');
      return res.status(401).json({ message: 'Invalid or expired session.' });
    }

    if (!sessionRecord.is_active) {
      res.clearCookie('session_token');
      return res.status(403).json({ message: 'User account is deactivated.' });
    }

    req.user = {
      id: sessionRecord.user_id,
      email: sessionRecord.email,
      full_name: sessionRecord.full_name,
      role: sessionRecord.role,
    };
    req.sessionToken = token;

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ message: 'Internal server error during authentication.' });
  }
};
