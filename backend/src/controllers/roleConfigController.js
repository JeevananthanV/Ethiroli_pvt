import { successResponse } from '../utils/response.js';
import { ApiError } from '../utils/errors.js';
import CalendarRoleConfigService from '../services/calendarRoleConfigService.js';
import logger from '../config/logger.js';

export default class RoleConfigController {
  static async upsert(req, res) {
    try {
      const userRole = req.user?.role || 'USER';
      if (!['SUPER_ADMIN', 'ADMIN', 'HR'].includes(userRole)) {
        throw new ApiError(403, 'Insufficient permissions');
      }

      const { role, enabledEventTypes, notificationChannels, isEnabled } = req.body;
      if (!role) {
        throw new ApiError(400, 'Role is required');
      }

      const config = await CalendarRoleConfigService.upsertConfig({
        role,
        enabledEventTypes,
        notificationChannels,
        isEnabled,
      });

      logger.info('Calendar role config updated', { role });
      res.json(successResponse(config, 'Role config updated'));
    } catch (error) {
      logger.error('Error updating role config', { error: error.message });
      res.status(error.code || 500).json({ error: error.message });
    }
  }

  static async list(req, res) {
    try {
      const configs = await CalendarRoleConfigService.listConfigs();
      res.json(successResponse(configs, 'Role configs retrieved'));
    } catch (error) {
      logger.error('Error listing role configs', { error: error.message });
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const userRole = req.user?.role || 'USER';
      if (!['SUPER_ADMIN', 'ADMIN', 'HR'].includes(userRole)) {
        throw new ApiError(403, 'Insufficient permissions');
      }

      const { role } = req.params;
      await CalendarRoleConfigService.deleteConfig(role);
      logger.info('Calendar role config deleted', { role });
      res.json(successResponse({}, 'Role config deleted'));
    } catch (error) {
      logger.error('Error deleting role config', { error: error.message });
      res.status(error.code || 500).json({ error: error.message });
    }
  }

  static async canAccessEventType(req, res) {
    try {
      const { role, eventType } = req.params;
      const canAccess = await CalendarRoleConfigService.canAccessEventType(role, eventType);
      res.json(successResponse({ canAccess }, 'Access check completed'));
    } catch (error) {
      logger.error('Error checking access', { error: error.message });
      res.status(500).json({ error: error.message });
    }
  }
}