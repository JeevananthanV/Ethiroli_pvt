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

export const createIntern = asyncHandler(async (req, res) => {
  const { user_id, mentor_id, college_name, stipend, start_date, end_date } = req.body;
  const id = await Intern.create({
    user_id,
    mentor_id,
    college_name,
    stipend,
    start_date,
    end_date
  });
  return success(res, 201, { id }, 'Intern created successfully');
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

