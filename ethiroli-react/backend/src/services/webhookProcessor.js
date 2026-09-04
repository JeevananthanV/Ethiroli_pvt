export const processGenericWebhook = async (webhookPayload) => {
  console.log('[Webhook Processor Service] Received webhook metadata:', webhookPayload);
  return { success: true };
};
