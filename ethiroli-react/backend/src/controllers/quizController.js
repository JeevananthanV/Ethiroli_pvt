import Quiz from '../models/Quiz.js';

export const createQuiz = async (req, res) => {
  try {
    await Quiz.create(req.body);
    res.status(201).json({ message: 'Quiz created successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });
    res.status(200).json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
