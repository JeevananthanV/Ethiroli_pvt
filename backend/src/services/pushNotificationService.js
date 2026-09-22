import pool from '../config/database.js';
import { broadcastToUser, broadcastToRole } from './socketService.js';
import { logger } from '../config/logger.js';

export const sendToUser = async (userId, title, body, data = {}) => {
  logger.info('Sending push notification to user', { userId, title });

  try {
    const [result] = await pool.execute(
      `INSERT INTO push_notifications (user_id, title, body, data, created_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [userId, title, body, JSON.stringify(data)]
    );

    broadcastToUser(userId, 'push_notification', {
      notificationId: result.insertId,
      title,
      body,
      data,
      createdAt: new Date().toISOString()
    });

    const fcmResult = await dispatchToFCM(userId, title, body, data);

    return {
      success: true,
      notificationId: result.insertId,
      fcmSent: fcmResult.success
    };
  } catch (error) {
    logger.error('Push notification to user failed', { userId, error: error.message });
    throw error;
  }
};

export const sendToRole = async (role, title, body, data = {}) => {
  logger.info('Sending push notification to role', { role, title });

  try {
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE role = ? AND is_active = TRUE',
      [role]
    );

    let successCount = 0;

    for (const user of users) {
      try {
        const result = await sendToUser(user.id, title, body, data);
        if (result.success) successCount++;
      } catch (error) {
        logger.error('Failed to send push to user', { userId: user.id, error: error.message });
      }
    }

    broadcastToRole(role, 'push_notification', {
      title,
      body,
      data,
      createdAt: new Date().toISOString()
    });

    logger.info('Push notification to role completed', { role, successCount, total: users.length });

    return { success: true, successCount, total: users.length };
  } catch (error) {
    logger.error('Push notification to role failed', { role, error: error.message });
    throw error;
  }
};

export const sendCampaign = async (campaign) => {
  logger.info('Sending push notification campaign', { campaignId: campaign.id });

  try {
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE is_active = TRUE'
    );

    let successCount = 0;

    for (const user of users) {
      try {
        const result = await sendToUser(user.id, campaign.title, campaign.body, campaign.data || {});
        if (result.success) successCount++;
      } catch (error) {
        logger.error('Campaign push failed for user', { userId: user.id, error: error.message });
      }
    }

    logger.info('Push notification campaign completed', { campaignId: campaign.id, successCount, total: users.length });

    return { success: true, campaignId: campaign.id, successCount, total: users.length };
  } catch (error) {
    logger.error('Push notification campaign failed', { campaignId: campaign.id, error: error.message });
    throw error;
  }
};

const dispatchToFCM = async (userId, title, body, data) => {
  const fcmToken = process.env.FCM_SERVER_KEY;
  if (!fcmToken) {
    return { success: false, reason: 'FCM not configured' };
  }

  try {
    const { getMessaging } = require('firebase-admin/messaging');
    const messaging = getMessaging();

    const [deviceRows] = await pool.execute(
      'SELECT * FROM device_registrations WHERE user_id = ? AND is_active = TRUE',
      [userId]
    );

    if (deviceRows.length === 0) {
      return { success: false, reason: 'No registered devices' };
    }

    const promises = deviceRows.map(device =>
      messaging.send({
        token: device.device_token,
        notification: { title, body },
        data: { ...data, userId: String(userId) }
      })
    );

    await Promise.all(promises);

    return { success: true, sentTo: deviceRows.length };
  } catch (error) {
    logger.error('FCM dispatch failed', { userId, error: error.message });
    return { success: false, error: error.message };
  }
};
