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

import bcrypt from 'bcryptjs';
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
    end_date: endDate,
    project_target: req.body.project_target || null,
    progress: req.body.progress !== undefined ? Number(req.body.progress) : 0
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

  if (intern.user_id && (req.body.name || req.body.full_name || req.body.email)) {
    const userUpdates = {};
    if (req.body.name || req.body.full_name) userUpdates.full_name = req.body.name || req.body.full_name;
    if (req.body.email) userUpdates.email = req.body.email;
    await User.update(intern.user_id, userUpdates);
  }

  const updated = await Intern.findById(req.params.id);
  return success(res, 200, updated, 'Intern updated successfully');
});

export const deleteIntern = asyncHandler(async (req, res) => {
  const intern = await Intern.findById(req.params.id);
  if (!intern) throw new NotFoundError('Intern not found');
  await Intern.delete(req.params.id);
  if (intern.user_id) {
    await User.softDelete(intern.user_id);
    const pool = (await import('../config/database.js')).default;
    await pool.query('DELETE FROM sessions WHERE user_id = ?', [intern.user_id]);
  }
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

/**
 * The signed-in intern's own record.
 *
 * /interns (roster) and /interns/:id stay admin-only, so an intern can read
 * their own profile without gaining access to everyone else's.
 */
export const getMyInternProfile = asyncHandler(async (req, res) => {
  const intern = await Intern.findByUserId(req.user.id);
  if (!intern) throw new NotFoundError('No intern profile is linked to this account yet.');
  return success(res, 200, intern, 'Intern profile retrieved');
});

export const getAvailableMentors = asyncHandler(async (req, res) => {
  const pool = (await import('../config/database.js')).default;
  // There is no 'MENTOR' role in this schema - mentors are tutors. The old
  // list therefore never matched and always returned empty.
  const [rows] = await pool.execute(
    `SELECT id, full_name, email, role FROM users
     WHERE role IN ('TUTOR', 'SENIOR_TUTOR', 'HR', 'ADMIN', 'SUPER_ADMIN') AND is_active = true
     ORDER BY full_name`
  );
  return success(res, 200, rows, 'Available mentors retrieved');
});

export const bulkUpdateInterns = asyncHandler(async (req, res) => {
  const { ids, data } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return success(res, 400, null, 'No intern IDs provided');
  }
  
  const pool = (await import('../config/database.js')).default;
  const placeholders = ids.map(() => '?').join(',');
  const updates = [];
  const values = [];
  
  if (data.mentor_id !== undefined) { updates.push('mentor_id = ?'); values.push(data.mentor_id); }
  if (data.progress !== undefined) { updates.push('progress = ?'); values.push(Number(data.progress)); }
  if (data.status !== undefined) { updates.push('status = ?'); values.push(data.status); }
  
  if (updates.length === 0) {
    return success(res, 400, null, 'No valid fields to update');
  }
  
  values.push(...ids);
  await pool.execute(`UPDATE interns SET ${updates.join(', ')} WHERE id IN (${placeholders})`, values);
  
  return success(res, 200, { updated: ids.length }, `${ids.length} interns updated successfully`);
});

export const exportInterns = asyncHandler(async (req, res) => {
  const { mentor_id } = req.query;
  
  const pool = (await import('../config/database.js')).default;
  let query = `
    SELECT i.*, u.email, u.full_name, m.full_name as mentor_name 
    FROM interns i
    JOIN users u ON i.user_id = u.id
    LEFT JOIN users m ON i.mentor_id = m.id
  `;
  const params = [];
  
  if (mentor_id) {
    query += ' WHERE i.mentor_id = ?';
    params.push(mentor_id);
  }
  
  const [rows] = await pool.execute(query, params);
  
  // Format as CSV
  const headers = ['ID', 'Name', 'Email', 'Mentor', 'College', 'Stipend', 'Start Date', 'End Date', 'Progress', 'Project Target'];
  const csvRows = rows.map(row => [
    row.id,
    row.full_name,
    row.email,
    row.mentor_name || 'Unassigned',
    row.college_name,
    row.stipend,
    row.start_date,
    row.end_date,
    row.progress,
    row.project_target || ''
  ]);
  
  const csvContent = [headers.join(','), ...csvRows.map(r => r.join(','))].join('\n');
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=interns-export-${new Date().toISOString().slice(0,10)}.csv`);
  return res.send(csvContent);
});

