import bcrypt from 'bcrypt';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new NotFoundError('User not found');
  return success(res, 200, user);
});

export const listUsers = asyncHandler(async (req, res) => {
  const { role, is_active, limit = 50, offset = 0 } = req.query;

  const users = await User.list({
    role,
    is_active: is_active !== undefined ? is_active === 'true' : undefined,
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10)
  });
  return success(res, 200, users);
});

export const createUser = asyncHandler(async (req, res) => {
  const { email, password, full_name, phone, role } = req.body;

  const existing = await User.findByEmail(email);
  if (existing) {
    throw new ValidationError('User with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({
    email,
    password_hash: passwordHash,
    full_name,
    phone,
    role
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_USER',
    entity_type: 'USER',
    new_value: { email, full_name, role },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 201, null, 'User created successfully');
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { full_name, phone, role, is_active } = req.body;

  const user = await User.findById(id);
  if (!user) throw new NotFoundError('User not found');

  const oldValues = {
    full_name: user.full_name,
    phone: user.phone,
    role: user.role,
    is_active: user.is_active
  };

  const updates = { full_name, phone, role, is_active };
  await User.update(id, updates);

  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_USER',
    entity_type: 'USER',
    entity_id: id,
    old_value: oldValues,
    new_value: updates,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, null, 'User updated successfully');
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) throw new NotFoundError('User not found');

  await User.softDelete(id);

  await AuditLog.create({
    user_id: req.user.id,
    action: 'SOFT_DELETE_USER',
    entity_type: 'USER',
    entity_id: id,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, null, 'User soft-deleted successfully');
});
