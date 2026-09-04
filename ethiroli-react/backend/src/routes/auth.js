import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js';

const router = express.Router();

const sanitize = (value, maxLen = 255) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
};

router.post('/login', async (req, res) => {
  const username = sanitize(req.body?.username, 100);
  const password = sanitize(req.body?.password, 200);

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const [rows] = await pool.execute('SELECT id, username, password_hash, role FROM admins WHERE username = ?', [username]);
    const admin = rows[0];

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    req.session.adminId = admin.id;
    req.session.role = admin.role;
    req.session.username = admin.username;

    return res.status(200).json({
      message: 'Logged in.',
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed.', error: error.message });
  }
});

router.get('/me', (req, res) => {
  if (!req.session?.adminId) {
    return res.status(401).json({ message: 'Not logged in.' });
  }
  return res.status(200).json({
    user: {
      id: req.session.adminId,
      username: req.session.username,
      role: req.session.role,
    },
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out.' });
  });
});

export default router;
