import { AppError, AuthenticationError, AuthorizationError } from '../utils/errors.js';
import pool from '../config/database.js';

export const authenticateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || (req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null);

  if (!apiKey) {
    throw new AuthenticationError('Authentication failed. API key is missing.');
  }

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM api_keys WHERE api_key = ? AND is_active = TRUE',
      [apiKey]
    );
    if (rows.length === 0) {
      throw new AuthenticationError('Authentication failed. Invalid or inactive API key.');
    }

    const keyRecord = rows[0];
    const scopes = keyRecord.scopes ? JSON.parse(keyRecord.scopes) : [];

    req.apiKey = {
      id: keyRecord.id,
      tenant_id: keyRecord.tenant_id,
      user_id: keyRecord.user_id,
      name: keyRecord.name,
      scopes
    };
    req.tenant_id = keyRecord.tenant_id;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AuthenticationError('API key authentication failed.', { original: error.message }));
    }
  }
};

export const requireApiScope = (...requiredScopes) => {
  return (req, res, next) => {
    if (!req.apiKey) {
      throw new AuthorizationError('API key authentication required.');
    }

    const missing = requiredScopes.filter(scope => !req.apiKey.scopes.includes(scope));
    if (missing.length > 0) {
      throw new AuthorizationError(
        'Insufficient API scopes.',
        { requiredScopes, missingScopes: missing, availableScopes: req.apiKey.scopes }
      );
    }

    next();
  };
};
