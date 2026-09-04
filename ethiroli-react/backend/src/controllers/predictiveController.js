import PredictionLog from '../models/PredictionLog.js';

export const getLeadScore = async (req, res) => {
  try {
    res.status(200).json({ score: 0.85, confidence: 0.90 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStudentChurn = async (req, res) => {
  try {
    res.status(200).json({ churn_probability: 0.12, risk_level: 'LOW' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
