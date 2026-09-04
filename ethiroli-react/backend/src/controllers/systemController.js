import SystemConfig from '../models/SystemConfig.js';
import pool from '../config/database.js';
import User from '../models/User.js';
import Lead from '../models/Lead.js';

export const getHealth = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  });
};

export const updateConfigs = async (req, res) => {
  const { ALLOWED_ORIGINS } = req.body;

  try {
    if (ALLOWED_ORIGINS) {
      if (!Array.isArray(ALLOWED_ORIGINS)) {
        return res.status(400).json({ message: 'ALLOWED_ORIGINS must be a JSON array of strings.' });
      }
      await SystemConfig.set('ALLOWED_ORIGINS', ALLOWED_ORIGINS);
    }

    res.status(200).json({ message: 'System configurations updated successfully.' });
  } catch (error) {
    console.error('Update system config error:', error);
    res.status(500).json({ message: 'Failed to update system configurations.' });
  }
};

export const globalSearch = async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  const queryStr = `%${q.trim().toLowerCase()}%`;
  const isSales = req.user.role === 'SALES';

  try {
    // 1. Search users (Only admin/superadmin can search all users)
    let users = [];
    if (['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      const allUsers = await User.list({ limit: 100 });
      users = allUsers.filter(u => 
        (u.full_name && u.full_name.toLowerCase().includes(q)) || 
        (u.email && u.email.toLowerCase().includes(q))
      );
    }

    // 2. Search leads
    const allLeads = await Lead.list({
      assigned_to: isSales ? req.user.id : undefined,
      limit: 100
    });
    const leads = allLeads.filter(l => 
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.phone && l.phone.includes(q))
    );

    res.status(200).json({
      users,
      leads
    });
  } catch (error) {
    console.error('Global search error:', error);
    res.status(500).json({ message: 'Search execution failed.' });
  }
};
