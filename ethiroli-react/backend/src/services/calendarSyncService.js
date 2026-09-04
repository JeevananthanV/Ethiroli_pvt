export const syncEventToGoogleCalendar = async (eventDetails) => {
  console.log('[Google Calendar Sync Service Mock] Synced event: ' + eventDetails.title);
  return { success: true };
};
