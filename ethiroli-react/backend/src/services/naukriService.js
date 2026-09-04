export const postJobToNaukri = async (jobDetails) => {
  console.log('[Naukri Service Mock] Posting job to Naukri...');
  return { success: true, externalPostId: 'nk-post-' + Date.now() };
};
