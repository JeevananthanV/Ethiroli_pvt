import Employee from '../models/Employee.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listEmployees = asyncHandler(async (req, res) => {
  const list = await Employee.list();
  return success(res, 200, list);
});

export const createEmployee = asyncHandler(async (req, res) => {
  const id = await Employee.create(req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_EMPLOYEE',
    entity_type: 'EMPLOYEE',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'employee_created', { id });
  return success(res, 201, { id }, 'Employee created successfully');
});

export const getEmployee = asyncHandler(async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (!emp) throw new NotFoundError('Employee not found');
  return success(res, 200, emp);
});

export const updateEmployee = asyncHandler(async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (!emp) throw new NotFoundError('Employee not found');
  await Employee.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_EMPLOYEE',
    entity_type: 'EMPLOYEE',
    entity_id: req.params.id,
    old_value: emp,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'employee_updated', { id: req.params.id });
  return success(res, 200, null, 'Employee updated successfully');
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (!emp) throw new NotFoundError('Employee not found');
  await Employee.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_EMPLOYEE',
    entity_type: 'EMPLOYEE',
    entity_id: req.params.id,
    old_value: emp,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'employee_deleted', { id: req.params.id });
  return success(res, 200, null, 'Employee deleted successfully');
});
