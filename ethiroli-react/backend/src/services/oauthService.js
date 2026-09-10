import crypto from 'crypto';
import axios from 'axios';
import OAuthState from '../models/OAuthState.js';
import User from '../models/User.js';
import Session from '../models/Session.js';
import AuditLog from '../models/AuditLog.js';
import { ROLES, PORTAL_CONFIGS } from '../config/constants.js';
import { success } from '../utils/response.js';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';

export const OAUTH_PROVIDERS = {
  google: {
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
    scopes: ['openid', 'profile', 'email'],
  },
  microsoft: {
    authorizationUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userInfoUrl: 'https://graph.microsoft.com/oidc/userinfo',
    scopes: ['openid', 'profile', 'email'],
  },
  linkedin: {
    authorizationUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    userInfoUrl: 'https://api.linkedin.com/v2/me',
    scopes: ['r_liteprofile', 'r_emailaddress'],
  },
};

const generateState = () => crypto.randomBytes(32).toString('hex');

export const getAuthorizationUrl = (provider, portalSlug, redirectUri) => {
  const config = OAUTH_PROVIDERS[provider];
  if (!config) {
    throw new Error(`Unsupported OAuth provider: ${provider}`);
  }

  const state = generateState();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  OAuthState.create({
    state,
    portalSlug,
    redirectUri,
    expiresAt
  });

  const params = new URLSearchParams({
    client_id: process.env[`OAUTH_${provider.toUpperCase()}_CLIENT_ID`] || '',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    state,
    access_type: 'offline',
    prompt: 'consent',
  });

  return { url: `${config.authorizationUrl}?${params.toString()}`, state };
};

export const exchangeCodeForToken = async (provider, code, redirectUri) => {
  const config = OAUTH_PROVIDERS[provider];
  if (!config) {
    throw new Error(`Unsupported OAuth provider: ${provider}`);
  }

  const response = await axios.post(
    config.tokenUrl,
    new URLSearchParams({
      client_id: process.env[`OAUTH_${provider.toUpperCase()}_CLIENT_ID`] || '',
      client_secret: process.env[`OAUTH_${provider.toUpperCase()}_CLIENT_SECRET`] || '',
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  return response.data;
};

export const fetchUserInfo = async (provider, accessToken) => {
  const config = OAUTH_PROVIDERS[provider];
  if (!config) {
    throw new Error(`Unsupported OAuth provider: ${provider}`);
  }

  const response = await axios.get(config.userInfoUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  return response.data;
};

export const resolveRoleFromProvider = (provider, userInfo) => {
  const portalSlug = userInfo?.portal_slug;
  if (!portalSlug) return null;

  const portalConfig = Object.entries(PORTAL_CONFIGS).find(([, config]) => config.slug === portalSlug);
  return portalConfig ? portalConfig[0] : null;
};

export const handleOAuthCallback = async (provider, code, state, redirectUri) => {
  const stateRecord = await OAuthState.findByState(state);
  if (!stateRecord) {
    throw new AuthenticationError('Invalid or expired OAuth state.');
  }

  if (stateRecord.redirect_uri !== redirectUri) {
    throw new AuthenticationError('Redirect URI mismatch.');
  }

  await OAuthState.deleteByState(state);

  const tokenResponse = await exchangeCodeForToken(provider, code, redirectUri);
  const accessToken = tokenResponse.access_token;
  if (!accessToken) {
    throw new AuthenticationError('Failed to obtain access token.');
  }

  const userInfo = await fetchUserInfo(provider, accessToken);
  const email = userInfo.email || userInfo.mail;
  const fullName = userInfo.name || userInfo.displayName || `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim();

  if (!email) {
    throw new AuthenticationError('Email not provided by OAuth provider.');
  }

  let user = await User.findByEmail(email);
  if (!user) {
    const role = resolveRoleFromProvider(provider, { ...userInfo, portal_slug: stateRecord.portal_slug });
    if (!role) {
      throw new AuthorizationError('Unable to determine role for this portal.');
    }

    user = await User.create({
      email,
      full_name: fullName || email.split('@')[0],
      role,
      password_hash: '',
      is_active: true,
    });
  }

  await Session.deleteByUserId(user.id);
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await Session.create({
    user_id: user.id,
    token: sessionToken,
    portal_slug: stateRecord.portal_slug,
    expires_at: expiresAt,
    user_agent: 'oauth',
    ip_address: 'oauth'
  });

  await AuditLog.create({
    user_id: user.id,
    action: 'OAUTH_LOGIN',
    entity_type: 'AUTH',
    entity_id: user.id,
    portal_slug: stateRecord.portal_slug,
    metadata: { provider, success: true }
  });

  const { password_hash, ...safeUser } = user;
  return { user: safeUser, socket_token: sessionToken, activePortal: stateRecord.portal_slug };
};
