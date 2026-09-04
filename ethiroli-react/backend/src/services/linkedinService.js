export const postJobToLinkedIn = async (jobDetails) => {
  console.log('[LinkedIn Service Mock] Posting job to LinkedIn...');
  return { success: true, externalPostId: 'li-post-' + Date.now() };
};
