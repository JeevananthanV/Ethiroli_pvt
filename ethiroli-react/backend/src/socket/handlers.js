import ActivityFeed from '../models/ActivityFeed.js';
import { broadcastToRole, broadcastToUser, getIO } from '../services/socketService.js';

export default function setupHandlers(io) {
  io.on('connection', (socket) => {
    const userId = socket.user?.id;
    const userRole = socket.user?.role;

    socket.on('lead_created', async (leadData) => {
      try {
        socket.to(`role:SALES`).emit('lead_created', leadData);
        socket.to(`role:ADMIN`).emit('lead_created', leadData);
        socket.to(`role:SUPER_ADMIN`).emit('lead_created', leadData);

        await ActivityFeed.create({
          user_id: leadData.assigned_to || userId,
          actor_id: userId,
          event_type: 'LEAD_CREATED',
          entity_type: 'Lead',
          entity_id: leadData.id,
          payload: leadData
        });
      } catch (err) {
        console.error('lead_created handler error:', err);
      }
    });

    socket.on('lead_status_changed', async (data) => {
      try {
        const { leadId, newStatus, previousStatus, lead } = data;

        socket.to(`role:SALES`).emit('lead_status_changed', { leadId, newStatus, previousStatus, lead });
        socket.to(`role:ADMIN`).emit('lead_status_changed', { leadId, newStatus, previousStatus, lead });
        socket.to(`role:SUPER_ADMIN`).emit('lead_status_changed', { leadId, newStatus, previousStatus, lead });

        await ActivityFeed.create({
          user_id: lead.assigned_to || userId,
          actor_id: userId,
          event_type: 'LEAD_STATUS_CHANGED',
          entity_type: 'Lead',
          entity_id: leadId,
          payload: { newStatus, previousStatus, lead }
        });
      } catch (err) {
        console.error('lead_status_changed handler error:', err);
      }
    });

    socket.on('new_activity', async (activityData) => {
      try {
        const { targetUserId, activity } = activityData;

        if (targetUserId) {
          await ActivityFeed.create({
            user_id: targetUserId,
            actor_id: userId,
            event_type: activity.event_type || 'NEW_ACTIVITY',
            entity_type: activity.entity_type,
            entity_id: activity.entity_id,
            payload: activity.payload || activity
          });

          broadcastToUser(targetUserId, 'new_activity', {
            ...activity,
            actor_id: userId,
            created_at: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error('new_activity handler error:', err);
      }
    });

    socket.on('typing_indicator', (data) => {
      try {
        const { room, isTyping } = data;
        socket.to(room).emit('typing_indicator', {
          userId,
          isTyping,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error('typing_indicator handler error:', err);
      }
    });

    socket.on('read_receipt', async (data) => {
      try {
        const { activityId } = data;

        if (activityId) {
          await ActivityFeed.update(activityId, { is_read: true });
          socket.to(`user:${userId}`).emit('read_receipt', {
            activityId,
            readBy: userId,
            readAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error('read_receipt handler error:', err);
      }
    });

    socket.on('online_presence', (data) => {
      try {
        const { status } = data;

        socket.data.onlineStatus = status || 'online';
        socket.data.lastSeen = new Date().toISOString();

        broadcastToRole(userRole, 'online_presence', {
          userId,
          status: socket.data.onlineStatus,
          lastSeen: socket.data.lastSeen
        });
      } catch (err) {
        console.error('online_presence handler error:', err);
      }
    });

    socket.on('disconnect', async () => {
      try {
        broadcastToRole(userRole, 'online_presence', {
          userId,
          status: 'offline',
          lastSeen: new Date().toISOString()
        });
      } catch (err) {
        console.error('disconnect handler error:', err);
      }
    });
  });
}
