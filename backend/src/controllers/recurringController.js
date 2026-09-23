import { successResponse } from '../utils/response.js';
import { ApiError } from '../utils/errors.js';
import RecurringRule from '../models/RecurringRule.js';
import CalendarEvent from '../models/CalendarEvent.js';
import RecurringEngine from '../services/recurringEngine.js';
import logger from '../config/logger.js';

export default class RecurringController {
  static async createRule(req, res) {
    try {
      const userRole = req.user?.role || 'USER';
      if (!['SUPER_ADMIN', 'ADMIN', 'HR'].includes(userRole)) {
        throw new ApiError(403, 'Insufficient permissions');
      }

      const { calendarEventId, frequency, interval, daysOfWeek, startDate, endDate, endAfter, recurrenceConfig } = req.body;

      if (!calendarEventId || !frequency) {
        throw new ApiError(400, 'calendarEventId and frequency are required');
      }

      const rule = await RecurringRule.findByCalendarEventId(calendarEventId);
      if (rule) {
        throw new ApiError(400, 'Recurring rule already exists for this event');
      }

      await RecurringRule.create({ calendarEventId, frequency, interval, daysOfWeek, startDate, endDate, endAfter, recurrenceConfig });

      logger.info('Recurring rule created', { calendarEventId, frequency });
      res.status(201).json(successResponse({}, 'Recurring rule created'));
    } catch (error) {
      logger.error('Error creating recurring rule', { error: error.message });
      res.status(error.code || 500).json({ error: error.message });
    }
  }

  static async updateRule(req, res) {
    try {
      const userRole = req.user?.role || 'USER';
      if (!['SUPER_ADMIN', 'ADMIN', 'HR'].includes(userRole)) {
        throw new ApiError(403, 'Insufficient permissions');
      }

      const { id } = req.params;
      const updates = req.body;

      await RecurringRule.update(id, updates);
      logger.info('Recurring rule updated', { id });
      res.json(successResponse({}, 'Recurring rule updated'));
    } catch (error) {
      logger.error('Error updating recurring rule', { error: error.message });
      res.status(error.code || 500).json({ error: error.message });
    }
  }

  static async deleteRule(req, res) {
    try {
      const userRole = req.user?.role || 'USER';
      if (!['SUPER_ADMIN', 'ADMIN', 'HR'].includes(userRole)) {
        throw new ApiError(403, 'Insufficient permissions');
      }

      const { id } = req.params;
      await RecurringRule.delete(id);
      logger.info('Recurring rule deleted', { id });
      res.json(successResponse({}, 'Recurring rule deleted'));
    } catch (error) {
      logger.error('Error deleting recurring rule', { error: error.message });
      res.status(error.code || 500).json({ error: error.message });
    }
  }

  static async getRuleById(req, res) {
    try {
      const { id } = req.params;
      const rule = await RecurringRule.findById(id);
      if (!rule) {
        throw new ApiError(404, 'Recurring rule not found');
      }
      res.json(successResponse(rule, 'Recurring rule retrieved'));
    } catch (error) {
      logger.error('Error retrieving recurring rule', { error: error.message });
      res.status(error.code || 500).json({ error: error.message });
    }
  }

  static async getByCalendarEventId(req, res) {
    try {
      const { calendarEventId } = req.params;
      const rule = await RecurringRule.findByCalendarEventId(calendarEventId);
      if (!rule) {
        throw new ApiError(404, 'No recurring rule found for this event');
      }
      res.json(successResponse(rule, 'Recurring rule retrieved'));
    } catch (error) {
      logger.error('Error retrieving recurring rule', { error: error.message });
      res.status(error.code || 500).json({ error: error.message });
    }
  }

  static async expandInstances(req, res) {
    try {
      const userRole = req.user?.role || 'USER';
      if (!['SUPER_ADMIN', 'ADMIN', 'HR'].includes(userRole)) {
        throw new ApiError(403, 'Insufficient permissions');
      }

      const { calendarEventId } = req.params;
      const event = await CalendarEvent.findById(calendarEventId);
      if (!event) {
        throw new ApiError(404, 'Calendar event not found');
      }

      const rule = await RecurringRule.findByCalendarEventId(calendarEventId);
      if (!rule) {
        throw new ApiError(404, 'No recurring rule found');
      }

      const instances = await RecurringEngine.generateInstances(calendarEventId, event);
      res.json(successResponse(instances, 'Recurring instances generated'));
    } catch (error) {
      logger.error('Error expanding recurring instances', { error: error.message });
      res.status(error.code || 500).json({ error: error.message });
    }
  }
}
