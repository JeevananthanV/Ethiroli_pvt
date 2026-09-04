export const testIntegrationConnection = async (serviceName) => {
  console.log(`[Integration Service] Testing connection for ${serviceName}...`);
  return { status: 'CONNECTED' };
};
