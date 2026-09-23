import Intern from '../models/Intern.js';
import AuditLog from '../models/AuditLog.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listInterns = asyncHandler(async (req, res) => {
  const { mentor_id, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Intern.list({ mentor_id, limit: parseInt(limit), offset }),
    Intern.count({ mentor_id })
  ]);

  return success(res, 200, items, 'Interns retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const createIntern = asyncHandler(async (req, res) => {
  let userId = req.body.user_id;
  if (!userId) {
    const email = req.body.email || `intern.${Date.now()}@ethiroli.com`;
    let user = await User.findByEmail(email);
    if (!user) {
      const defaultPassword = 'Intern@123';
      const password_hash = await bcrypt.hash(defaultPassword, 10);
      userId = await User.create({
        email,
        full_name: req.body.name || req.body.full_name || 'Intern Member',
        role: 'INTERN',
        password_hash,
        is_active: true
      });
    } else {
      userId = user.id;
    }
  }

  const startDate = req.body.start_date || new Date().toISOString().slice(0, 10);
  const endDate = req.body.end_date || new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
  const collegeName = req.body.college_name || 'Engineering Institution';
  const stipend = req.body.stipend !== undefined ? Number(req.body.stipend) : 15000;

  const id = await Intern.create({
    user_id: userId,
    mentor_id: req.body.mentor_id || null,
    college_name: collegeName,
    stipend,
    start_date: startDate,
    end_date: endDate
  });
  return success(res, 201, { id, user_id: userId }, 'Intern created successfully');
});

export const getIntern = asyncHandler(async (req, res) => {
  const intern = await Intern.findById(req.params.id);
  if (!intern) throw new NotFoundError('Intern not found');
  return success(res, 200, intern, 'Intern retrieved');
});

export const updateIntern = asyncHandler(async (req, res) => {
  const intern = await Intern.findById(req.params.id);
  if (!intern) throw new NotFoundError('Intern not found');
  await Intern.update(req.params.id, req.body);
  return success(res, 200, null, 'Intern updated successfully');
});

export const deleteIntern = asyncHandler(async (req, res) => {
  const intern = await Intern.findById(req.params.id);
  if (!intern) throw new NotFoundError('Intern not found');
  await Intern.delete(req.params.id);
  return success(res, 200, null, 'Intern deleted successfully');
});

export const getInternDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const dashboardData = await Intern.getDashboardData(userId);
  return success(res, 200, dashboardData, 'Intern dashboard data retrieved');
});

export const getInternPortalConfig = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const config = await Intern.getPortalConfig(userId);
  return success(res, 200, config, 'Intern portal configuration retrieved');
});

