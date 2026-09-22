import { logger } from '../config/logger.js';

let twilioClient = null;

const getTwilioClient = () => {
  if (!twilioClient) {
    const accountSid = process.env.SMS_ACCOUNT_SID;
    const authToken = process.env.SMS_AUTH_TOKEN;

    if (accountSid && authToken) {
      const { Twilio } = require('twilio');
      twilioClient = Twilio(accountSid, authToken);
    }
  }
  return twilioClient;
};

export const sendSMS = async (to, message) => {
  const client = getTwilioClient();
  const fromNumber = process.env.SMS_FROM_NUMBER;

  if (!client || !fromNumber) {
    logger.warn('SMS provider not configured. SMS not sent.', { to });
    return { success: false, message: 'SMS provider not configured' };
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to
    });

    logger.info('SMS sent', { to, messageId: result.sid });
    return { success: true, messageId: result.sid };
  } catch (error) {
    logger.error('SMS send failed', { to, error: error.message });
    return { success: false, error: error.message };
  }
};

export const sendOTP = async (to, otp) => {
  const message = `Your Ethiroli verification code is: ${otp}. This code will expire in 10 minutes.`;
  return sendSMS(to, message);
};
