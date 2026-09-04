export const dispatchPushAlert = async (pushToken, title, message) => {
  console.log('[Push Notification Service Mock] Firebase FCM payload dispatched to ' + pushToken);
  return { success: true };
};
