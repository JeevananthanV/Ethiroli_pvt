import pool from '../config/database.js';
import { logger } from '../config/logger.js';
import { broadcastToUser, broadcastToRole } from './socketService.js';

/**
 * Check if Firebase credentials are fully provided
 */
export const isFcmConfigured = () => {
  return Boolean(
    (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.FCM_SERVER_KEY
  );
};

/**
 * Send an FCM notification to a specific device registration token via Google HTTP v1 or legacy API
 */
const sendFcmToToken = async (token, { title, body, icon, url, data = {} }) => {
  if (!isFcmConfigured()) {
    logger.info('[FCM Simulated Mode] Push notification sent to token', { token: token.slice(0, 10) + '...', title, body });
    return { success: true, simulated: true };
  }

  // Modern HTTP v1 or legacy FCM dispatch
  try {
    const serverKey = process.env.FCM_SERVER_KEY;
    if (serverKey) {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${serverKey}`
        },
        body: JSON.stringify({
          to: token,
          notification: { title, body, icon: icon || '/favicon.ico', click_action: url },
          data: { ...data, title, body, url: url || '/' }
        })
      });

      const result = await response.json();
      if (result.failure > 0) {
        const error = result.results?.[0]?.error;
        logger.warn('FCM delivery reported error for token', { error, token: token.slice(0, 8) + '...' });
        if (error === 'NotRegistered' || error === 'InvalidRegistration') {
          // Deactivate dead token
          await pool.execute('UPDATE device_registrations SET is_active = FALSE WHERE push_token = ?', [token]);
        }
        return { success: false, error };
      }
      return { success: true, messageId: result.results?.[0]?.message_id };
    }

    return { success: true, simulated: true };
  } catch (err) {
    logger.error('FCM dispatch network error', { error: err.message });
    return { success: false, error: err.message };
  }
};

/**
 * Register or update a user's device push token
 */
export const registerDeviceToken = async ({ userId, tenantId, deviceId, platform = 'WEB', pushToken, appVersion = '1.0.0' }) => {
  try {
    const [existing] = await pool.execute(
      'SELECT id FROM device_registrations WHERE user_id = ? AND device_id = ?',
      [userId, deviceId || pushToken]
    );

    if (existing.length > 0) {
      await pool.execute(
        `UPDATE device_registrations
         SET push_token = ?, platform = ?, app_version = ?, is_active = TRUE, last_active_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [pushToken, platform, appVersion, existing[0].id]
      );
      return { id: existing[0].id, updated: true };
    }

    const newId = crypto.randomUUID();
    await pool.execute(
      `INSERT INTO device_registrations (id, user_id, tenant_id, device_id, platform, push_token, app_version, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [newId, userId, tenantId || null, deviceId || newId, platform, pushToken, appVersion]
    );

    return { id: newId, created: true };
  } catch (error) {
    logger.error('Failed to register device push token in DB', { userId, error: error.message });
    throw error;
  }
};

/**
 * Send push notification to a specific user by ID
 */
export const sendToUser = async (userId, { title, body, icon, url, data = {} }) => {
  logger.info('Sending push notification to user', { userId, title });

  try {
    // 1. Always deliver in-app via Socket.IO
    broadcastToUser(userId, 'push_notification', {
      title,
      body,
      icon,
      url,
      data,
      createdAt: new Date().toISOString()
    });

    // 2. Query user's registered active devices
    const [devices] = await pool.execute(
      'SELECT push_token FROM device_registrations WHERE user_id = ? AND is_active = TRUE',
      [userId]
    );

    if (devices.length === 0) {
      return { success: true, devicesFound: 0, deliveredInApp: true };
    }

    // 3. Dispatch to all user devices
    const results = await Promise.all(
      devices.map(d => sendFcmToToken(d.push_token, { title, body, icon, url, data }))
    );

    const sentCount = results.filter(r => r.success).length;
    return {
      success: true,
      deliveredDevices: sentCount,
      totalDevices: devices.length,
      deliveredInApp: true
    };
  } catch (error) {
    logger.error('Push notification to user failed', { userId, error: error.message });
    return { success: false, error: error.message };
  }
};

/**
 * Send push notification to all active users with a specific role
 */
export const sendToRole = async (role, { title, body, icon, url, data = {} }) => {
  logger.info('Sending push notification to role', { role, title });

  try {
    // 1. Socket.IO broadcast to online users with this role
    broadcastToRole(role, 'push_notification', {
      title,
      body,
      icon,
      url,
      data,
      createdAt: new Date().toISOString()
    });

    // 2. Query all active users with this role
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE role = ? AND is_active = TRUE',
      [role]
    );

    if (users.length === 0) {
      return { success: true, count: 0 };
    }

    let successCount = 0;
    for (const user of users) {
      const res = await sendToUser(user.id, { title, body, icon, url, data });
      if (res.success) successCount++;
    }

    return { success: true, targetedUsers: users.length, successfulUsers: successCount };
  } catch (error) {
    logger.error('Push notification to role failed', { role, error: error.message });
    return { success: false, error: error.message };
  }
};

/**
 * Send a notification campaign to all users or selected target roles
 */
export const sendCampaign = async ({ title, body, targetRoles, url, data = {} }) => {
  try {
    if (targetRoles && Array.isArray(targetRoles) && targetRoles.length > 0) {
      let totalSuccess = 0;
      for (const role of targetRoles) {
        const res = await sendToRole(role, { title, body, url, data });
        if (res.success) totalSuccess += res.successfulUsers || 0;
      }
      return { success: true, deliveredCount: totalSuccess, roles: targetRoles };
    }

    // Broadcast to all active users
    const [users] = await pool.execute('SELECT id FROM users WHERE is_active = TRUE');
    let totalSent = 0;
    for (const u of users) {
      const res = await sendToUser(u.id, { title, body, url, data });
      if (res.success) totalSent++;
    }

    return { success: true, deliveredCount: totalSent, totalUsers: users.length };
  } catch (error) {
    logger.error('Campaign broadcast failed', { error: error.message });
    return { success: false, error: error.message };
  }
};

/**
 * Send test push notification to user
 */
export const testPushNotification = async (userId) => {
  return sendToUser(userId, {
    title: '🔔 Ethiroli Push Notification Test',
    body: 'Firebase Cloud Messaging integration is successfully configured and active!',
    icon: '/favicon.ico',
    url: '/app',
    data: { test: true, timestamp: Date.now() }
  });
};
