import crypto from 'node:crypto';
import pool from '../config/database.js';
import AuditLog from '../models/AuditLog.js';
import { success, error } from '../utils/response.js';
import { logger } from '../config/logger.js';
import { broadcastToRole } from '../socket/index.js';

export const listFeatureFlags = async (req, res, next) => {
  try {
    const { tenant_id } = req.query;
    let query = `SELECT * FROM feature_flags WHERE 1=1`;
    const params = [];

    if (tenant_id) {
      query += ` AND (tenant_id = ? OR tenant_id IS NULL)`;
      params.push(tenant_id);
    }

    query += ` ORDER BY created_at DESC`;

    const [rows] = await pool.query(query, params);
    const formatted = rows.map((r) => ({
      ...r,
      is_enabled: Boolean(r.is_enabled),
      rollout: `${r.rollout_percentage}%`,
      status: Boolean(r.is_enabled),
      metadata: typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata
    }));

    return success(res, 200, formatted, 'Feature flags retrieved');
  } catch (err) {
    logger.error('Failed to list feature flags', { error: err.message });
    next(err);
  }
};

export const createFeatureFlag = async (req, res, next) => {
  try {
    const { flag_key, name, description, environment = 'PROD', rollout_percentage = 100, is_enabled = true, tenant_id = null } = req.body;
    if (!flag_key || !name) {
      return error(res, 400, 'flag_key and name are required');
    }

    const id = crypto.randomUUID();
    await pool.query(
      `INSERT INTO feature_flags (id, flag_key, name, description, environment, rollout_percentage, is_enabled, tenant_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, flag_key, name, description, environment, rollout_percentage, is_enabled ? 1 : 0, tenant_id]
    );

    await AuditLog.create({
      user_id: req.user?.id || null,
      action: 'CREATE_FEATURE_FLAG',
      entity_type: 'FEATURE_FLAG',
      entity_id: id,
      new_value: req.body,
      ip_address: req.ip || '127.0.0.1'
    });

    return success(res, 201, { id, flag_key, name, is_enabled }, 'Feature flag created successfully');
  } catch (err) {
    logger.error('Failed to create feature flag', { error: err.message });
    next(err);
  }
};

export const toggleFeatureFlag = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { is_enabled, rollout_percentage } = req.body;

    const [rows] = await pool.query(`SELECT * FROM feature_flags WHERE flag_key = ?`, [key]);
    if (rows.length === 0) {
      return error(res, 404, `Feature flag '${key}' not found`);
    }

    const current = rows[0];
    const newStatus = is_enabled !== undefined ? (is_enabled ? 1 : 0) : (current.is_enabled ? 0 : 1);
    const newRollout = rollout_percentage !== undefined ? parseInt(rollout_percentage, 10) : current.rollout_percentage;

    await pool.query(
      `UPDATE feature_flags 
       SET is_enabled = ?, rollout_percentage = ?, updated_at = NOW() 
       WHERE flag_key = ?`,
      [newStatus, newRollout, key]
    );

    await AuditLog.create({
      user_id: req.user?.id || null,
      action: 'TOGGLE_FEATURE_FLAG',
      entity_type: 'FEATURE_FLAG',
      entity_id: current.id,
      new_value: { key, is_enabled: Boolean(newStatus), rollout: newRollout },
      ip_address: req.ip || '127.0.0.1'
    });

    broadcastToRole('SUPER_ADMIN', 'feature_flag_toggled', {
      key,
      is_enabled: Boolean(newStatus),
      rollout_percentage: newRollout
    });

    return success(res, 200, { key, is_enabled: Boolean(newStatus), rollout_percentage: newRollout }, `Feature flag '${key}' updated`);
  } catch (err) {
    logger.error('Failed to toggle feature flag', { error: err.message });
    next(err);
  }
};

export const emergencyKillSwitch = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { reason = 'Emergency mitigation / anomaly containment' } = req.body;

    const [rows] = await pool.query(`SELECT * FROM feature_flags WHERE flag_key = ?`, [key]);
    if (rows.length === 0) {
      return error(res, 404, `Feature flag '${key}' not found`);
    }

    await pool.query(
      `UPDATE feature_flags 
       SET is_enabled = 0, rollout_percentage = 0, updated_at = NOW() 
       WHERE flag_key = ?`,
      [key]
    );

    await AuditLog.create({
      user_id: req.user?.id || null,
      action: 'EMERGENCY_KILL_SWITCH_ENGAGED',
      entity_type: 'FEATURE_FLAG',
      entity_id: rows[0].id,
      new_value: { key, reason },
      ip_address: req.ip || '127.0.0.1'
    });

    broadcastToRole('SUPER_ADMIN', 'emergency_kill_switch_triggered', {
      key,
      reason,
      triggeredBy: req.user?.id,
      timestamp: new Date().toISOString()
    });

    logger.warn('Emergency kill-switch engaged for flag', { key, reason });

    return success(res, 200, {
      key,
      is_enabled: false,
      rollout_percentage: 0,
      reason,
      status: 'KILL_SWITCH_ACTIVE'
    }, `Emergency kill-switch engaged for '${key}'. Flag immediately disabled across all workers.`);
  } catch (err) {
    logger.error('Failed to engage kill switch', { error: err.message });
    next(err);
  }
};

export const getFeatureFlag = async (req, res, next) => {
  try {
    const { key } = req.params;
    const [rows] = await pool.query(`SELECT * FROM feature_flags WHERE flag_key = ? OR id = ?`, [key, key]);
    if (rows.length === 0) {
      return error(res, 404, `Feature flag '${key}' not found`);
    }
    const r = rows[0];
    const flag = {
      ...r,
      is_enabled: Boolean(r.is_enabled),
      rollout: `${r.rollout_percentage}%`,
      status: Boolean(r.is_enabled),
      metadata: typeof r.metadata === 'string' ? JSON.parse(r.metadata) : r.metadata
    };
    return success(res, 200, flag, 'Feature flag retrieved');
  } catch (err) {
    logger.error('Failed to get feature flag', { error: err.message });
    next(err);
  }
};

export const updateFeatureFlag = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { name, description, environment, rollout_percentage, is_enabled } = req.body;

    const [rows] = await pool.query(`SELECT * FROM feature_flags WHERE flag_key = ? OR id = ?`, [key, key]);
    if (rows.length === 0) {
      return error(res, 404, `Feature flag '${key}' not found`);
    }

    const current = rows[0];
    const updates = [];
    const values = [];

    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (environment !== undefined) { updates.push('environment = ?'); values.push(environment); }
    if (rollout_percentage !== undefined) { updates.push('rollout_percentage = ?'); values.push(parseInt(rollout_percentage, 10)); }
    if (is_enabled !== undefined) { updates.push('is_enabled = ?'); values.push(is_enabled ? 1 : 0); }

    if (updates.length > 0) {
      updates.push('updated_at = NOW()');
      values.push(current.id);
      await pool.query(`UPDATE feature_flags SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    await AuditLog.create({
      user_id: req.user?.id || null,
      action: 'UPDATE_FEATURE_FLAG',
      entity_type: 'FEATURE_FLAG',
      entity_id: current.id,
      old_value: current,
      new_value: req.body,
      ip_address: req.ip || '127.0.0.1'
    });

    const [updatedRows] = await pool.query(`SELECT * FROM feature_flags WHERE id = ?`, [current.id]);
    const r = updatedRows[0];
    const updated = {
      ...r,
      is_enabled: Boolean(r.is_enabled),
      rollout: `${r.rollout_percentage}%`,
      status: Boolean(r.is_enabled)
    };

    return success(res, 200, updated, 'Feature flag updated successfully');
  } catch (err) {
    logger.error('Failed to update feature flag', { error: err.message });
    next(err);
  }
};

export const deleteFeatureFlag = async (req, res, next) => {
  try {
    const { key } = req.params;
    const [rows] = await pool.query(`SELECT * FROM feature_flags WHERE flag_key = ? OR id = ?`, [key, key]);
    if (rows.length === 0) {
      return error(res, 404, `Feature flag '${key}' not found`);
    }

    const current = rows[0];
    await pool.query(`DELETE FROM feature_flags WHERE id = ?`, [current.id]);

    await AuditLog.create({
      user_id: req.user?.id || null,
      action: 'DELETE_FEATURE_FLAG',
      entity_type: 'FEATURE_FLAG',
      entity_id: current.id,
      old_value: current,
      ip_address: req.ip || '127.0.0.1'
    });

    return success(res, 200, null, 'Feature flag deleted successfully');
  } catch (err) {
    logger.error('Failed to delete feature flag', { error: err.message });
    next(err);
  }
};

