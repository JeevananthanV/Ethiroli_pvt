import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../models/User.js';
import Session from '../models/Session.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { AuthenticationError, AuthorizationError, ValidationError } from '../utils/errors.js';
import { ROLES, PORTAL_CONFIGS, getPortalConfigBySlug } from '../config/constants.js';
import { isMfaRequiredForRole, validateMfaForLogin } from '../services/mfaService.js';

const PORTAL_COOKIE_CONFIG = {
  SUPER_ADMIN: { path: '/app/super-admin', sameSite: 'strict' },
  ADMIN: { path: '/app/admin', sameSite: 'strict' },
  HR: { path: '/app/hr', sameSite: 'lax' },
  TUTOR: { path: '/app/tutor', sameSite: 'lax' },
  PROJECT_MANAGER: { path: '/app/pm', sameSite: 'lax' },
  FINANCE: { path: '/app/finance', sameSite: 'lax' },
  SALES: { path: '/app/sales', sameSite: 'lax' },
  RECEPTION: { path: '/app/reception', sameSite: 'lax' },
  EMPLOYEE: { path: '/app/employee', sameSite: 'lax' },
  STUDENT: { path: '/app/student', sameSite: 'lax' },
  INTERN: { path: '/app/intern', sameSite: 'lax' },
  CLIENT: { path: '/app/client', sameSite: 'lax' },
  VENDOR: { path: '/app/vendor', sameSite: 'lax' },
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
  const { email, password, mfaToken } = req.body;

  const portalSlug = req.portal || req.body.portal;

  const portalConfig = portalSlug ? getPortalConfigBySlug(portalSlug) : null;
  if (portalSlug && !portalConfig) {
    throw new AuthenticationError('Invalid portal.');
  }

  const user = await User.findByEmail(email);
  if (!user) {
    await AuditLog.create({
      user_id: null,
      action: 'LOGIN_ATTEMPT',
      entity_type: 'AUTH',
      entity_id: null,
      portal_slug: portalSlug || 'unknown',
      ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      user_agent: req.headers['user-agent'],
      metadata: { success: false, failure_reason: 'user_not_found' }
    });
    throw new AuthenticationError('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    await AuditLog.create({
      user_id: user.id,
      action: 'LOGIN_ATTEMPT',
      entity_type: 'AUTH',
      entity_id: user.id,
      portal_slug: portalSlug || 'unknown',
      ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      user_agent: req.headers['user-agent'],
      metadata: { success: false, failure_reason: 'invalid_password' }
    });
    throw new AuthenticationError('Invalid email or password.');
  }

  if (portalConfig && user.role !== portalConfig.role && user.role !== ROLES.SUPER_ADMIN) {
    await AuditLog.create({
      user_id: user.id,
      action: 'LOGIN_ATTEMPT',
      entity_type: 'AUTH',
      entity_id: user.id,
      portal_slug: portalSlug || 'unknown',
      ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      user_agent: req.headers['user-agent'],
      metadata: { success: false, failure_reason: 'role_mismatch', expected_role: portalConfig.role, actual_role: user.role }
    });
    throw new AuthorizationError(`Access denied. This portal is for ${portalConfig.role} users only.`);
  }

  if (isMfaRequiredForRole(user.role) && !mfaToken) {
    await AuditLog.create({
      user_id: user.id,
      action: 'MFA_REQUIRED',
      entity_type: 'AUTH',
      entity_id: user.id,
      portal_slug: portalSlug || 'unknown',
      ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      user_agent: req.headers['user-agent'],
      metadata: { success: false, failure_reason: 'mfa_required' }
    });
    return res.status(200).json({
      success: false,
      requiresMfa: true,
      message: 'MFA code required.'
    });
  }

  if (mfaToken) {
    try {
      await validateMfaForLogin(user.id, mfaToken);
    } catch (mfaError) {
      return res.status(200).json({
        success: false,
        requiresMfa: true,
        message: mfaError.message || 'Invalid MFA code.'
      });
    }
  }

  await Session.deleteByUserId(user.id);

  const token = crypto.randomBytes(32).toString('hex');
  const sessionDuration = portalConfig ? portalConfig.sessionDuration : 24 * 60 * 60;
  const expiresAt = new Date(Date.now() + sessionDuration * 1000);

  await Session.create({
    user_id: user.id,
    token,
    portal_slug: portalSlug || PORTAL_CONFIGS[user.role]?.slug || 'app',
    expires_at: expiresAt,
    user_agent: req.headers['user-agent'],
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown'
  });

  await User.update(user.id, { last_login_at: new Date() });

  const cookiePath = portalConfig ? portalConfig.cookiePath : (PORTAL_COOKIE_CONFIG[user.role]?.path || '/');
  const cookieSameSite = portalConfig ? 'lax' : (PORTAL_COOKIE_CONFIG[user.role]?.sameSite || 'lax');

  res.cookie('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: cookieSameSite,
    path: cookiePath,
    expires: expiresAt
  });

  await AuditLog.create({
    user_id: user.id,
    action: 'LOGIN',
    entity_type: 'USER',
    entity_id: user.id,
    portal_slug: portalSlug || PORTAL_CONFIGS[user.role]?.slug || 'app',
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent'],
    metadata: { success: true, strategy: 'password', mfa_used: !!mfaToken, portal: portalSlug }
  });

  const { password_hash, ...safeUser } = user;
  broadcastToRole('ADMIN', 'user_logged_in', { user_id: user.id });
  return success(res, 200, { user: safeUser, socket_token: token, activePortal: portalSlug || PORTAL_CONFIGS[user.role]?.slug || 'app' }, 'Login successful');
});

export const verifyMfa = asyncHandler(async (req, res) => {
  const { email, mfaToken } = req.body;

  if (!email || !mfaToken) {
    throw new ValidationError('Email and MFA code are required.');
  }

  const user = await User.findByEmail(email);
  if (!user) {
    throw new AuthenticationError('Invalid email or MFA code.');
  }

  const portalSlug = req.portal || req.body.portal;
  const portalConfig = portalSlug ? getPortalConfigBySlug(portalSlug) : null;
  if (portalConfig && user.role !== portalConfig.role && user.role !== ROLES.SUPER_ADMIN) {
    throw new AuthorizationError(`Access denied. This portal is for ${portalConfig.role} users only.`);
  }

  try {
    await validateMfaForLogin(user.id, mfaToken);
  } catch (mfaError) {
    throw new AuthenticationError(mfaError.message || 'Invalid MFA code.');
  }

  await Session.deleteByUserId(user.id);

  const token = crypto.randomBytes(32).toString('hex');
  const sessionDuration = portalConfig ? portalConfig.sessionDuration : 24 * 60 * 60;
  const expiresAt = new Date(Date.now() + sessionDuration * 1000);
  const resolvedPortalSlug = portalSlug || PORTAL_CONFIGS[user.role]?.slug || 'app';

  await Session.create({
    user_id: user.id,
    token,
    portal_slug: resolvedPortalSlug,
    expires_at: expiresAt,
    user_agent: req.headers['user-agent'],
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown'
  });

  await User.update(user.id, { last_login_at: new Date() });

  const cookiePath = portalConfig ? portalConfig.cookiePath : (PORTAL_COOKIE_CONFIG[user.role]?.path || '/');
  const cookieSameSite = portalConfig ? 'lax' : (PORTAL_COOKIE_CONFIG[user.role]?.sameSite || 'lax');

  res.cookie('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: cookieSameSite,
    path: cookiePath,
    expires: expiresAt
  });

  await AuditLog.create({
    user_id: user.id,
    action: 'LOGIN',
    entity_type: 'USER',
    entity_id: user.id,
    portal_slug: resolvedPortalSlug,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent'],
    metadata: { success: true, strategy: 'password+mfa', mfa_used: true, portal: portalSlug }
  });

  const { password_hash, ...safeUser } = user;
  broadcastToRole('ADMIN', 'user_logged_in', { user_id: user.id });
  return success(res, 200, { user: safeUser, socket_token: token, activePortal: resolvedPortalSlug }, 'Login successful');
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.session_token || req.sessionToken;
  const portalSlug = req.body?.portal || req.portal;

  if (token) {
    await Session.deleteByToken(token);
  }

  const cookiePath = portalSlug
    ? (getPortalConfigBySlug(portalSlug)?.cookiePath || '/')
    : '/';

  res.clearCookie('session_token', { path: cookiePath });
  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'LOGOUT',
    entity_type: 'USER',
    entity_id: req.user?.id || null,
    portal_slug: portalSlug || 'unknown',
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'user_logged_out', { user_id: req.user?.id });
  return success(res, 200, null, 'Logged out successfully');
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AuthenticationError('User not found.');
  }
  const { password_hash, ...safeUser } = user;
  const activePortal = req.portal || PORTAL_CONFIGS[user.role]?.slug || 'app';
  return success(res, 200, { user: safeUser, activePortal });
});

export const oauthAuthorize = asyncHandler(async (req, res) => {
  const { provider, portal, redirectUri } = req.query;

  if (!provider || !portal || !redirectUri) {
    throw new ValidationError('provider, portal, and redirectUri are required.');
  }

  const portalConfig = getPortalConfigBySlug(portal);
  if (!portalConfig) {
    throw new AuthenticationError('Invalid portal.');
  }

  if (!portalConfig.oauthProviders?.includes(provider)) {
    throw new AuthorizationError(`OAuth provider ${provider} is not enabled for this portal.`);
  }

  const { url, state } = await getAuthorizationUrl(provider, portal, redirectUri);
  return success(res, 200, { url, state });
});

export const oauthCallback = asyncHandler(async (req, res) => {
  const { provider } = req.params;
  const { code, state, redirectUri } = req.query;

  if (!code || !state) {
    throw new ValidationError('code and state are required.');
  }

  const result = await handleOAuthCallback(provider, code, state, redirectUri || '');
  return success(res, 200, result, 'OAuth login successful');
});
