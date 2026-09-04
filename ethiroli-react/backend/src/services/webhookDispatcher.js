export const dispatchWebhookEvent = async (event, payload) => {
  console.log('[Webhook Dispatcher Service Mock] Dispatched outgoing webhook event ' + event);
  return { success: true };
};
