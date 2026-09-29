import TechnologyModule from '../models/technology/TechnologyModule.js';
import CourseModule from '../models/technology/CourseModule.js';
import Program from '../models/technology/Program.js';
import ProgramModule from '../models/technology/ProgramModule.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import AuditLog from '../models/AuditLog.js';
import pool from '../config/database.js';

export const listTechnologyModules = asyncHandler(async (req, res) => {
  const { category, level, is_active } = req.query;
  const modules = await TechnologyModule.list({ category, level, is_active });
  return success(res, 200, modules, 'Technology modules retrieved');
});

export const createTechnologyModule = asyncHandler(async (req, res) => {
  const data = req.body;
  const id = await TechnologyModule.create(data);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_TECHNOLOGY_MODULE',
    entity_type: 'TECHNOLOGY_MODULE',
    entity_id: id,
    new_value: data,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 201, { id }, 'Technology module created successfully');
});

export const getTechnologyModule = asyncHandler(async (req, res) => {
  const mod = await TechnologyModule.findById(req.params.id);
  if (!mod) throw new NotFoundError('Technology module not found');
  return success(res, 200, mod, 'Technology module retrieved');
});

export const updateTechnologyModule = asyncHandler(async (req, res) => {
  const mod = await TechnologyModule.findById(req.params.id);
  if (!mod) throw new NotFoundError('Technology module not found');
  await TechnologyModule.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_TECHNOLOGY_MODULE',
    entity_type: 'TECHNOLOGY_MODULE',
    entity_id: req.params.id,
    old_value: mod,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 200, null, 'Technology module updated successfully');
});

export const removeTechnologyModule = asyncHandler(async (req, res) => {
  const mod = await TechnologyModule.findById(req.params.id);
  if (!mod) throw new NotFoundError('Technology module not found');
  await TechnologyModule.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_TECHNOLOGY_MODULE',
    entity_type: 'TECHNOLOGY_MODULE',
    entity_id: req.params.id,
    old_value: mod,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  return success(res, 200, null, 'Technology module removed successfully');
});

export const listModulesByCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId || req.query.course_id;
  const modules = await CourseModule.listByCourseId(courseId);
  return success(res, 200, modules, 'Modules for course retrieved');
});

export const listModulesByProgram = asyncHandler(async (req, res) => {
  const programId = req.params.programId || req.query.program_id;
  const modules = await ProgramModule.listByProgramId(programId);
  return success(res, 200, modules, 'Modules for program retrieved');
});
