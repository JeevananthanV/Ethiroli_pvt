import crypto from 'node:crypto';
import pool from '../config/database.js';
import AuditLog from '../models/AuditLog.js';
import { success, error } from '../utils/response.js';
import { logger } from '../config/logger.js';
import { broadcastToRole, getIO } from '../socket/index.js';

/**
 * Lists real-time intercepted security threats
 */
export const listThreats = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '50', 10);
    const [rows] = await pool.query(
      `SELECT id, threat_type, source_ip, target_endpoint, severity, status, details, created_at 
       FROM security_threat_logs 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [limit]
    );

    const formatted = rows.map((r) => ({
      ...r,
      details: typeof r.details === 'string' ? JSON.parse(r.details) : r.details
    }));

    return success(res, 200, formatted, 'Threats retrieved successfully');
  } catch (err) {
    logger.error('Failed to list security threats', { error: err.message });
    next(err);
  }
};

/**
 * Emergency multi-worker session revocation for a compromised user
 */
export const revokeAllSessions = async (req, res, next) => {
  try {
    const { userId, reason = 'administrative_revocation' } = req.body;
    if (!userId) {
      return error(res, 400, 'userId is required');
    }

    // 1. Delete all active sessions from the database
    const [result] = await pool.query(
      `DELETE FROM sessions WHERE user_id = ?`,
      [userId]
    );
    const revokedCount = result.affectedRows || 0;

    // 2. Disconnect any active WebSocket connections across cluster
    try {
      const io = getIO();
      if (io) {
        // Disconnect sockets in the user's specific room
        io.to(`user:${userId}`).emit('force_logout', { reason });
        io.in(`user:${userId}`).disconnectSockets(true);
      }
    } catch (wsErr) {
      logger.warn('Failed to force disconnect socket', { error: wsErr.message });
    }

    // 3. Record immutable audit log
    await AuditLog.create({
      user_id: req.user?.id || null,
      action: 'SECURITY_EMERGENCY_REVOKE',
      entity_type: 'USER',
      entity_id: userId,
      new_value: { reason, revokedCount },
      ip_address: req.ip || '127.0.0.1'
    });

    // 4. Alert Super Admin and Admin rooms
    broadcastToRole('SUPER_ADMIN', 'security_session_revoked', {
      userId,
      revokedCount,
      adminId: req.user?.id,
      timestamp: new Date().toISOString()
    });

    logger.warn('Emergency sessions revoked for user', { userId, revokedCount, reason });
    return success(res, 200, { userId, revokedCount, reason }, `Successfully revoked ${revokedCount} active session(s)`);
  } catch (err) {
    logger.error('Failed to revoke sessions', { error: err.message });
    next(err);
  }
};

/**
 * Emergency account lock & force credential reset
 */
export const lockUserAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason = 'security_lock' } = req.body;

    const [userRows] = await pool.query(`SELECT id, email, role FROM users WHERE id = ?`, [id]);
    if (userRows.length === 0) {
      return error(res, 404, 'User not found');
    }

    // Lock user account and flag password reset
    await pool.query(
      `UPDATE users 
       SET is_active = 0, 
           preferences = JSON_SET(COALESCE(preferences, '{}'), '$.force_password_reset', true) 
       WHERE id = ?`,
      [id]
    );

    // Purge all active sessions
    await pool.query(`DELETE FROM sessions WHERE user_id = ?`, [id]);

    // Force disconnect WebSockets
    try {
      const io = getIO();
      if (io) {
        io.to(`user:${id}`).emit('force_logout', { reason: 'account_locked' });
        io.in(`user:${id}`).disconnectSockets(true);
      }
    } catch (_) {}

    // Audit log
    await AuditLog.create({
      user_id: req.user?.id || null,
      action: 'SECURITY_ACCOUNT_LOCKED',
      entity_type: 'USER',
      entity_id: id,
      new_value: { reason, user: userRows[0] },
      ip_address: req.ip || '127.0.0.1'
    });

    broadcastToRole('SUPER_ADMIN', 'security_anomaly_detected', {
      userId: id,
      userEmail: userRows[0].email,
      action: 'ACCOUNT_LOCKED',
      reason
    });

    return success(res, 200, { userId: id, status: 'LOCKED', reason }, 'User account locked and active sessions purged');
  } catch (err) {
    logger.error('Failed to lock user account', { error: err.message });
    next(err);
  }
};

/**
 * Block an IP address at WAF level
 */
export const blockIpAddress = async (req, res, next) => {
  try {
    const { sourceIp, reason = 'manual_block' } = req.body;
    if (!sourceIp) {
      return error(res, 400, 'sourceIp is required');
    }

    const threatId = crypto.randomUUID();
    await pool.query(
      `INSERT INTO security_threat_logs (id, threat_type, source_ip, target_endpoint, severity, status, details)
       VALUES (?, 'MANUAL_FIREWALL_BLOCK', ?, 'GLOBAL', 'CRITICAL', 'IP_BLOCKED', ?)`,
      [threatId, sourceIp, JSON.stringify({ reason, blockedBy: req.user?.id })]
    );

    return success(res, 201, { id: threatId, sourceIp, status: 'IP_BLOCKED' }, `IP ${sourceIp} blocked successfully`);
  } catch (err) {
    logger.error('Failed to block IP', { error: err.message });
    next(err);
  }
};
