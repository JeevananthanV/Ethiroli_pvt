import pool from '../config/database.js';

export const authenticateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ message: 'Authentication failed. API key is missing.' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM api_keys WHERE api_key = ? AND is_active = TRUE', [apiKey]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Authentication failed. Invalid API key.' });
    }

    req.apiKey = rows[0];
    req.tenant_id = rows[0].tenant_id;
    next();
  } catch (err) {
    next(err);
  }
};
