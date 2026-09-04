import CalendarEvent from '../models/CalendarEvent.js';

export const listEvents = async (req, res) => {
  try {
    const list = await CalendarEvent.list({ start: req.query.start, end: req.query.end });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const id = await CalendarEvent.create({ ...req.body, created_by: req.user.id });
    res.status(201).json({ message: 'Event scheduled.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
