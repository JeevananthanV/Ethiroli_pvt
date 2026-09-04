export const sendWhatsApp = async (to, body) => {
  console.log(`[WhatsApp Service Mock] Sending WhatsApp to ${to}: ${body}`);
  return { success: true, messageId: 'wa-' + Date.now() };
};
