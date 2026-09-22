import { logger } from '../config/logger.js';

export const postJob = async (jobId) => {
  logger.info('Posting job to LinkedIn', { jobId });

  try {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    const organizationId = process.env.LINKEDIN_ORGANIZATION_ID;

    if (!accessToken || !organizationId) {
      throw new Error('LinkedIn credentials not configured. Set LINKEDIN_ACCESS_TOKEN and LINKEDIN_ORGANIZATION_ID.');
    }

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify({
        author: `urn:li:organization:${organizationId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: 'New job posting' },
            shareMediaCategory: 'ARTICLE',
            media: [
              {
                status: 'READY',
                description: { text: 'New job posting' },
                originalUrl: `https://ethiroli.com/jobs/${jobId}`
              }
            ]
          }
        },
        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LinkedIn API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    logger.info('Job posted to LinkedIn', { jobId, postId: result.id });

    return { success: true, externalPostId: result.id, platform: 'linkedin', jobId };
  } catch (error) {
    logger.error('LinkedIn job posting failed', { jobId, error: error.message });
    return { success: false, error: error.message };
  }
};

export const searchCandidates = async (jobId) => {
  logger.info('Searching candidates on LinkedIn', { jobId });

  try {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error('LinkedIn access token not configured. Set LINKEDIN_ACCESS_TOKEN.');
    }

    const response = await fetch('https://api.linkedin.com/v2/people-search?q=people&count=10', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status}`);
    }

    const result = await response.json();

    logger.info('LinkedIn candidate search completed', { jobId, count: result.elements?.length || 0 });

    return {
      success: true,
      candidates: result.elements || [],
      jobId
    };
  } catch (error) {
    logger.error('LinkedIn candidate search failed', { jobId, error: error.message });
    return { success: false, error: error.message, candidates: [] };
  }
};
