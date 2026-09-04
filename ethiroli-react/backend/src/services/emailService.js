// Mock Email service for Phase 1 follow-up emails
export const sendFollowUpEmail = async (to, name, message) => {
  console.log(`[EMAIL SENT] to: ${to} (${name})`);
  console.log(`[EMAIL BODY]: ${message}`);
  return { success: true, messageId: `mock_${Date.now()}` };
};
