import JobBoardPost from '../models/JobBoardPost.js';

export const listJobBoardPosts = async (req, res) => {
  try {
    const list = await JobBoardPost.list();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createJobBoardPost = async (req, res) => {
  try {
    const id = await JobBoardPost.create({ ...req.body, created_by: req.user.id });
    res.status(201).json({ message: 'Job posted to platform.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
