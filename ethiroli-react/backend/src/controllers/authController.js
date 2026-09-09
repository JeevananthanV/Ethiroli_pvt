import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../models/User.js';
import Session from '../models/Session.js';
import AuditLog from '../models/AuditLog.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { AuthenticationError, AuthorizationError, ValidationError } from '../utils/errors.js';
import { ROLES } from '../config/constants.js';

const PORTAL_COOKIE_CONFIG = {
  ADMIN: { path: '/app/admin', sameSite: 'lax' },
  SUPER_ADMIN: { path: '/app/super-admin', sameSite: 'strict' },
  HR: { path: '/app/hr', sameSite: 'lax' },
  TUTOR: { path: '/app/tutor', sameSite: 'lax' },
  PROJECT_MANAGER: { path: '/app/pm', sameSite: 'lax' },
  FINANCE: { path: '/app/finance', sameSite: 'lax' },
  SALES: { path: '/app/sales', sameSite: 'lax' },
  RECEPTION: { path: '/app/reception', sameSite: 'lax' },
  EMPLOYEE: { path: '/app/employee', sameSite: 'lax' },
  STUDENT: { path: '/app/student', sameSite: 'lax' },
  INTERN: { path: '/app/intern', sameSite: 'lax' },
};

const getCookieConfig = (role) => {
  const base = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };
  const portal = PORTAL_COOKIE_CONFIG[role];
  if (portal) {
    return { ...base, ...portal };
  }
  return { ...base, path: '/', sameSite: 'lax' };
};

const resolveExpectedRole = (portal) => {
  if (!portal) return null;
  const normalized = String(portal).trim().toUpperCase();
  return Object.values(ROLES).includes(normalized) ? normalized : null;
};

export const login = asyncHandler(async (req, res) => {
  const { email, password, portal } = req.body;

  const expectedRole = resolveExpectedRole(portal);

  const user = await User.findByEmail(email);
  if (!user) {
    throw new AuthenticationError('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new AuthenticationError('Invalid email or password.');
  }

  if (expectedRole && user.role !== expectedRole && user.role !== ROLES.SUPER_ADMIN) {
    throw new AuthorizationError(`Access denied. This portal is for ${expectedRole} users only.`);
  }

  await Session.deleteByUserId(user.id);

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await Session.create({
    user_id: user.id,
    token,
    expires_at: expiresAt,
    user_agent: req.headers['user-agent'],
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown'
  });

  await User.update(user.id, { last_login_at: new Date() });

  const cookieConfig = getCookieConfig(user.role);
  res.cookie('session_token', token, {
    ...cookieConfig,
    expires: expiresAt
  });

  await AuditLog.create({
    user_id: user.id,
    action: 'LOGIN',
    entity_type: 'USER',
    entity_id: user.id,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  const { password_hash, ...safeUser } = user;
  return success(res, 200, { user: safeUser, socket_token: token }, 'Login successful');
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.session_token || req.sessionToken;
  if (token) {
    await Session.deleteByToken(token);
  }
  res.clearCookie('session_token');
  return success(res, 200, null, 'Logged out successfully');
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AuthenticationError('User not found.');
  }
  const { password_hash, ...safeUser } = user;
  return success(res, 200, { user: safeUser });
});
