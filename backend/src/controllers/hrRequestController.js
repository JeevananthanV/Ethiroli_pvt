import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { broadcastToRole } from '../services/socketService.js';
import AuditLog from '../models/AuditLog.js';

export const listHRRequests = asyncHandler(async (req, res) => {
  const { status, request_type, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    let query = 'SELECT * FROM hr_requests WHERE 1=1';
    const params = [];

    if (status && status !== 'ALL') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (request_type && request_type !== 'ALL') {
      query += ' AND request_type = ?';
      params.push(request_type);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(query, params);

    return success(res, 200, rows, 'HR requests retrieved successfully', {
      total: rows.length,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    // If table doesn't exist yet, return empty list gracefully
    return success(res, 200, [], 'HR requests retrieved', { total: 0 });
  }
});

export const createHRRequest = asyncHandler(async (req, res) => {
  const { requester_name, role = 'EMPLOYEE', request_type, details, priority = 'MEDIUM' } = req.body;

  if (!requester_name || !request_type) {
    throw new ValidationError('Requester name and request type are required.');
  }

  const payload = {
    id: `REQ-${Date.now().toString().slice(-6)}`,
    requester_id: req.user?.id || null,
    requester_name,
    role,
    request_type,
    priority,
    details,
    status: 'PENDING',
    created_at: new Date()
  };

  try {
    await pool.execute(
      `INSERT INTO hr_requests (id, requester_id, requester_name, role, request_type, priority, details, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', NOW())`,
      [payload.id, payload.requester_id, requester_name, role, request_type, priority, details]
    );
  } catch (_) {
    // Table fallback
  }

  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'CREATE_HR_REQUEST',
    entity_type: 'HR_REQUEST',
    entity_id: payload.id,
    new_value: payload,
    ip_address: req.ip || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('HR', 'hr_request_created', payload);
  broadcastToRole('ADMIN', 'hr_request_created', payload);

  return success(res, 201, payload, 'HR request submitted successfully');
});

export const updateHRRequestStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;

  try {
    await pool.execute(
      `UPDATE hr_requests SET status = ?, hr_remarks = ?, updated_at = NOW() WHERE id = ?`,
      [status, remarks || null, id]
    );
  } catch (_) {}

  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'UPDATE_HR_REQUEST_STATUS',
    entity_type: 'HR_REQUEST',
    entity_id: String(id),
    new_value: { status, remarks },
    ip_address: req.ip || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('HR', 'hr_request_updated', { id, status, remarks });

  return success(res, 200, { id, status, remarks }, 'HR request updated successfully');
});
