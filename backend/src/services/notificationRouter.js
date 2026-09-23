import { broadcastToRole, broadcastToUser } from './socketService.js';
import CalendarEventType from '../models/CalendarEventType.js';
import logger from '../config/logger.js';

export const notificationRouter = {
  async route(eventAction, eventData, createdByUserId, createdByRole = 'USER') {
    try {
      const typeIdOrLabel = eventData.event_type_id || eventData.event_type;
      let targetRoles = [];

      if (typeIdOrLabel) {
        const typeConfig = await CalendarEventType.findByType(typeIdOrLabel);
        if (typeConfig && Array.isArray(typeConfig.notification_target_roles)) {
          targetRoles = [...typeConfig.notification_target_roles];
        }
      }

      // If no specific targets found in event type, fallback to creator's role
      if (targetRoles.length === 0) {
        targetRoles = ['CREATOR_ROLE'];
      }

      const notifiedRoles = new Set();
      const eventName = `calendar_event_${eventAction}`; // e.g. calendar_event_created

      // 1. Notify creator directly
      if (createdByUserId) {
        broadcastToUser(createdByUserId, eventName, { ...eventData, action: eventAction });
      }

      // 2. Notify assigned users directly
      if (Array.isArray(eventData.assigned_users)) {
        for (const uid of eventData.assigned_users) {
          if (uid && uid !== createdByUserId) {
            broadcastToUser(uid, eventName, { ...eventData, action: eventAction });
          }
        }
      }

      // 3. Dispatch to target roles
      for (const role of targetRoles) {
        if (role === 'SELF') {
          // Handled above
          continue;
        } else if (role === 'CREATOR_ROLE') {
          if (createdByRole && !notifiedRoles.has(createdByRole)) {
            broadcastToRole(createdByRole, eventName, { ...eventData, action: eventAction });
            notifiedRoles.add(createdByRole);
          }
        } else if (role === 'ALL') {
          const allSystemRoles = ['ADMIN', 'SUPER_ADMIN', 'HR', 'EMPLOYEE', 'INTERN', 'TUTOR', 'STUDENT', 'PROJECT_MANAGER', 'FINANCE', 'SALES', 'RECEPTION'];
          for (const r of allSystemRoles) {
            if (!notifiedRoles.has(r)) {
              broadcastToRole(r, eventName, { ...eventData, action: eventAction });
              notifiedRoles.add(r);
            }
          }
        } else {
          if (!notifiedRoles.has(role)) {
            broadcastToRole(role, eventName, { ...eventData, action: eventAction });
            notifiedRoles.add(role);
          }
        }
      }

      logger.info(`NotificationRouter dispatched ${eventName} to roles: [${Array.from(notifiedRoles).join(', ')}]`);
    } catch (err) {
      logger.error('NotificationRouter dispatch error:', err);
    }
  }
};

export default notificationRouter;