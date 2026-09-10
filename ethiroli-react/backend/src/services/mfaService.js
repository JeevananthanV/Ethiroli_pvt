import crypto from 'crypto';
import MfaSecret from '../models/MfaSecret.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { ROLES } from '../config/constants.js';

const TOTP_WINDOW = 1;

const generateTOTP = (secret, time = Date.now()) => {
  const counter = Math.floor(time / 30000);
  const counterBuffer = Buffer.alloc(8, 0);
  counterBuffer.writeBigUInt64BE(BigInt(counter));

  const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base64'));
  hmac.update(counterBuffer);
  const digest = hmac.digest();

  const offset = digest[digest.length - 1] & 0x0f;
  const code =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  return (code % 1000000).toString().padStart(6, '0');
};

export const generateSecret = () => {
  return crypto.randomBytes(20).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export const generateTOTPForSecret = (secret) => {
  return generateTOTP(secret);
};

export const verifyTOTP = (secret, token) => {
  const normalized = String(token).trim();
  if (!/^\d{6}$/.test(normalized)) return false;
  for (let i = -TOTP_WINDOW; i <= TOTP_WINDOW; i++) {
    const time = Date.now() + i * 30000;
    if (generateTOTP(secret, time) === normalized) {
      return true;
    }
  }
  return false;
};

export const isMfaRequiredForRole = (role) => {
  const privileged = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FINANCE];
  return privileged.includes(role);
};

export const provisionMfa = async (userId) => {
  const secret = generateSecret();
  await MfaSecret.create({
    user_id: userId,
    secret,
    is_verified: false,
    backup_codes: []
  });
  return secret;
};

export const verifyAndActivateMfa = async (userId, token) => {
  const record = await MfaSecret.findActiveByUserId(userId);
  if (!record) {
    throw new Error('MFA not provisioned for this user.');
  }

  const isValid = verifyTOTP(record.secret, token);
  if (!isValid) {
    throw new Error('Invalid MFA code.');
  }

  await MfaSecret.markVerified(record.id);
  await AuditLog.create({
    user_id: userId,
    action: 'MFA_ACTIVATED',
    entity_type: 'AUTH',
    entity_id: userId,
    metadata: { success: true }
  });

  return true;
};

export const validateMfaForLogin = async (userId, token) => {
  const record = await MfaSecret.findActiveByUserId(userId);
  if (!record) {
    throw new Error('MFA is required but not configured.');
  }

  const isValid = verifyTOTP(record.secret, token);
  if (!isValid) {
    await AuditLog.create({
      user_id: userId,
      action: 'MFA_FAILURE',
      entity_type: 'AUTH',
      entity_id: userId,
      metadata: { success: false }
    });
    throw new Error('Invalid MFA code.');
  }

  await AuditLog.create({
    user_id: userId,
    action: 'MFA_SUCCESS',
    entity_type: 'AUTH',
    entity_id: userId,
    metadata: { success: true }
  });

  return true;
};
