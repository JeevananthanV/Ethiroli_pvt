import pool from '../config/database.js';
import { logger } from '../config/logger.js';

export const detectAnomalies = async (entityType, data) => {
  logger.info('Detecting anomalies', { entityType });

  try {
    const anomalies = [];

    if (entityType === 'login') {
      const { ip, userId, location } = data;

      const [recentLogins] = await pool.execute(
        'SELECT * FROM audit_logs WHERE action = ? AND user_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR) ORDER BY created_at DESC LIMIT 5',
        ['LOGIN', userId]
      );

      const uniqueIPs = [...new Set(recentLogins.map(l => l.ip_address))];
      const uniqueLocations = [...new Set(recentLogins.filter(l => l.new_value).map(l => l.new_value.location))];

      if (uniqueIPs.length > 3) {
        anomalies.push({
          type: 'IMPOSSIBLE_TRAVEL',
          severity: 'HIGH',
          message: 'Multiple IP addresses detected in short time',
          details: { uniqueIPs, recentLogins: recentLogins.length }
        });
      }

      if (uniqueLocations.length > 2) {
        anomalies.push({
          type: 'GEOGRAPHIC_ANOMALY',
          severity: 'MEDIUM',
          message: 'Multiple geographic locations detected',
          details: { uniqueLocations, recentLogins: recentLogins.length }
        });
      }

      if (uniqueIPs.includes(ip) === false && uniqueIPs.length > 0) {
        anomalies.push({
          type: 'NEW_IP_ADDRESS',
          severity: 'LOW',
          message: 'Login from new IP address',
          details: { ip, knownIPs: uniqueIPs }
        });
      }
    }

    if (entityType === 'payment') {
      const { amount, userId } = data;

      const [recentPayments] = await pool.execute(
        'SELECT amount FROM payments WHERE user_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)',
        [userId]
      );

      const avgAmount = recentPayments.reduce((sum, p) => sum + p.amount, 0) / (recentPayments.length || 1);

      if (amount > avgAmount * 5) {
        anomalies.push({
          type: 'UNUSUAL_TRANSACTION',
          severity: 'HIGH',
          message: 'Transaction amount significantly higher than average',
          details: { amount, avgAmount, multiplier: amount / avgAmount }
        });
      }
    }

    if (entityType === 'data_access') {
      const { userId, entityType: accessedType, recordsAccessed } = data;

      const [recentAccess] = await pool.execute(
        'SELECT COUNT(*) as count FROM audit_logs WHERE user_id = ? AND entity_type = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)',
        [userId, accessedType]
      );

      if (recentAccess[0].count > 100) {
        anomalies.push({
          type: 'HIGH_VOLUME_ACCESS',
          severity: 'MEDIUM',
          message: 'Unusually high data access volume',
          details: { accessedType, count: recentAccess[0].count }
        });
      }
    }

    for (const anomaly of anomalies) {
      await logAnomaly(anomaly);
    }

    logger.info('Anomaly detection completed', { entityType, anomaliesFound: anomalies.length });

    return {
      success: true,
      entityType,
      anomalies,
      count: anomalies.length
    };
  } catch (error) {
    logger.error('Anomaly detection failed', { entityType, error: error.message });
    throw error;
  }
};

export const logAnomaly = async (anomaly) => {
  try {
    await pool.execute(
      `INSERT INTO anomaly_logs (type, severity, message, details, created_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        anomaly.type,
        anomaly.severity,
        anomaly.message,
        JSON.stringify(anomaly.details || {})
      ]
    );

    logger.warn('Anomaly logged', { type: anomaly.type, severity: anomaly.severity });
  } catch (error) {
    logger.error('Failed to log anomaly', { error: error.message });
  }
};
