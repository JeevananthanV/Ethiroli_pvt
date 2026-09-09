import pool from '../config/database.js';
import { logger } from '../config/logger.js';

export const postJobToNaukri = async (jobId) => {
  logger.info('Posting job to Naukri', { jobId });

  try {
    const [jobRows] = await pool.execute('SELECT * FROM jobs WHERE id = ?', [jobId]);
    if (jobRows.length === 0) {
      throw new Error('Job not found');
    }

    const job = jobRows[0];
    const username = process.env.NAUKRI_USERNAME;
    const password = process.env.NAUKRI_PASSWORD;

    if (!username || !password) {
      throw new Error('Naukri credentials not configured. Set NAUKRI_USERNAME and NAUKRI_PASSWORD.');
    }

    const response = await fetch('https://api.naukri.com/v1/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
      },
      body: JSON.stringify({
        title: job.title,
        description: job.description,
        location: job.location,
        type: job.type,
        company: 'Ethiroli'
      })
    });

    if (!response.ok) {
      throw new Error(`Naukri API error: ${response.status}`);
    }

    const result = await response.json();

    logger.info('Job posted to Naukri', { jobId, externalId: result.id });

    return { success: true, externalPostId: result.id, platform: 'naukri', jobId };
  } catch (error) {
    logger.error('Naukri job posting failed', { jobId, error: error.message });
    return { success: false, error: error.message };
  }
};

export const fetchApplications = async (jobId) => {
  logger.info('Fetching Naukri applications', { jobId });

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM candidates WHERE source = ? AND job_id = ?',
      ['NAUKRI', jobId]
    );

    logger.info('Naukri applications fetched', { jobId, count: rows.length });

    return {
      success: true,
      applications: rows,
      jobId,
      count: rows.length
    };
  } catch (error) {
    logger.error('Naukri application fetch failed', { jobId, error: error.message });
    throw error;
  }
};
