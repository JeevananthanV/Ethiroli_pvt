import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import pool from '../config/database.js';
import User from '../models/User.js';
import Session from '../models/Session.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { AuthenticationError, AuthorizationError, ValidationError } from '../utils/errors.js';
import { ROLES, PORTAL_CONFIGS, getPortalConfigBySlug, IMPERSONATION_TARGETS } from '../config/constants.js';
import { isMfaRequiredForRole, validateMfaForLogin } from '../services/mfaService.js';
import CredentialService from '../services/credentialService.js';

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

  const portalConfig = (portalSlug && portalSlug !== 'app') ? getPortalConfigBySlug(portalSlug) : null;
  if (portalSlug && portalSlug !== 'app' && !portalConfig) {
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

  // 1. Check account lockout status before checking password
  await CredentialService.checkLockout(user.id);

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const lockInfo = await CredentialService.recordFailedAttempt(user.id);
    await AuditLog.create({
      user_id: user.id,
      action: 'LOGIN_ATTEMPT',
      entity_type: 'AUTH',
      entity_id: user.id,
      portal_slug: portalSlug || 'unknown',
      ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      user_agent: req.headers['user-agent'],
      metadata: { 
        success: false, 
        failure_reason: 'invalid_password',
        failed_attempts: lockInfo?.attempts,
        is_locked: lockInfo?.isLocked
      }
    });

    if (lockInfo?.isLocked) {
      throw new AuthenticationError('Account locked due to 5 consecutive failed login attempts. Please try again in 15 minutes.');
    }

    throw new AuthenticationError('Invalid email or password.');
  }

  // 2. Successful match - reset failed login counters
  await CredentialService.resetFailedAttempts(user.id);

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

  const creds = await CredentialService.getCredentials(user.id);
  const { password_hash, ...safeUser } = user;
  safeUser.requires_password_change = Boolean(creds?.requires_password_change);
  safeUser.password_updated_at = creds?.password_updated_at;

  broadcastToRole('ADMIN', 'user_logged_in', { user_id: user.id });
  return success(res, 200, { user: safeUser, token, socket_token: token, activePortal: portalSlug || PORTAL_CONFIGS[user.role]?.slug || 'app' }, 'Login successful');
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
  return success(res, 200, {
    user: {
      ...safeUser,
      impersonated_by: req.user.impersonated_by || null,
      impersonated_by_name: req.user.impersonated_by_name || null,
      impersonated_by_role: req.user.impersonated_by_role || null
    },
    impersonating: Boolean(req.user.impersonated_by),
    activePortal
  });
});

export const impersonate = asyncHandler(async (req, res) => {
  const { targetUserId } = req.body;

  if (![ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(req.user.role)) {
    throw new AuthorizationError('Only Super Admin or Admin can impersonate users.');
  }

  if (req.user.impersonated_by) {
    throw new AuthorizationError('Exit the current impersonation before switching to another user.');
  }

  if (targetUserId === req.user.id) {
    throw new ValidationError('You cannot impersonate yourself.');
  }

  const target = await User.findById(targetUserId);
  if (!target) {
    throw new ValidationError('Target user not found.');
  }
  if (!target.is_active) {
    throw new AuthorizationError('The target account is deactivated.');
  }

  const allowedTargets = IMPERSONATION_TARGETS[req.user.role] || [];
  if (!allowedTargets.includes(target.role)) {
    throw new AuthorizationError(`Role '${req.user.role}' is not permitted to impersonate role '${target.role}'.`);
  }

  // Single-business boundary: an Admin may only impersonate users inside the same tenant.
  if (req.user.role === ROLES.ADMIN && req.user.tenant_id) {
    const [rows] = await pool.execute(
      'SELECT tenant_id FROM tenant_users WHERE user_id = ? AND is_primary = 1 LIMIT 1',
      [target.id]
    );
    const targetTenantId = rows[0]?.tenant_id || null;
    if (targetTenantId && req.user.tenant_id !== targetTenantId) {
      throw new AuthorizationError('Cross-business impersonation is not allowed. Admins may only impersonate users within their own organization.');
    }
  }

  const originToken = req.cookies?.session_token || req.sessionToken || null;
  const portalConfig = PORTAL_CONFIGS[target.role] || PORTAL_CONFIGS[ROLES.EMPLOYEE];
  const portalSlug = portalConfig.slug || 'app';
  const sessionDuration = portalConfig.sessionDuration || 8 * 60 * 60;
  const expiresAt = new Date(Date.now() + sessionDuration * 1000);
  const token = crypto.randomBytes(32).toString('hex');

  await Session.create({
    user_id: target.id,
    token,
    portal_slug: portalSlug,
    expires_at: expiresAt,
    user_agent: req.headers['user-agent'] || null,
    ip_address: req.clientIp || req.ip || req.headers['x-forwarded-for'] || 'unknown',
    impersonated_by: req.user.id,
    impersonation_origin_token: originToken
  });

  res.cookie('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: PORTAL_COOKIE_CONFIG[target.role]?.sameSite || 'lax',
    path: PORTAL_COOKIE_CONFIG[target.role]?.path || '/',
    expires: expiresAt
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'IMPERSONATE_START',
    entity_type: 'USER',
    entity_id: target.id,
    portal_slug: portalSlug,
    ip_address: req.clientIp || req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent'],
    new_value: {
      target_role: target.role,
      target_email: target.email,
      impersonated_by: req.user.id,
      origin_session_preserved: Boolean(originToken)
    }
  });

  const { password_hash, ...safeTarget } = target;
  return success(res, 200, {
    user: {
      ...safeTarget,
      impersonated_by: req.user.id,
      impersonated_by_name: req.user.full_name,
      impersonated_by_role: req.user.role
    },
    token,
    socket_token: token,
    impersonating: true,
    activePortal: portalSlug
  }, `Now impersonating ${target.full_name || target.email}`);
});

export const stopImpersonation = asyncHandler(async (req, res) => {
  const currentToken = req.cookies?.session_token || req.sessionToken;
  const originToken = req.user.impersonation_origin_token;
  const impersonatedBy = req.user.impersonated_by;

  if (!impersonatedBy || !originToken) {
    throw new ValidationError('You are not currently impersonating any user.');
  }

  await Session.deleteByToken(currentToken);

  const originSession = await Session.findByToken(originToken);
  if (!originSession) {
    throw new AuthenticationError('Your original session has expired. Please log in again.');
  }

  const originUser = await User.findById(originSession.user_id);
  if (!originUser) {
    throw new AuthenticationError('Unable to restore your original account.');
  }

  res.cookie('session_token', originToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: PORTAL_COOKIE_CONFIG[originUser.role]?.sameSite || 'lax',
    path: PORTAL_COOKIE_CONFIG[originUser.role]?.path || '/',
    expires: originSession.expires_at ? new Date(originSession.expires_at) : undefined
  });

  await AuditLog.create({
    user_id: originUser.id,
    action: 'IMPERSONATE_STOP',
    entity_type: 'USER',
    entity_id: req.user.id,
    portal_slug: originSession.portal_slug || 'app',
    ip_address: req.clientIp || req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent'],
    new_value: {
      impersonated_user_id: req.user.id,
      impersonated_user_role: req.user.role
    }
  });

  const { password_hash, ...safeUser } = originUser;
  return success(res, 200, {
    user: safeUser,
    token: originToken,
    socket_token: originToken,
    impersonating: false,
    activePortal: PORTAL_CONFIGS[originUser.role]?.slug || 'app'
  }, 'Impersonation ended. Welcome back!');
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

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ValidationError('Both currentPassword and newPassword are required.');
  }

  if (newPassword.length < 6) {
    throw new ValidationError('newPassword must be at least 6 characters.');
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AuthenticationError('User not found.');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) {
    await AuditLog.create({
      user_id: user.id,
      action: 'CHANGE_PASSWORD_FAILED',
      entity_type: 'USER',
      entity_id: user.id,
      portal_slug: req.portal || 'app',
      ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      user_agent: req.headers['user-agent'],
      metadata: { reason: 'invalid_current_password' }
    });
    throw new ValidationError('Current password does not match.');
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await User.update(user.id, { password_hash: newHash });

  // Revoke other active sessions for security
  const currentToken = req.cookies?.session_token || req.sessionToken;
  if (currentToken) {
    await pool.query('DELETE FROM sessions WHERE user_id = ? AND token != ?', [user.id, currentToken]);
  } else {
    await pool.query('DELETE FROM sessions WHERE user_id = ?', [user.id]);
  }

  await AuditLog.create({
    user_id: user.id,
    action: 'CHANGE_PASSWORD',
    entity_type: 'USER',
    entity_id: user.id,
    portal_slug: req.portal || 'app',
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent'],
    metadata: { success: true }
  });

  return success(res, 200, null, 'Password changed successfully');
});

export const getDemoUsers = asyncHandler(async (req, res) => {
  const role = req.query.role || ROLES.STUDENT;

  const [rows] = await pool.execute(
    `SELECT u.id, u.email, u.full_name, u.preferences,
            (SELECT c.name FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.student_id = u.id ORDER BY e.progress_percentage DESC LIMIT 1) as top_course,
            (SELECT e.progress_percentage FROM enrollments e WHERE e.student_id = u.id ORDER BY e.progress_percentage DESC LIMIT 1) as top_progress
     FROM users u
     WHERE u.role = ? AND u.is_active = 1
     ORDER BY u.created_at DESC
     LIMIT 15`,
    [role]
  );

  const formatted = rows.map(r => {
    const userFmt = User.format(r);
    let prefs = {};
    try {
      prefs = typeof r.preferences === 'string' ? JSON.parse(r.preferences) : (r.preferences || {});
    } catch {
      prefs = {};
    }
    return {
      id: r.id,
      email: userFmt.email,
      full_name: userFmt.full_name,
      department: prefs.department || null,
      college: prefs.college || null,
      top_course: r.top_course,
      top_progress: r.top_progress !== null ? parseFloat(r.top_progress) : 0
    };
  });

  return success(res, 200, formatted, 'Demo users retrieved dynamically');
});


