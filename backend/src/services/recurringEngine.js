import crypto from 'crypto';
import pool from '../config/database.js';
import RecurringRule from '../models/RecurringRule.js';
import CalendarEvent from '../models/CalendarEvent.js';
import logger from '../config/logger.js';

export const recurringEngine = {
  async createRule(parentEventId, ruleData) {
    const {
      frequency,
      interval = 1,
      endDate = null,
      end_date = null,
      maxOccurrences = null,
      max_occurrences = null,
      daysOfWeek = [],
      days_of_week = [],
      dayOfMonth = null,
      day_of_month = null,
      monthOfYear = null,
      month_of_year = null,
    } = ruleData;

    const effFreq = (frequency || 'WEEKLY').toUpperCase();
    const effInterval = parseInt(interval, 10) || 1;
    const effEndDate = end_date || endDate;
    const effMaxOcc = max_occurrences !== null && max_occurrences !== undefined ? parseInt(max_occurrences, 10) : (maxOccurrences !== null && maxOccurrences !== undefined ? parseInt(maxOccurrences, 10) : null);
    const effDaysOfWeek = days_of_week && days_of_week.length > 0 ? days_of_week : daysOfWeek;
    const effDayOfMonth = day_of_month !== null && day_of_month !== undefined ? parseInt(day_of_month, 10) : (dayOfMonth !== null && dayOfMonth !== undefined ? parseInt(dayOfMonth, 10) : null);

    const ruleId = crypto.randomUUID();
    const nextOcc = this.calculateNextOccurrence(effFreq, effInterval, effDaysOfWeek, effDayOfMonth);

    await RecurringRule.create({
      id: ruleId,
      event_id: parentEventId,
      frequency: effFreq,
      interval: effInterval,
      days_of_week: effDaysOfWeek,
      day_of_month: effDayOfMonth,
      month_of_year: month_of_year || monthOfYear,
      end_date: effEndDate,
      max_occurrences: effMaxOcc,
      next_occurrence: nextOcc ? nextOcc.toISOString().split('T')[0] : null,
      isActive: true,
    });

    // Generate upcoming instances up to 90 days or effEndDate
    const instances = await this.generateInstances(parentEventId, ruleId, effEndDate, effMaxOcc);

    await CalendarEvent.update(parentEventId, {
      recurrence_end_date: effEndDate,
      recurrence_instance_count: instances.length,
      recurrence_rule: {
        id: ruleId,
        frequency: effFreq,
        interval: effInterval,
        days_of_week: effDaysOfWeek,
        day_of_month: effDayOfMonth,
        end_date: effEndDate,
        max_occurrences: effMaxOcc
      }
    });

    return { ruleId, instancesCount: instances.length };
  },

  async generateInstances(parentEventId, ruleId, endDate = null, maxOccurrences = null) {
    const rule = await RecurringRule.findById(ruleId);
    const parent = await CalendarEvent.findById(parentEventId);

    if (!rule || !parent) return [];

    const instances = [];
    const parentStart = new Date(parent.start_time);
    const parentEnd = new Date(parent.end_time);
    const durationMs = parentEnd.getTime() - parentStart.getTime();

    let currentDate = new Date(parentStart);
    // Move to first recurrence after base start
    currentDate = this.nextDate(currentDate, rule);

    let count = 0;
    // Window: up to endDate, or up to 90 days ahead
    const ninetyDaysAhead = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    const limitDate = endDate ? new Date(endDate) : ninetyDaysAhead;
    const maxDate = limitDate < ninetyDaysAhead ? limitDate : ninetyDaysAhead;
    const maxCount = maxOccurrences ? Math.min(maxOccurrences, 60) : 60;

    const cancelledDates = parent.cancelled_instance_dates || [];

    while (currentDate <= maxDate && count < maxCount) {
      if (this.shouldGenerateInstance(currentDate, rule)) {
        const dateStr = currentDate.toISOString().split('T')[0];

        if (!cancelledDates.includes(dateStr)) {
          const instanceId = crypto.randomUUID();
          const instStart = new Date(currentDate);
          const instEnd = new Date(instStart.getTime() + durationMs);

          instances.push({
            id: instanceId,
            parent_event_id: parentEventId,
            title: parent.title,
            description: parent.description,
            event_type: parent.event_type,
            event_type_id: parent.event_type_id,
            start_time: instStart.toISOString().replace('T', ' ').substring(0, 19),
            end_time: instEnd.toISOString().replace('T', ' ').substring(0, 19),
            created_by: parent.created_by,
            tenant_id: parent.tenant_id,
            assigned_users: parent.assigned_users,
            location: parent.location,
            meeting_link: parent.meeting_link,
            is_all_day: parent.is_all_day,
            status: 'scheduled',
            priority: parent.priority,
            tags: parent.tags,
            role: parent.role,
            index_key: `${parentEventId}_${dateStr}`,
          });
          count++;
        }
      }

      currentDate = this.nextDate(currentDate, rule);
    }

    // Persist generated child instances
    for (const inst of instances) {
      await CalendarEvent.create(inst);
    }

    await RecurringRule.update(ruleId, {
      instance_count: count,
      next_occurrence: currentDate ? currentDate.toISOString().split('T')[0] : null,
    });

    logger.info(`Generated ${instances.length} recurring instances for event ${parentEventId}`);
    return instances;
  },

  shouldGenerateInstance(date, rule) {
    if (rule.frequency === 'WEEKLY' && rule.days_of_week && rule.days_of_week.length > 0) {
      return rule.days_of_week.includes(date.getDay());
    }
    if (rule.frequency === 'MONTHLY' && rule.day_of_month) {
      return date.getDate() === rule.day_of_month;
    }
    return true;
  },

  nextDate(current, rule) {
    const next = new Date(current);
    const interval = rule.interval || 1;

    switch (rule.frequency) {
      case 'DAILY':
        next.setDate(next.getDate() + interval);
        break;
      case 'WEEKLY':
        if (rule.days_of_week && rule.days_of_week.length > 0) {
          const currentDay = current.getDay();
          const sortedDays = [...rule.days_of_week].sort((a, b) => a - b);
          const nextDay = sortedDays.find(d => d > currentDay);
          if (nextDay !== undefined) {
            next.setDate(next.getDate() + (nextDay - currentDay));
          } else {
            const firstDay = sortedDays[0];
            next.setDate(next.getDate() + (7 * interval - currentDay + firstDay));
          }
        } else {
          next.setDate(next.getDate() + 7 * interval);
        }
        break;
      case 'MONTHLY':
        next.setMonth(next.getMonth() + interval);
        break;
      case 'YEARLY':
        next.setFullYear(next.getFullYear() + interval);
        break;
      default:
        next.setDate(next.getDate() + 1);
        break;
    }
    return next;
  },

  calculateNextOccurrence(frequency, interval = 1, daysOfWeek = [], dayOfMonth = null) {
    const now = new Date();
    return this.nextDate(now, { frequency, interval, days_of_week: daysOfWeek, day_of_month: dayOfMonth });
  },

  async skipInstance(parentEventId, dateIso) {
    const parent = await CalendarEvent.findById(parentEventId);
    if (!parent) return false;

    const dateStr = dateIso.split('T')[0];
    const cancelled = parent.cancelled_instance_dates || [];
    if (!cancelled.includes(dateStr)) {
      cancelled.push(dateStr);
      await CalendarEvent.update(parentEventId, { cancelled_instance_dates: cancelled });
    }

    // Cancel any instance that matches index_key
    const indexKey = `${parentEventId}_${dateStr}`;
    const [matching] = await pool.execute(
      'UPDATE calendar_events SET status = "cancelled" WHERE index_key = ? OR (parent_event_id = ? AND DATE(start_time) = ?)',
      [indexKey, parentEventId, dateStr]
    );

    return true;
  },

  async cancelInstance(instanceId) {
    const instance = await CalendarEvent.findById(instanceId);
    if (!instance) return false;

    await CalendarEvent.update(instanceId, { status: 'cancelled' });

    if (instance.parent_event_id && instance.start_time) {
      const dateStr = instance.start_time.split('T')[0];
      const parent = await CalendarEvent.findById(instance.parent_event_id);
      if (parent) {
        const cancelled = parent.cancelled_instance_dates || [];
        if (!cancelled.includes(dateStr)) {
          cancelled.push(dateStr);
          await CalendarEvent.update(instance.parent_event_id, { cancelled_instance_dates: cancelled });
        }
      }
    }

    return true;
  }
};

export default recurringEngine;
