import ForumPost from '../models/ForumPost.js';
import ForumReply from '../models/ForumReply.js';

export const listPosts = async (req, res) => {
  try {
    const list = await ForumPost.list({ course_id: req.query.course_id });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPost = async (req, res) => {
  try {
    await ForumPost.create({ ...req.body, author_id: req.user.id });
    res.status(201).json({ message: 'Post created.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    const replies = await ForumReply.listByPostId(req.params.id);
    res.status(200).json({ ...post, replies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addReply = async (req, res) => {
  try {
    await ForumReply.create({ ...req.body, post_id: req.params.id, author_id: req.user.id });
    res.status(201).json({ message: 'Reply added.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
