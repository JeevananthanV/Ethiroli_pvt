import pool from '../config/database.js';
import { logger } from '../config/logger.js';

export const postJob = async (jobId) => {
  logger.info('Posting job to Indeed', { jobId });

  try {
    const publisherKey = process.env.INDEED_PUBLISHER_KEY;

    if (!publisherKey) {
      throw new Error('Indeed publisher key not configured. Set INDEED_PUBLISHER_KEY.');
    }

    const [jobRows] = await pool.execute('SELECT * FROM jobs WHERE id = ?', [jobId]);
    if (jobRows.length === 0) {
      throw new Error('Job not found');
    }

    const job = jobRows[0];

    const response = await fetch(
      `https://api.indeed.com/ads/apisign?publisher=${publisherKey}&format=json&v=2`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job: {
            title: job.title,
            description: job.description,
            location: job.location,
            company: 'Ethiroli',
            type: job.type,
            indeedApplyEnabled: true
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Indeed API error: ${response.status}`);
    }

    const result = await response.json();

    logger.info('Job posted to Indeed', { jobId, externalId: result.jobKey || result.id });

    return { success: true, externalPostId: result.jobKey || result.id, platform: 'indeed', jobId };
  } catch (error) {
    logger.error('Indeed job posting failed', { jobId, error: error.message });
    return { success: false, error: error.message };
  }
};

export const fetchApplications = async (jobId) => {
  logger.info('Fetching Indeed applications', { jobId });

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM candidates WHERE source = ? AND job_id = ?',
      ['INDEED', jobId]
    );

    logger.info('Indeed applications fetched', { jobId, count: rows.length });

    return {
      success: true,
      applications: rows,
      jobId,
      count: rows.length
    };
  } catch (error) {
    logger.error('Indeed application fetch failed', { jobId, error: error.message });
    throw error;
  }
};
