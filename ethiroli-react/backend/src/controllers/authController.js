import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../models/User.js';
import Session from '../models/Session.js';
import AuditLog from '../models/AuditLog.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Last-login-wins: delete prior sessions for this user
    await Session.deleteByUserId(user.id);

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await Session.create({
      user_id: user.id,
      token,
      expires_at: expiresAt,
      user_agent: req.headers['user-agent'],
      ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown'
    });

    // Update last_login_at
    await User.update(user.id, { last_login_at: new Date() });

    // Set cookie
    res.cookie('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt
    });

    // Log login audit
    await AuditLog.create({
      user_id: user.id,
      action: 'LOGIN',
      entity_type: 'USER',
      entity_id: user.id,
      ip_address: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      user_agent: req.headers['user-agent']
    });

    // Return user information (excluding password_hash)
    const { password_hash, ...safeUser } = user;
    res.status(200).json({
      user: safeUser,
      socket_token: token // Use session token as socket token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
};

export const logout = async (req, res) => {
  const token = req.cookies?.session_token || req.sessionToken;
  try {
    if (token) {
      await Session.deleteByToken(token);
    }
    res.clearCookie('session_token');
    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error during logout.' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const { password_hash, ...safeUser } = user;
    res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ message: 'Internal server error fetching user.' });
  }
};
