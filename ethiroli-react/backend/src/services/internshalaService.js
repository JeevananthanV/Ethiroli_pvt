export const postJobToInternshala = async (jobDetails) => {
  console.log('[Internshala Service Mock] Posting job to Internshala...');
  return { success: true, externalPostId: 'is-post-' + Date.now() };
};
