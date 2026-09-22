import { useState, useEffect, useCallback } from 'react';
import { enablePushNotifications, isPushEnabled } from '../services/fcmClient.js';
import { testPushNotification } from '../services/api/notificationApi.js';

export function usePushNotification() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsEnabled(isPushEnabled());
  }, []);

  const requestPermission = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await enablePushNotifications();
      if (res.success) {
        setIsEnabled(true);
      } else {
        setError(res.reason || res.error || 'Failed to enable notifications');
      }
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const sendTest = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await testPushNotification();
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isEnabled,
    loading,
    error,
    requestPermission,
    sendTest
  };
}

export default usePushNotification;
