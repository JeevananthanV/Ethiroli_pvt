import bcrypt from 'bcrypt';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

export const listUsers = async (req, res) => {
  const { role, is_active, limit = 50, offset = 0 } = req.query;

  try {
    const users = await User.list({
      role,
      is_active: is_active !== undefined ? is_active === 'true' : undefined,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ message: 'Failed to list users.' });
  }
};

export const createUser = async (req, res) => {
  const { email, password, full_name, phone, role } = req.body;

  try {
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'User with this email already exists.' });
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

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Failed to create user.' });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { full_name, phone, role, is_active } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

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

    res.status(200).json({ message: 'User updated successfully.' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user.' });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await User.softDelete(id);

    await AuditLog.create({
      user_id: req.user.id,
      action: 'SOFT_DELETE_USER',
      entity_type: 'USER',
      entity_id: id,
      ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      user_agent: req.headers['user-agent']
    });

    res.status(200).json({ message: 'User soft-deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user.' });
  }
};
