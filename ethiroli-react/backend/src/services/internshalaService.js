import { logger } from '../config/logger.js';

export const postInternship = async (internshipId) => {
  logger.info('Posting internship to Internshala', { internshipId });

  try {
    const username = process.env.INTERNSHALA_USERNAME;
    const password = process.env.INTERNSHALA_PASSWORD;

    if (!username || !password) {
      throw new Error('Internshala credentials not configured. Set INTERNSHALA_USERNAME and INTERNSHALA_PASSWORD.');
    }

    const loginResponse = await fetch('https://internshala.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email: username, password })
    });

    if (!loginResponse.ok) {
      throw new Error(`Internshala login failed: ${loginResponse.status}`);
    }

    const postResponse = await fetch('https://internshala.com/internship/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ internship_id: internshipId })
    });

    if (!postResponse.ok) {
      throw new Error(`Internshala post failed: ${postResponse.status}`);
    }

    const result = await postResponse.json();

    logger.info('Internship posted to Internshala', { internshipId, externalId: result.id });

    return { success: true, externalPostId: result.id, platform: 'internshala', internshipId };
  } catch (error) {
    logger.error('Internshala posting failed', { internshipId, error: error.message });
    return { success: false, error: error.message };
  }
};

export const fetchApplications = async (internshipId) => {
  logger.info('Fetching Internshala applications', { internshipId });

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM candidates WHERE source = ? AND job_id = ?',
      ['INTERNSHALA', internshipId]
    );

    logger.info('Internshala applications fetched', { internshipId, count: rows.length });

    return {
      success: true,
      applications: rows,
      internshipId,
      count: rows.length
    };
  } catch (error) {
    logger.error('Internshala application fetch failed', { internshipId, error: error.message });
    throw error;
  }
};
