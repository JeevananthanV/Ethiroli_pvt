import ActivityFeed from '../models/ActivityFeed.js';

export const getFeed = async (req, res) => {
  const { limit = 50, offset = 0 } = req.query;

  try {
    const feeds = await ActivityFeed.listForUser(req.user.id, {
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });
    res.status(200).json(feeds);
  } catch (error) {
    console.error('Get activity feed error:', error);
    res.status(500).json({ message: 'Failed to fetch activity feed.' });
  }
};

export const markRead = async (req, res) => {
  const { id } = req.params;

  try {
    await ActivityFeed.markAsRead(id, req.user.id);
    res.status(200).json({ message: 'Activity marked as read.' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Failed to mark activity as read.' });
  }
};
