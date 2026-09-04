export const sendSMS = async (to, body) => {
  console.log(`[SMS Service Mock] Sending SMS to ${to}: ${body}`);
  return { success: true, messageId: 'sms-' + Date.now() };
};
