import { logger } from '../config/logger.js';

let twilioWhatsAppClient = null;

const getTwilioWhatsAppClient = () => {
  if (!twilioWhatsAppClient) {
    const accountSid = process.env.WHATSAPP_ACCOUNT_SID;
    const authToken = process.env.WHATSAPP_AUTH_TOKEN;

    if (accountSid && authToken) {
      const { Twilio } = require('twilio');
      twilioWhatsAppClient = Twilio(accountSid, authToken);
    }
  }
  return twilioWhatsAppClient;
};

export const sendWhatsApp = async (to, body) => {
  const client = getTwilioWhatsAppClient();
  const fromNumber = process.env.WHATSAPP_FROM_NUMBER;

  if (!client || !fromNumber) {
    logger.warn('WhatsApp provider not configured. Message not sent.', { to });
    return { success: false, message: 'WhatsApp provider not configured' };
  }

  try {
    const result = await client.messages.create({
      body,
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${to}`
    });

    logger.info('WhatsApp message sent', { to, messageId: result.sid });
    return { success: true, messageId: result.sid };
  } catch (error) {
    logger.error('WhatsApp send failed', { to, error: error.message });
    return { success: false, error: error.message };
  }
};

export const sendMessage = async (to, message) => {
  return sendWhatsApp(to, message);
};

export const sendTemplate = async (to, templateName, variables = {}) => {
  const client = getTwilioWhatsAppClient();
  const fromNumber = process.env.WHATSAPP_FROM_NUMBER;

  if (!client || !fromNumber) {
    logger.warn('WhatsApp provider not configured. Template not sent.', { to, templateName });
    return { success: false, message: 'WhatsApp provider not configured' };
  }

  let messageBody = templateName;
  for (const [key, value] of Object.entries(variables)) {
    messageBody = messageBody.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }

  return sendWhatsApp(to, messageBody);
};
