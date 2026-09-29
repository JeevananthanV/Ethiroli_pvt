import TechnologyModule from '../models/technology/TechnologyModule.js';
import CourseModule from '../models/technology/CourseModule.js';
import Program from '../models/technology/Program.js';
import ProgramModule from '../models/technology/ProgramModule.js';
import pool from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export const assembleCourse = asyncHandler(async (req, res) => {
  const { courseId, moduleCodes } = req.body;
  if (!courseId || !Array.isArray(moduleCodes) || moduleCodes.length === 0) {
    throw new BadRequestError('courseId and moduleCodes array are required');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    let order = 1;
    for (const code of moduleCodes) {
      const mod = await TechnologyModule.findByCode(code);
      if (!mod) throw new BadRequestError(`Module not found: ${code}`);
      await conn.execute(
        'INSERT INTO course_modules (id, course_id, module_id, module_order) VALUES (UUID(), ?, ?, ?)',
        [courseId, mod.id, order++]
      );
    }
    await conn.commit();
    return success(res, 201, { courseId, modulesAdded: moduleCodes.length }, 'Course curriculum assembled');
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

export const assembleProgram = asyncHandler(async (req, res) => {
  const { programId, moduleSequence } = req.body;
  if (!programId || !Array.isArray(moduleSequence) || moduleSequence.length === 0) {
    throw new BadRequestError('programId and moduleSequence array are required');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const item of moduleSequence) {
      const mod = await TechnologyModule.findByCode(item.module);
      if (!mod) throw new BadRequestError(`Module not found: ${item.module}`);
      await conn.execute(
        'INSERT INTO program_modules (id, program_id, module_id, module_order, allocated_days, start_day, end_day, is_core) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)',
        [programId, mod.id, item.order, item.days, item.start_day || null, item.end_day || null, item.is_core !== false ? 1 : 0]
      );
    }
    await conn.commit();
    return success(res, 201, { programId, modulesAdded: moduleSequence.length }, 'Program curriculum assembled');
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

export const importModulesToCourse = asyncHandler(async (req, res) => {
  const { courseId, modules } = req.body;
  if (!courseId || !Array.isArray(modules) || modules.length === 0) {
    throw new BadRequestError('courseId and modules array are required');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const m of modules) {
      const mod = await TechnologyModule.findByCode(m.module);
      if (!mod) throw new BadRequestError(`Module not found: ${m.module}`);
      await conn.execute(
        'INSERT INTO course_modules (id, course_id, module_id, module_order, is_optional, custom_duration_days) VALUES (UUID(), ?, ?, ?, ?, ?)',
        [courseId, mod.id, m.module_order || 1, m.is_optional ? 1 : 0, m.custom_duration_days || null]
      );
    }
    await conn.commit();
    return success(res, 201, { courseId, modulesAdded: modules.length }, 'Modules imported to course');
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

export const importModulesToProgram = asyncHandler(async (req, res) => {
  const { programId, modules } = req.body;
  if (!programId || !Array.isArray(modules) || modules.length === 0) {
    throw new BadRequestError('programId and modules array are required');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const m of modules) {
      const mod = await TechnologyModule.findByCode(m.module);
      if (!mod) throw new BadRequestError(`Module not found: ${m.module}`);
      await conn.execute(
        'INSERT INTO program_modules (id, program_id, module_id, module_order, allocated_days, start_day, end_day, is_core) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)',
        [programId, mod.id, m.module_order || 1, m.allocated_days || 1, m.start_day || null, m.end_day || null, m.is_core !== false ? 1 : 0]
      );
    }
    await conn.commit();
    return success(res, 201, { programId, modulesAdded: modules.length }, 'Modules imported to program');
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});
