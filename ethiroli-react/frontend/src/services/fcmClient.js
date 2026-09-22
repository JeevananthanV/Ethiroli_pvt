import { registerDevice } from './api/notificationApi.js';

const DEVICE_ID_KEY = 'ethiroli_device_id';

/**
 * Get or create a persistent device ID for this browser instance
 */
export const getDeviceId = () => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = 'web_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
};

/**
 * Register Service Worker for background Web Push
 */
export const registerPushServiceWorker = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.info('Service Worker / Push API not supported on this browser.');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });
    return registration;
  } catch (err) {
    console.warn('Push service worker registration failed:', err);
    return null;
  }
};

/**
 * Request notification permission from user and register device token with backend
 */
export const enablePushNotifications = async () => {
  if (!('Notification' in window)) {
    return { success: false, reason: 'Notifications not supported in this browser' };
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return { success: false, reason: `Permission ${permission}` };
  }

  await registerPushServiceWorker();

  const deviceId = getDeviceId();
  const pushToken = 'fcm_web_' + deviceId + '_' + Date.now();

  try {
    const result = await registerDevice({
      deviceId,
      platform: 'WEB',
      pushToken,
      appVersion: '1.0.0'
    });
    localStorage.setItem('ethiroli_push_enabled', 'true');
    return { success: true, deviceId, pushToken, result };
  } catch (err) {
    console.error('Failed to register device token with backend:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Check if push notifications are enabled on this browser
 */
export const isPushEnabled = () => {
  return (
    'Notification' in window &&
    Notification.permission === 'granted' &&
    localStorage.getItem('ethiroli_push_enabled') === 'true'
  );
};
