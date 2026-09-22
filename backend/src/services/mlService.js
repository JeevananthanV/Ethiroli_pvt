import pool from '../config/database.js';
import { logger } from '../config/logger.js';

export const scoreLead = async (leadId) => {
  logger.info('Scoring lead', { leadId });

  try {
    const [leadRows] = await pool.execute('SELECT * FROM leads WHERE id = ?', [leadId]);
    if (leadRows.length === 0) {
      throw new Error('Lead not found');
    }

    const lead = leadRows[0];
    const score = calculateLeadScore(lead);

    await pool.execute(
      'INSERT INTO prediction_logs (entity_type, entity_id, score, model_version, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
      ['lead', leadId, score, 'v1.0']
    );

    logger.info('Lead scored', { leadId, score });

    return {
      leadId,
      score,
      confidence: 0.85,
      factors: {
        source: lead.source,
        status: lead.status,
        followUpDate: lead.follow_up_date
      }
    };
  } catch (error) {
    logger.error('Lead scoring failed', { leadId, error: error.message });
    throw error;
  }
};

const calculateLeadScore = (lead) => {
  let score = 0;

  if (lead.status === 'NEW') score += 10;
  else if (lead.status === 'CONTACTED') score += 20;
  else if (lead.status === 'DEMO') score += 40;
  else if (lead.status === 'COUNSELLING') score += 60;
  else if (lead.status === 'ADMISSION') score += 80;
  else if (lead.status === 'PAYMENT') score += 100;
  else if (lead.status === 'LOST') score += 0;

  if (lead.source === 'WEBSITE') score += 5;
  else if (lead.source === 'REFERRAL') score += 15;
  else if (lead.source === 'SOCIAL_MEDIA') score += 5;

  if (lead.follow_up_date && new Date(lead.follow_up_date) < new Date()) {
    score -= 10;
  }

  return Math.min(100, Math.max(0, score));
};

export const predictChurn = async (userId) => {
  logger.info('Predicting churn', { userId });

  try {
    const [userRows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
    if (userRows.length === 0) {
      throw new Error('User not found');
    }

    const user = userRows[0];
    const churnProbability = calculateChurnProbability(user);

    await pool.execute(
      'INSERT INTO prediction_logs (entity_type, entity_id, score, model_version, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
      ['churn', userId, churnProbability, 'v1.0']
    );

    logger.info('Churn prediction completed', { userId, churnProbability });

    return {
      userId,
      churnProbability,
      riskLevel: churnProbability > 0.7 ? 'HIGH' : churnProbability > 0.4 ? 'MEDIUM' : 'LOW',
      factors: { lastLogin: user.last_login_at, role: user.role }
    };
  } catch (error) {
    logger.error('Churn prediction failed', { userId, error: error.message });
    throw error;
  }
};

const calculateChurnProbability = (user) => {
  let probability = 0;

  if (!user.last_login_at) {
    probability += 0.5;
  } else {
    const daysSinceLogin = (Date.now() - new Date(user.last_login_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLogin > 30) probability += 0.4;
    else if (daysSinceLogin > 14) probability += 0.2;
  }

  if (user.is_active === false) {
    probability += 0.5;
  }

  return Math.min(1, probability);
};

export const recommendCourse = async (userId) => {
  logger.info('Recommending courses', { userId });

  try {
    const [userRows] = await pool.execute('SELECT role, preferences FROM users WHERE id = ?', [userId]);
    if (userRows.length === 0) {
      throw new Error('User not found');
    }

    const user = userRows[0];
    const preferences = user.preferences ? JSON.parse(user.preferences) : {};

    const [courses] = await pool.execute(
      'SELECT * FROM courses WHERE is_active = TRUE ORDER BY enrollment_count DESC LIMIT 5'
    );

    const recommended = courses.filter(course => {
      if (preferences.interests) {
        return preferences.interests.some(interest => course.category?.includes(interest));
      }
      return true;
    });

    logger.info('Course recommendations generated', { userId, count: recommended.length });

    return {
      userId,
      recommended: recommended.map(c => c.id),
      courses: recommended
    };
  } catch (error) {
    logger.error('Course recommendation failed', { userId, error: error.message });
    throw error;
  }
};
