import ReportDefinition from '../models/ReportDefinition.js';
import ScheduledReport from '../models/ScheduledReport.js';
import AuditLog from '../models/AuditLog.js';
import { broadcastToRole } from '../services/socketService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const listReportDefinitions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    ReportDefinition.list({ tenant_id: req.tenant?.id, limit: parseInt(limit), offset }),
    ReportDefinition.count({ tenant_id: req.tenant?.id })
  ]);

  return success(res, 200, items, 'Report definitions retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});

export const createReportDefinition = asyncHandler(async (req, res) => {
  const id = await ReportDefinition.create({ ...req.body, tenant_id: req.tenant?.id, created_by: req.user.id });
  await AuditLog.create({
    user_id: req.user.id,
    action: 'CREATE_REPORT_DEFINITION',
    entity_type: 'REPORT_DEFINITION',
    entity_id: id,
    new_value: { ...req.body, tenant_id: req.tenant?.id, created_by: req.user.id },
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'report_definition_created', { id });
  return success(res, 201, { id }, 'Report definition saved');
});

export const getReportDefinition = asyncHandler(async (req, res) => {
  const report = await ReportDefinition.findById(req.params.id);
  if (!report) throw new NotFoundError('Report definition not found');
  return success(res, 200, report, 'Report definition retrieved');
});

export const executeReport = asyncHandler(async (req, res) => {
  const report = await ReportDefinition.findById(req.params.id);
  if (!report) throw new NotFoundError('Report definition not found');
  await AuditLog.create({
    user_id: req.user.id,
    action: 'EXECUTE_REPORT',
    entity_type: 'REPORT_DEFINITION',
    entity_id: req.params.id,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'report_executed', { id: req.params.id });
  return success(res, 200, { columns: [], rows: [] }, 'Report executed');
});

export const exportReport = asyncHandler(async (req, res) => {
  await AuditLog.create({
    user_id: req.user.id,
    action: 'EXPORT_REPORT',
    entity_type: 'REPORT_DEFINITION',
    entity_id: req.params.id,
    ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
    user_agent: req.headers['user-agent']
  });
  broadcastToRole('ADMIN', 'report_exported', { id: req.params.id });
  return success(res, 200, { download_url: `/reports/${req.params.id}/export` }, 'Export ready');
});
