import fs from 'fs';
import path from 'path';

const CONTROLLERS_DIR = path.join(process.cwd(), 'src', 'controllers');
const ROUTES_DIR = path.join(process.cwd(), 'src', 'routes');

function toPascalCase(str) {
  return str.replace(/(^|_)(\w)/g, (_, __, c) => c.toUpperCase());
}

function writePayrollController() {
  const code = `import Payroll from '../models/Payroll.js';
import SalaryStructure from '../models/SalaryStructure.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listSalaryStructures = asyncHandler(async (req, res) => {
  const active = await SalaryStructure.findActiveByEmployeeId(req.query.employee_id);
  success(res, 200, active ? [active] : [], 'Salary structures retrieved');
});

export const createSalaryStructure = asyncHandler(async (req, res) => {
  const id = await SalaryStructure.create(req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_SALARY_STRUCTURE',
    entity_type: 'SALARY_STRUCTURE',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('FINANCE', 'salary_structure_created', { id });
  success(res, 201, { id }, 'Salary structure created');
});

export const processPayroll = asyncHandler(async (req, res) => {
  const { employee_id, month_year, basic, hra, da = 0, pf_employee = 0, pf_employer = 0, esi_employee = 0, esi_employer = 0, tds = 0 } = req.body;
  const gross = parseFloat(basic) + parseFloat(hra) + parseFloat(da);
  const totalDeductions = parseFloat(pf_employee) + parseFloat(esi_employee) + parseFloat(tds);
  const net = gross - totalDeductions;

  const id = await Payroll.create({
    employee_id, month_year, basic, hra, da,
    pf_employee, pf_employer, esi_employee, esi_employer, tds,
    gross_salary: gross, net_salary: net, total_deductions: totalDeductions,
    status: 'PROCESSED'
  });

  await AuditLog.create({
    user_id: req.user.id,
    action: 'PROCESS_PAYROLL',
    entity_type: 'PAYROLL',
    entity_id: id,
    new_value: { employee_id, month_year, gross, net, total_deductions },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('FINANCE', 'payroll_processed', { id, employee_id, month_year });
  success(res, 201, { id }, 'Payroll processed');
});

export const runPayrollForAll = asyncHandler(async (req, res) => {
  const { month_year } = req.body;
  await AuditLog.create({
    user_id: req.user.id,
    action: 'RUN_PAYROLL_FOR_ALL',
    entity_type: 'PAYROLL',
    new_value: { month_year },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('FINANCE', 'bulk_payroll_run', { month_year });
  success(res, 200, { processed: 0, month_year }, 'Bulk payroll run initiated');
});

export const listPayrollHistory = asyncHandler(async (req, res) => {
  const { employee_id, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Payroll.list({ employee_id, limit: parseInt(limit), offset }),
    Payroll.count({ employee_id })
  ]);

  success(res, 200, items, 'Payroll history retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const generatePayslip = asyncHandler(async (req, res) => {
  const payroll = await Payroll.findById(req.params.id);
  if (!payroll) throw new NotFoundError('Payroll record not found');

  await AuditLog.create({
    user_id: req.user.id,
    action: 'GENERATE_PAYSLIP',
    entity_type: 'PAYROLL',
    entity_id: req.params.id,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('FINANCE', 'payslip_generated', { id: req.params.id });
  success(res, 200, { id: req.params.id }, 'Payslip generated successfully');
});
`;
  const filePath = path.join(CONTROLLERS_DIR, 'payrollController.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writePerformanceController() {
  const code = `import PerformanceReview from '../models/PerformanceReview.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listReviews = asyncHandler(async (req, res) => {
  const { employee_id, reviewer_id, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    PerformanceReview.list({ employee_id, reviewer_id, limit: parseInt(limit), offset }),
    PerformanceReview.count({ employee_id, reviewer_id })
  ]);

  return success(res, 200, items, 'Performance reviews retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createReview = asyncHandler(async (req, res) => {
  const id = await PerformanceReview.create({ ...req.body, reviewer_id: req.user.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_PERFORMANCE_REVIEW',
    entity_type: 'PERFORMANCE_REVIEW',
    entity_id: id,
    new_value: { ...req.body, reviewer_id: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'performance_review_created', { id });
  return success(res, 201, { id }, 'Performance review submitted');
});

export const getReview = asyncHandler(async (req, res) => {
  const review = await PerformanceReview.findById(req.params.id);
  if (!review) throw new NotFoundError('Performance review not found');
  return success(res, 200, review, 'Performance review retrieved');
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await PerformanceReview.findById(req.params.id);
  if (!review) throw new NotFoundError('Performance review not found');
  await PerformanceReview.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_PERFORMANCE_REVIEW',
    entity_type: 'PERFORMANCE_REVIEW',
    entity_id: req.params.id,
    old_value: review,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'performance_review_updated', { id: req.params.id });
  return success(res, 200, null, 'Performance review updated successfully');
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await PerformanceReview.findById(req.params.id);
  if (!review) throw new NotFoundError('Performance review not found');
  await PerformanceReview.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_PERFORMANCE_REVIEW',
    entity_type: 'PERFORMANCE_REVIEW',
    entity_id: req.params.id,
    old_value: review,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'performance_review_deleted', { id: req.params.id });
  return success(res, 200, null, 'Performance review deleted successfully');
});
`;
  const filePath = path.join(CONTROLLERS_DIR, 'performanceController.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writeHolidayController() {
  const code = `import Holiday from '../models/Holiday.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listHolidays = asyncHandler(async (req, res) => {
  const { year, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Holiday.list({ year, limit: parseInt(limit), offset }),
    Holiday.count({ year })
  ]);

  return success(res, 200, items, 'Holidays retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createHoliday = asyncHandler(async (req, res) => {
  const id = await Holiday.create(req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_HOLIDAY',
    entity_type: 'HOLIDAY',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'holiday_created', { id });
  return success(res, 201, { id }, 'Holiday registered successfully');
});

export const getHoliday = asyncHandler(async (req, res) => {
  const holiday = await Holiday.findById(req.params.id);
  if (!holiday) throw new NotFoundError('Holiday not found');
  return success(res, 200, holiday, 'Holiday retrieved');
});

export const updateHoliday = asyncHandler(async (req, res) => {
  const holiday = await Holiday.findById(req.params.id);
  if (!holiday) throw new NotFoundError('Holiday not found');
  await Holiday.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_HOLIDAY',
    entity_type: 'HOLIDAY',
    entity_id: req.params.id,
    old_value: holiday,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'holiday_updated', { id: req.params.id });
  return success(res, 200, null, 'Holiday updated successfully');
});

export const deleteHoliday = asyncHandler(async (req, res) => {
  const holiday = await Holiday.findById(req.params.id);
  if (!holiday) throw new NotFoundError('Holiday not found');
  await Holiday.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_HOLIDAY',
    entity_type: 'HOLIDAY',
    entity_id: req.params.id,
    old_value: holiday,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('HR', 'holiday_deleted', { id: req.params.id });
  return success(res, 200, null, 'Holiday deleted successfully');
});
`;
  const filePath = path.join(CONTROLLERS_DIR, 'holidayController.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writeCalendarController() {
  const code = `import CalendarEvent from '../models/CalendarEvent.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';
import { broadcastToRole } from '../services/socketService.js';

export const listEvents = asyncHandler(async (req, res) => {
  const { start_date, end_date, event_type, created_by, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    CalendarEvent.list({ start_date, end_date, event_type, created_by, limit: parseInt(limit), offset }),
    CalendarEvent.count({ start_date, end_date, event_type, created_by })
  ]);

  return success(res, 200, items, 'Calendar events retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createEvent = asyncHandler(async (req, res) => {
  const id = await CalendarEvent.create({ ...req.body, created_by: req.user.id });
  broadcastToRole('EMPLOYEE', 'calendar_event_created', { id });
  return success(res, 201, { id }, 'Event created successfully');
});

export const getEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findById(req.params.id);
  if (!event) throw new NotFoundError('Calendar event not found');
  return success(res, 200, event, 'Event retrieved');
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findById(req.params.id);
  if (!event) throw new NotFoundError('Calendar event not found');
  await CalendarEvent.update(req.params.id, req.body);
  broadcastToRole('EMPLOYEE', 'calendar_event_updated', { id: req.params.id });
  return success(res, 200, null, 'Event updated successfully');
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findById(req.params.id);
  if (!event) throw new NotFoundError('Calendar event not found');
  await CalendarEvent.delete(req.params.id);
  broadcastToRole('EMPLOYEE', 'calendar_event_deleted', { id: req.params.id });
  return success(res, 200, null, 'Event deleted successfully');
});
`;
  const filePath = path.join(CONTROLLERS_DIR, 'calendarController.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writeWorkflowController() {
  const code = `import Workflow from '../models/Workflow.js';
import ApprovalChain from '../models/ApprovalChain.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listWorkflows = asyncHandler(async (req, res) => {
  const { is_active, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    Workflow.list({ is_active, limit: parseInt(limit), offset }),
    Workflow.count({ is_active })
  ]);

  return success(res, 200, items, 'Workflows retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createWorkflow = asyncHandler(async (req, res) => {
  const id = await Workflow.create(req.body);
  return success(res, 201, { id }, 'Workflow created successfully');
});

export const getWorkflow = asyncHandler(async (req, res) => {
  const workflow = await Workflow.findById(req.params.id);
  if (!workflow) throw new NotFoundError('Workflow not found');
  return success(res, 200, workflow, 'Workflow retrieved');
});

export const updateWorkflow = asyncHandler(async (req, res) => {
  const workflow = await Workflow.findById(req.params.id);
  if (!workflow) throw new NotFoundError('Workflow not found');
  await Workflow.update(req.params.id, req.body);
  return success(res, 200, null, 'Workflow updated successfully');
});

export const deleteWorkflow = asyncHandler(async (req, res) => {
  const workflow = await Workflow.findById(req.params.id);
  if (!workflow) throw new NotFoundError('Workflow not found');
  await Workflow.delete(req.params.id);
  return success(res, 200, null, 'Workflow deleted successfully');
});

export const listChainSteps = asyncHandler(async (req, res) => {
  const steps = await ApprovalChain.listByWorkflowId(req.params.workflowId);
  return success(res, 200, steps, 'Approval chain steps retrieved');
});

export const createChainStep = asyncHandler(async (req, res) => {
  const id = await ApprovalChain.create({ ...req.body, workflow_id: req.params.workflowId });
  return success(res, 201, { id }, 'Chain step created');
});

export const updateChainStep = asyncHandler(async (req, res) => {
  const step = await ApprovalChain.findById(req.params.id);
  if (!step) throw new NotFoundError('Chain step not found');
  await ApprovalChain.update(req.params.id, req.body);
  return success(res, 200, null, 'Chain step updated');
});

export const deleteChainStep = asyncHandler(async (req, res) => {
  const step = await ApprovalChain.findById(req.params.id);
  if (!step) throw new NotFoundError('Chain step not found');
  await ApprovalChain.delete(req.params.id);
  return success(res, 200, null, 'Chain step deleted');
});
`;
  const filePath = path.join(CONTROLLERS_DIR, 'workflowController.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writeApprovalController() {
  const code = `import ApprovalInstance from '../models/ApprovalInstance.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listInstances = asyncHandler(async (req, res) => {
  const { entity_type, entity_id, status, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    ApprovalInstance.list({ entity_type, entity_id, status, limit: parseInt(limit), offset }),
    ApprovalInstance.count({ entity_type, entity_id, status })
  ]);

  return success(res, 200, items, 'Approval instances retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const getInstance = asyncHandler(async (req, res) => {
  const instance = await ApprovalInstance.findById(req.params.id);
  if (!instance) throw new NotFoundError('Approval instance not found');
  return success(res, 200, instance, 'Approval instance retrieved');
});

export const approveInstance = asyncHandler(async (req, res) => {
  const instance = await ApprovalInstance.findById(req.params.id);
  if (!instance) throw new NotFoundError('Approval instance not found');
  await ApprovalInstance.update(req.params.id, { ...req.body, status: 'APPROVED', completed_at: new Date() });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'APPROVE_INSTANCE',
    entity_type: 'APPROVAL_INSTANCE',
    entity_id: req.params.id,
    old_value: instance,
    new_value: { ...req.body, status: 'APPROVED', completed_at: new Date() },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole(req.user.role, 'approval_instance_approved', { id: req.params.id });
  return success(res, 200, null, 'Approval instance approved');
});

export const rejectInstance = asyncHandler(async (req, res) => {
  const instance = await ApprovalInstance.findById(req.params.id);
  if (!instance) throw new NotFoundError('Approval instance not found');
  await ApprovalInstance.update(req.params.id, { ...req.body, status: 'REJECTED', completed_at: new Date() });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'REJECT_INSTANCE',
    entity_type: 'APPROVAL_INSTANCE',
    entity_id: req.params.id,
    old_value: instance,
    new_value: { ...req.body, status: 'REJECTED', completed_at: new Date() },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole(req.user.role, 'approval_instance_rejected', { id: req.params.id });
  return success(res, 200, null, 'Approval instance rejected');
});
`;
  const filePath = path.join(CONTROLLERS_DIR, 'approvalController.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writeCompanySettingController() {
  const code = `import CompanySetting from '../models/CompanySetting.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listSettings = asyncHandler(async (req, res) => {
  const settings = await CompanySetting.list();
  return success(res, 200, settings, 'Company settings retrieved');
});

export const getSetting = asyncHandler(async (req, res) => {
  const setting = await CompanySetting.findById(req.params.id);
  if (!setting) throw new NotFoundError('Company setting not found');
  return success(res, 200, setting, 'Company setting retrieved');
});

export const createSetting = asyncHandler(async (req, res) => {
  const id = await CompanySetting.create(req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_COMPANY_SETTING',
    entity_type: 'COMPANY_SETTING',
    entity_id: id,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'company_setting_created', { id });
  return success(res, 201, { id }, 'Company setting created');
});

export const updateSetting = asyncHandler(async (req, res) => {
  const setting = await CompanySetting.findById(req.params.id);
  if (!setting) throw new NotFoundError('Company setting not found');
  await CompanySetting.update(req.params.id, req.body);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'UPDATE_COMPANY_SETTING',
    entity_type: 'COMPANY_SETTING',
    entity_id: req.params.id,
    old_value: setting,
    new_value: req.body,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'company_setting_updated', { id: req.params.id });
  return success(res, 200, null, 'Company setting updated');
});

export const deleteSetting = asyncHandler(async (req, res) => {
  const setting = await CompanySetting.findById(req.params.id);
  if (!setting) throw new NotFoundError('Company setting not found');
  await CompanySetting.delete(req.params.id);
  await AuditLog.create({
    user_id: req.user.id,
    action: 'DELETE_COMPANY_SETTING',
    entity_type: 'COMPANY_SETTING',
    entity_id: req.params.id,
    old_value: setting,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'company_setting_deleted', { id: req.params.id });
  return success(res, 200, null, 'Company setting deleted');
});
`;
  const filePath = path.join(CONTROLLERS_DIR, 'companySettingController.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writePayrollRoutes() {
  const code = `import express from 'express';
import { listSalaryStructures, createSalaryStructure, processPayroll, runPayrollForAll, listPayrollHistory, generatePayslip } from '../controllers/payrollController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();
router.use(authenticate);

router.get('/payroll/salary-structures', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), listSalaryStructures);
router.post('/payroll/salary-structures', requireRole('HR', 'ADMIN'), createSalaryStructure);
router.post('/payroll/process', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), processPayroll);
router.post('/payroll/run-all', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), runPayrollForAll);
router.get('/payroll/history', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE'), listPayrollHistory);
router.get('/payroll/:id/payslip', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE'), generatePayslip);

export default router;
`;
  const filePath = path.join(ROUTES_DIR, 'payrollRoutes.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writePerformanceRoutes() {
  const code = `import express from 'express';
import { listReviews, createReview, getReview, updateReview, deleteReview } from '../controllers/performanceController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/performance/reviews', requireRole('HR', 'ADMIN', 'SUPER_ADMIN', 'EMPLOYEE'), listReviews);
router.post('/performance/reviews', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createPerformanceReview'), createReview);
router.get('/performance/reviews/:id', getReview);
router.patch('/performance/reviews/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createPerformanceReview'), updateReview);
router.delete('/performance/reviews/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteReview);

export default router;
`;
  const filePath = path.join(ROUTES_DIR, 'performanceRoutes.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writeHolidayRoutes() {
  const code = `import express from 'express';
import { listHolidays, createHoliday, getHoliday, updateHoliday, deleteHoliday } from '../controllers/holidayController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/calendar/holidays', listHolidays);
router.post('/calendar/holidays', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createHoliday'), createHoliday);
router.get('/calendar/holidays/:id', getHoliday);
router.patch('/calendar/holidays/:id', requireRole('HR', 'ADMIN', 'SUPER_ADMIN'), validateBody('createHoliday'), updateHoliday);
router.delete('/calendar/holidays/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteHoliday);

export default router;
`;
  const filePath = path.join(ROUTES_DIR, 'holidayRoutes.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writeCalendarRoutes() {
  const code = `import express from 'express';
import { listEvents, createEvent, getEvent, updateEvent, deleteEvent } from '../controllers/calendarController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/calendar/events', requireRole('EMPLOYEE', 'INTERN', 'TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'RECEPTION'), listEvents);
router.post('/calendar/events', requireRole('TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'), validateBody('createEvent'), createEvent);
router.get('/calendar/events/:id', getEvent);
router.patch('/calendar/events/:id', requireRole('TUTOR', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'), validateBody('createEvent'), updateEvent);
router.delete('/calendar/events/:id', requireRole('ADMIN', 'SUPER_ADMIN'), deleteEvent);

export default router;
`;
  const filePath = path.join(ROUTES_DIR, 'calendarRoutes.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writeWorkflowRoutes() {
  const code = `import express from 'express';
import { listWorkflows, createWorkflow, getWorkflow, updateWorkflow, deleteWorkflow, listChainSteps, createChainStep, updateChainStep, deleteChainStep } from '../controllers/workflowController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/workflows', requireRole('ADMIN', 'SUPER_ADMIN'), listWorkflows);
router.post('/workflows', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createWorkflow'), createWorkflow);
router.get('/workflows/:id', getWorkflow);
router.patch('/workflows/:id', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createWorkflow'), updateWorkflow);
router.delete('/workflows/:id', requireRole('SUPER_ADMIN'), deleteWorkflow);

router.get('/workflows/:workflowId/steps', requireRole('ADMIN', 'SUPER_ADMIN'), listChainSteps);
router.post('/workflows/:workflowId/steps', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createChainStep'), createChainStep);
router.patch('/workflows/:workflowId/steps/:id', requireRole('ADMIN', 'SUPER_ADMIN'), validateBody('createChainStep'), updateChainStep);
router.delete('/workflows/:workflowId/steps/:id', requireRole('SUPER_ADMIN'), deleteChainStep);

export default router;
`;
  const filePath = path.join(ROUTES_DIR, 'workflowRoutes.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writeApprovalRoutes() {
  const code = `import express from 'express';
import { listInstances, getInstance, approveInstance, rejectInstance } from '../controllers/approvalController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/approvals', requireRole('EMPLOYEE', 'ADMIN', 'SUPER_ADMIN', 'HR', 'PROJECT_MANAGER'), listInstances);
router.get('/approvals/:id', getInstance);
router.post('/approvals/:id/approve', requireRole('EMPLOYEE', 'ADMIN', 'SUPER_ADMIN', 'HR', 'PROJECT_MANAGER'), validateBody('approveInstance'), approveInstance);
router.post('/approvals/:id/reject', requireRole('EMPLOYEE', 'ADMIN', 'SUPER_ADMIN', 'HR', 'PROJECT_MANAGER'), validateBody('rejectInstance'), rejectInstance);

export default router;
`;
  const filePath = path.join(ROUTES_DIR, 'approvalRoutes.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

function writeCompanySettingRoutes() {
  const code = `import express from 'express';
import { listSettings, getSetting, createSetting, updateSetting, deleteSetting } from '../controllers/companySettingController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validation.js';

const router = express.Router();
router.use(authenticate);

router.get('/company-settings', requireRole('ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'), listSettings);
router.get('/company-settings/:id', getSetting);
router.post('/company-settings', requireRole('ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'), validateBody('createCompanySetting'), createSetting);
router.patch('/company-settings/:id', requireRole('ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'), validateBody('createCompanySetting'), updateSetting);
router.delete('/company-settings/:id', requireRole('SUPER_ADMIN'), deleteSetting);

export default router;
`;
  const filePath = path.join(ROUTES_DIR, 'companySettingRoutes.js');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`Created: ${filePath}`);
}

writePayrollController();
writePerformanceController();
writeHolidayController();
writeCalendarController();
writeWorkflowController();
writeApprovalController();
writeCompanySettingController();
writePayrollRoutes();
writePerformanceRoutes();
writeHolidayRoutes();
writeCalendarRoutes();
writeWorkflowRoutes();
writeApprovalRoutes();
writeCompanySettingRoutes();
