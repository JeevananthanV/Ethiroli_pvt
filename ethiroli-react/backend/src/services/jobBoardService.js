import pool from '../config/database.js';
import { postJob as postToLinkedIn } from './linkedinService.js';
import { postJobToInternshala } from './internshalaService.js';
import { postJob as postToIndeed } from './indeedService.js';
import { logger } from '../config/logger.js';

export const postToPlatforms = async (jobId, platforms = []) => {
  logger.info('Posting job to platforms', { jobId, platforms });

  const results = [];
  const platformHandlers = {
    linkedin: postToLinkedIn,
    internshala: postJobToInternshala,
    indeed: postToIndeed
  };

  for (const platform of platforms) {
    const handler = platformHandlers[platform];
    if (!handler) {
      results.push({ platform, success: false, error: 'Unsupported platform' });
      continue;
    }

    try {
      const result = await handler(jobId);
      results.push({ platform, ...result });

      await pool.execute(
        `INSERT INTO job_board_posts (job_id, platform, external_post_id, status, created_at)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON DUPLICATE KEY UPDATE external_post_id = VALUES(external_post_id), status = VALUES(status)`,
        [jobId, platform, result.externalPostId, result.success ? 'PUBLISHED' : 'FAILED']
      );
    } catch (error) {
      results.push({ platform, success: false, error: error.message });
      logger.error('Job board posting failed', { jobId, platform, error: error.message });
    }
  }

  return {
    success: true,
    jobId,
    results
  };
};

export const syncApplications = async () => {
  logger.info('Syncing job board applications');

  try {
    const [posts] = await pool.execute(
      "SELECT * FROM job_board_posts WHERE status = 'PUBLISHED' AND last_synced_at < DATE_SUB(NOW(), INTERVAL 1 HOUR)"
    );

    let syncCount = 0;

    for (const post of posts) {
      try {
        if (post.platform === 'indeed') {
          const { syncIndeedCandidates } = await import('./indeedService.js');
          await syncIndeedCandidates();
        }
        syncCount++;
      } catch (error) {
        logger.error('Application sync failed for post', { postId: post.id, error: error.message });
      }
    }

    logger.info('Application sync completed', { syncCount });

    return { success: true, synced: syncCount };
  } catch (error) {
    logger.error('Application sync process failed', { error: error.message });
    throw error;
  }
};
