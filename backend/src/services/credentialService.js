import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import AuditLog from '../models/AuditLog.js';
import User from '../models/User.js';
import { ROLE_RANKS } from '../middleware/rbacGuard.js';
import { AuthenticationError, AuthorizationError, ValidationError } from '../utils/errors.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const PASSWORD_HISTORY_LIMIT = 5;
const BCRYPT_ROUNDS = 12;

export class CredentialService {
  static async ensureTable() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS user_credentials (
          user_id CHAR(36) PRIMARY KEY,
          password_hash VARCHAR(255) NOT NULL,
          password_algo VARCHAR(30) NOT NULL DEFAULT 'BCRYPT',
          password_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          failed_login_attempts INT NOT NULL DEFAULT 0,
          lockout_until TIMESTAMP NULL DEFAULT NULL,
          requires_password_change BOOLEAN NOT NULL DEFAULT FALSE,
          password_history JSON NULL,
          two_factor_secret VARCHAR(255) NULL DEFAULT NULL,
          two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT fk_uc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    } catch (_) {
      // Ignore if table or constraints exist
    }
  }

  /**
   * Retrieves credentials entry for a given user.
   * If missing (e.g. legacy user), creates an initial row from `users.password_hash`.
   */
  static async getCredentials(userId) {
    let rows;
    try {
      const [result] = await pool.query(
        `SELECT * FROM user_credentials WHERE user_id = ? LIMIT 1`,
        [userId]
      );
      rows = result;
    } catch (err) {
      if (err.message && err.message.includes('user_credentials')) {
        await this.ensureTable();
        const [retryResult] = await pool.query(
          `SELECT * FROM user_credentials WHERE user_id = ? LIMIT 1`,
          [userId]
        );
        rows = retryResult;
      } else {
        throw err;
      }
    }

    if (rows && rows.length > 0) {
      return rows[0];
    }

    // Lazy initialization for existing user
    const user = await User.findById(userId);
    if (!user) return null;

    const initialHistory = JSON.stringify(user.password_hash ? [user.password_hash] : []);
    await pool.query(
      `INSERT INTO user_credentials 
       (user_id, password_hash, password_algo, password_history, requires_password_change)
       VALUES (?, ?, 'BCRYPT', ?, FALSE)
       ON DUPLICATE KEY UPDATE user_id = user_id`,
      [userId, user.password_hash || '', initialHistory]
    );

    const [createdRows] = await pool.query(
      `SELECT * FROM user_credentials WHERE user_id = ? LIMIT 1`,
      [userId]
    );
    return createdRows[0] || null;
  }

  /**
   * Checks if an account is currently locked due to excessive failed attempts.
   */
  static async checkLockout(userId) {
    const creds = await this.getCredentials(userId);
    if (!creds || !creds.lockout_until) return;

    const now = new Date();
    const lockoutUntil = new Date(creds.lockout_until);

    if (lockoutUntil > now) {
      const remainingMinutes = Math.ceil((lockoutUntil.getTime() - now.getTime()) / (60 * 1000));
      throw new AuthenticationError(
        `Account temporarily locked due to excessive failed login attempts. Please try again in ${remainingMinutes} minute(s).`
      );
    }

    // Lockout expired - automatically clear lockout state
    await pool.query(
      `UPDATE user_credentials 
       SET failed_login_attempts = 0, lockout_until = NULL 
       WHERE user_id = ?`,
      [userId]
    );
  }

  /**
   * Records a failed login attempt and applies a lockout if threshold is exceeded.
   */
  static async recordFailedAttempt(userId) {
    const creds = await this.getCredentials(userId);
    if (!creds) return;

    const attempts = (creds.failed_login_attempts || 0) + 1;
    let lockoutUntil = null;

    if (attempts >= MAX_FAILED_ATTEMPTS) {
      const lockDate = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
      lockoutUntil = lockDate;

      await pool.query(
        `UPDATE user_credentials 
         SET failed_login_attempts = ?, lockout_until = ? 
         WHERE user_id = ?`,
        [attempts, lockDate, userId]
      );

      await AuditLog.create({
        user_id: userId,
        action: 'SECURITY_ACCOUNT_LOCKOUT',
        entity_type: 'USER',
        entity_id: userId,
        new_value: { failedAttempts: attempts, lockoutUntil: lockDate.toISOString() },
        ip_address: '127.0.0.1'
      });

      return { attempts, isLocked: true, lockoutUntil: lockDate };
    }

    await pool.query(
      `UPDATE user_credentials 
       SET failed_login_attempts = ? 
       WHERE user_id = ?`,
      [attempts, userId]
    );

    return { attempts, isLocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS - attempts };
  }

  /**
   * Resets failed login counters upon successful authentication.
   */
  static async resetFailedAttempts(userId) {
    await pool.query(
      `UPDATE user_credentials 
       SET failed_login_attempts = 0, lockout_until = NULL 
       WHERE user_id = ?`,
      [userId]
    );
  }

  /**
   * Normalises the stored password_history column into an array of hashes.
   *
   * The column is meant to hold a JSON array, but rows written by older tooling
   * contain a bare bcrypt hash string. JSON.parse then throws and the previous
   * `catch { history = [] }` silently disabled password-reuse protection. A bare
   * hash is therefore treated as a single-entry history so the check fails
   * closed instead of quietly passing.
   */
  static parsePasswordHistory(stored) {
    if (!stored) return [];
    if (Array.isArray(stored)) return stored.filter((h) => typeof h === 'string' && h);
    if (typeof stored === 'string') {
      const trimmed = stored.trim();
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed.filter((h) => typeof h === 'string' && h) : [];
      } catch (_) {
        // Not JSON - a bare hash string is a one-entry history.
        return /^\$2[aby]\$/.test(trimmed) ? [trimmed] : [];
      }
    }
    return [];
  }

  /**
   * Validates whether candidate password matches any of the user's previous 5 passwords.
   */
  static async verifyPasswordHistory(userId, candidatePassword) {
    const creds = await this.getCredentials(userId);
    if (!creds || !creds.password_history) return false;

    const history = this.parsePasswordHistory(creds.password_history);

    for (const oldHash of history) {
      if (oldHash && typeof oldHash === 'string') {
        const match = await bcrypt.compare(candidatePassword, oldHash);
        if (match) {
          return true; // Password was previously used
        }
      }
    }

    return false;
  }

  /**
   * Updates user password with strict history enforcement and session revocation.
   */
  static async updatePassword(userId, newPassword, { requiresChange = false, actorId = null } = {}) {
    if (!newPassword || newPassword.length < 8) {
      throw new ValidationError('Password must be at least 8 characters in length.');
    }

    // Password complexity: letter + number
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!hasLetter || !hasNumber) {
      throw new ValidationError('Password must contain at least one letter and one number.');
    }

    // Verify history (prevent reusing last 5 passwords)
    const isReused = await this.verifyPasswordHistory(userId, newPassword);
    if (isReused) {
      throw new ValidationError(
        'Password has been used recently. You cannot reuse any of your last 5 passwords.'
      );
    }

    const creds = await this.getCredentials(userId);
    const history = this.parsePasswordHistory(creds?.password_history);

    const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    const updatedHistory = [newHash, ...history].slice(0, PASSWORD_HISTORY_LIMIT);

    // 1. Update user_credentials table
    await pool.query(
      `INSERT INTO user_credentials 
       (user_id, password_hash, password_algo, password_updated_at, failed_login_attempts, lockout_until, requires_password_change, password_history)
       VALUES (?, ?, 'BCRYPT', NOW(), 0, NULL, ?, ?)
       ON DUPLICATE KEY UPDATE 
         password_hash = VALUES(password_hash),
         password_algo = VALUES(password_algo),
         password_updated_at = NOW(),
         failed_login_attempts = 0,
         lockout_until = NULL,
         requires_password_change = VALUES(requires_password_change),
         password_history = VALUES(password_history)`,
      [userId, newHash, requiresChange, JSON.stringify(updatedHistory)]
    );

    // 2. Synchronize users table password_hash for backwards compatibility
    await pool.query(
      `UPDATE users SET password_hash = ? WHERE id = ?`,
      [newHash, userId]
    );

    // 3. Invalidate active sessions to prevent session hijacking
    await pool.query(
      `DELETE FROM sessions WHERE user_id = ?`,
      [userId]
    );

    await AuditLog.create({
      user_id: actorId || userId,
      action: actorId && actorId !== userId ? 'ADMINISTRATIVE_PASSWORD_CHANGE' : 'USER_PASSWORD_CHANGE',
      entity_type: 'USER',
      entity_id: userId,
      new_value: { requires_password_change: requiresChange },
      ip_address: '127.0.0.1'
    });

    return {
      success: true,
      requires_password_change: requiresChange
    };
  }

  /**
   * Administrative Credential Rotation with Strict Privilege Hierarchy Enforcement.
   * Actor must have strictly higher security rank than Target ($R_actor > R_target).
   */
  static async administrativeRotateCredentials({ targetUserId, temporaryPassword, actorId, actorRole }) {
    if (!targetUserId) {
      throw new ValidationError('targetUserId is required.');
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      throw new NotFoundError('Target user not found.');
    }

    // Determine security ranks
    const actorRank = ROLE_RANKS[actorRole] || 0;
    const targetRank = ROLE_RANKS[targetUser.role] || 0;

    // Root Super Admin bypasses hierarchy checks
    if (actorRole !== 'SUPER_ADMIN') {
      if (actorId === targetUserId) {
        throw new AuthorizationError('Security Violation: Self-administrative rotation is disallowed. Use the standard password change endpoint.');
      }

      if (targetRank >= actorRank) {
        await AuditLog.create({
          user_id: actorId,
          action: 'SECURITY_HIERARCHY_VIOLATION_CREDENTIAL_ROTATION',
          entity_type: 'USER',
          entity_id: targetUserId,
          new_value: {
            actorRole,
            actorRank,
            targetRole: targetUser.role,
            targetRank
          },
          ip_address: '127.0.0.1'
        });

        throw new AuthorizationError(
          `Hierarchy Violation: Role '${actorRole}' (Rank ${actorRank}) cannot rotate credentials for account '${targetUser.full_name || targetUser.email}' with role '${targetUser.role}' (Rank ${targetRank}). Clearance level must be strictly higher.`
        );
      }
    }

    const tempPassword = temporaryPassword || `Temp@${Math.random().toString(36).substring(2, 8)}!9`;
    
    // Update password, requiring password change on next login
    await this.updatePassword(targetUserId, tempPassword, {
      requiresChange: true,
      actorId
    });

    await AuditLog.create({
      user_id: actorId,
      action: 'ADMINISTRATIVE_CREDENTIAL_ROTATION',
      entity_type: 'USER',
      entity_id: targetUserId,
      new_value: {
        actorId,
        actorRole,
        targetRole: targetUser.role,
        requires_password_change: true
      },
      ip_address: '127.0.0.1'
    });

    return {
      success: true,
      temporaryPassword: tempPassword,
      requires_password_change: true,
      message: 'Credentials rotated successfully. Temporary password issued and target sessions revoked.'
    };
  }
}

export default CredentialService;
