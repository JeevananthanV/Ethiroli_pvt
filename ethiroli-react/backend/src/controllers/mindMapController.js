import MindMapNode from '../models/MindMapNode.js';

export const listMindMapNodes = async (req, res) => {
  try {
    const list = await MindMapNode.list({ user_id: req.user.id });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createMindMapNode = async (req, res) => {
  try {
    const id = await MindMapNode.create({ ...req.body, user_id: req.user.id });
    res.status(201).json({ message: 'Mind map node created.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
