import { validateRequired, validateEnum, validateUUID, sanitizeInput } from '../utils/validators.js';
import RecurringSchedule from '../models/RecurringSchedule.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

const ALLOWED_FREQUENCIES = ['MONTHLY', 'QUARTERLY', 'YEARLY'];

export const listRecurringSchedules = asyncHandler(async (req, res) => {
  const { client_id, student_id, is_active } = req.query;
  const list = await RecurringSchedule.list({
    client_id: sanitizeInput(client_id),
    student_id: sanitizeInput(student_id),
    is_active: is_active !== undefined ? is_active === 'true' : undefined
  });
  return success(res, 200, list);
});

export const getRecurringSchedule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateUUID(id)) {
    throw new ValidationError('Invalid recurring schedule ID format.');
  }
  const schedule = await RecurringSchedule.findById(id);
  if (!schedule) {
    throw new NotFoundError('Recurring schedule not found.');
  }
  return success(res, 200, schedule);
});

export const createRecurringSchedule = asyncHandler(async (req, res) => {
  const body = sanitizeInput(req.body);
  const { frequency, next_generation_date, client_id, student_id } = body;

  const missing = validateRequired(body, ['frequency', 'next_generation_date']);
  if (missing.length > 0) {
    throw new ValidationError('Missing required fields.', { missing });
  }

  if (!validateEnum(frequency, ALLOWED_FREQUENCIES)) {
    throw new ValidationError('Invalid frequency value.', { allowed: ALLOWED_FREQUENCIES });
  }

  if (!client_id && !student_id) {
    throw new ValidationError('Either client_id or student_id must be provided.');
  }

  if (client_id && !validateUUID(client_id)) {
    throw new ValidationError('Invalid client_id format.');
  }
  if (student_id && !validateUUID(student_id)) {
    throw new ValidationError('Invalid student_id format.');
  }

  const id = await RecurringSchedule.create({
    frequency,
    next_generation_date,
    client_id: client_id || null,
    student_id: student_id || null
  });

  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'CREATE_RECURRING_SCHEDULE',
    entity_type: 'RECURRING_SCHEDULE',
    entity_id: id,
    new_value: body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  broadcastToRole('ADMIN', 'recurring_schedule_created', { id, frequency });
  broadcastToRole('SUPER_ADMIN', 'recurring_schedule_created', { id, frequency });

  return success(res, 201, { message: 'Recurring schedule created.', id });
});

export const updateRecurringSchedule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateUUID(id)) {
    throw new ValidationError('Invalid recurring schedule ID format.');
  }

  const existing = await RecurringSchedule.findById(id);
  if (!existing) {
    throw new NotFoundError('Recurring schedule not found.');
  }

  const body = sanitizeInput(req.body);
  const updates = {};

  if (body.frequency !== undefined) {
    if (!validateEnum(body.frequency, ALLOWED_FREQUENCIES)) {
      throw new ValidationError('Invalid frequency value.', { allowed: ALLOWED_FREQUENCIES });
    }
    updates.frequency = body.frequency;
  }
  if (body.next_generation_date !== undefined) {
    updates.next_generation_date = body.next_generation_date;
  }
  if (body.last_generated_at !== undefined) {
    updates.last_generated_at = body.last_generated_at;
  }
  if (body.is_active !== undefined) {
    updates.is_active = body.is_active;
  }

  await RecurringSchedule.update(id, updates);

  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'UPDATE_RECURRING_SCHEDULE',
    entity_type: 'RECURRING_SCHEDULE',
    entity_id: id,
    old_value: existing,
    new_value: updates,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, { message: 'Recurring schedule updated.' });
});

export const deleteRecurringSchedule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!validateUUID(id)) {
    throw new ValidationError('Invalid recurring schedule ID format.');
  }

  const existing = await RecurringSchedule.findById(id);
  if (!existing) {
    throw new NotFoundError('Recurring schedule not found.');
  }

  await RecurringSchedule.delete(id);

  await AuditLog.create({
    user_id: req.user?.id || null,
    action: 'DELETE_RECURRING_SCHEDULE',
    entity_type: 'RECURRING_SCHEDULE',
    entity_id: id,
    old_value: existing,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });

  return success(res, 200, { message: 'Recurring schedule deleted.' });
});
