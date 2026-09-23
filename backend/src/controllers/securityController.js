import crypto from 'node:crypto';
import pool from '../config/database.js';
import AuditLog from '../models/AuditLog.js';
import { success, error } from '../utils/response.js';
import { logger } from '../config/logger.js';
import { broadcastToRole, getIO } from '../socket/index.js';
import { ROLE_RANKS } from '../middleware/rbacGuard.js';

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

    // Anti-Privilege Escalation Check: Non-Super Admins cannot revoke equal or higher rank sessions
    if (req.user?.role !== 'SUPER_ADMIN') {
      const [targetUsers] = await pool.query('SELECT role FROM users WHERE id = ?', [userId]);
      if (targetUsers.length > 0) {
        const targetRank = ROLE_RANKS[targetUsers[0].role] || 0;
        const callerRank = ROLE_RANKS[req.user?.role] || 0;
        if (targetRank >= callerRank) {
          return error(res, 403, `Privilege Boundary Violation: You cannot revoke sessions for account with equal or higher rank (${targetUsers[0].role})`);
        }
      }
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

    // Anti-Privilege Escalation Check: Non-Super Admins cannot lock equal or higher rank accounts
    if (req.user?.role !== 'SUPER_ADMIN') {
      const targetRank = ROLE_RANKS[userRows[0].role] || 0;
      const callerRank = ROLE_RANKS[req.user?.role] || 0;
      if (targetRank >= callerRank) {
        return error(res, 403, `Privilege Boundary Violation: You cannot lock or suspend an account with equal or higher rank (${userRows[0].role})`);
      }
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

/**
 * Initiate Break-Glass Emergency Procedure
 */
export const initiateBreakGlass = async (req, res, next) => {
  try {
    const { reason, incidentTicketId } = req.body;
    if (!reason || !incidentTicketId) {
      return error(res, 400, 'reason and incidentTicketId are required to initiate break-glass');
    }

    const eventId = crypto.randomUUID();
    await pool.query(
      `INSERT INTO break_glass_events (id, initiator_user_id, reason, incident_ticket_id, status, ip_address)
       VALUES (?, ?, ?, ?, 'PENDING', ?)`,
      [eventId, req.user.id, reason, incidentTicketId, req.ip || '127.0.0.1']
    );

    await AuditLog.create({
      user_id: req.user.id,
      action: 'SECURITY_BREAK_GLASS_INITIATED',
      entity_type: 'SECURITY_BREAK_GLASS',
      entity_id: eventId,
      new_value: { incidentTicketId, reason },
      ip_address: req.ip || '127.0.0.1'
    });

    broadcastToRole('SUPER_ADMIN', 'break_glass_alert', {
      eventId,
      initiator: req.user.id,
      incidentTicketId,
      status: 'PENDING_APPROVAL'
    });

    return success(res, 201, {
      eventId,
      status: 'PENDING',
      incidentTicketId,
      notice: 'Break-glass initiated. Awaiting second Super Admin dual authorization.'
    }, 'Break-glass emergency procedure initiated');
  } catch (err) {
    logger.error('Failed to initiate break glass', { error: err.message });
    next(err);
  }
};

/**
 * Approve Break-Glass Emergency Procedure (Four-Eyes Principle / Dual Control)
 */
export const approveBreakGlass = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    if (!eventId) {
      return error(res, 400, 'eventId is required');
    }

    const [events] = await pool.query('SELECT * FROM break_glass_events WHERE id = ?', [eventId]);
    if (events.length === 0) {
      return error(res, 404, 'Break glass event not found');
    }

    const event = events[0];
    if (event.status !== 'PENDING') {
      return error(res, 400, `Break glass event is already in status '${event.status}'`);
    }

    // Four-Eyes Principle: Approver cannot be the same Super Admin who initiated
    if (event.initiator_user_id === req.user.id) {
      return error(res, 403, 'Dual Control Violation: The initiating Super Admin cannot approve their own break-glass request');
    }

    await pool.query(
      `UPDATE break_glass_events 
       SET approver_user_id = ?, status = 'ACTIVE', activated_at = NOW(), expires_at = DATE_ADD(NOW(), INTERVAL 60 MINUTE)
       WHERE id = ?`,
      [req.user.id, eventId]
    );

    await AuditLog.create({
      user_id: req.user.id,
      action: 'SECURITY_BREAK_GLASS_APPROVED',
      entity_type: 'SECURITY_BREAK_GLASS',
      entity_id: eventId,
      new_value: { approver: req.user.id, expires_in: '60m' },
      ip_address: req.ip || '127.0.0.1'
    });

    broadcastToRole('SUPER_ADMIN', 'break_glass_activated', {
      eventId,
      approvedBy: req.user.id,
      ttlMinutes: 60
    });

    return success(res, 200, {
      eventId,
      status: 'ACTIVE',
      expiresIn: '60 minutes',
      ttlSeconds: 3600
    }, 'Break-glass dual authorization confirmed. Elevated emergency root bypass active for 60 minutes.');
  } catch (err) {
    logger.error('Failed to approve break glass', { error: err.message });
    next(err);
  }
};

/**
 * Get active Break-Glass procedures status
 */
export const getBreakGlassStatus = async (req, res, next) => {
  try {
    const [events] = await pool.query(
      `SELECT bg.*, u1.full_name as initiator_name, u2.full_name as approver_name
       FROM break_glass_events bg
       LEFT JOIN users u1 ON bg.initiator_user_id = u1.id
       LEFT JOIN users u2 ON bg.approver_user_id = u2.id
       ORDER BY bg.created_at DESC
       LIMIT 10`
    );

    const hasActive = events.some(e => e.status === 'ACTIVE' && new Date(e.expires_at) > new Date());
    return success(res, 200, {
      activeBreakGlass: hasActive,
      recentEvents: events
    }, 'Break-glass status retrieved');
  } catch (err) {
    logger.error('Failed to get break glass status', { error: err.message });
    next(err);
  }
};
