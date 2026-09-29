import Employee from '../models/Employee.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const listEmployees = asyncHandler(async (req, res) => {
  const list = await Employee.list();
  return success(res, 200, list);
});

export const createEmployee = asyncHandler(async (req, res) => {
  let userId = req.body.user_id;
  if (!userId) {
    const email = req.body.email || `employee.${Date.now()}@ethiroli.com`;
    let user = await User.findByEmail(email);
    if (!user) {
      const defaultPassword = 'Employee@123';
      const password_hash = await bcrypt.hash(defaultPassword, 10);
      userId = await User.create({
        email,
        full_name: req.body.name || req.body.full_name || 'Staff Member',
        role: 'EMPLOYEE',
        password_hash,
        is_active: true
      });
    } else {
      userId = user.id;
    }
  }

  const employeeCode = req.body.employee_code || `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateOfJoining = req.body.date_of_joining || new Date().toISOString().slice(0, 10);

  const payload = {
    ...req.body,
    user_id: userId,
    employee_code: employeeCode,
    date_of_joining: dateOfJoining
  };

  const id = await Employee.create(payload);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_EMPLOYEE',
    entity_type: 'EMPLOYEE',
    entity_id: id,
    new_value: payload,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'employee_created', { id });
  return success(res, 201, { id, user_id: userId, employee_code: employeeCode }, 'Employee created successfully');
});

export const getEmployee = asyncHandler(async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (!emp) throw new NotFoundError('Employee not found');
  return success(res, 200, emp);
});

import pool from '../config/database.js';

export const updateEmployee = asyncHandler(async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (!emp) throw new NotFoundError('Employee not found');
  await Employee.update(req.params.id, req.body);

  if (emp.user_id && (req.body.name || req.body.full_name || req.body.email || req.body.is_active !== undefined)) {
    const userUpdates = {};
    if (req.body.name || req.body.full_name) userUpdates.full_name = req.body.name || req.body.full_name;
    if (req.body.email) userUpdates.email = req.body.email;
    if (req.body.is_active !== undefined) userUpdates.is_active = Boolean(req.body.is_active);
    await User.update(emp.user_id, userUpdates);
  }

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
  const updated = await Employee.findById(req.params.id);
  return success(res, 200, updated, 'Employee updated successfully');
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (!emp) throw new NotFoundError('Employee not found');
  await Employee.delete(req.params.id);
  if (emp.user_id) {
    await User.softDelete(emp.user_id);
    await pool.query('DELETE FROM sessions WHERE user_id = ?', [emp.user_id]);
  }
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
