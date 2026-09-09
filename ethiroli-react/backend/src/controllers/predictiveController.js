import PredictionLog from '../models/PredictionLog.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { success } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

export const getLeadScore = asyncHandler(async (req, res) => {
  const leadId = req.params.id;
  return success(res, 200, { lead_id: leadId, score: 0.85, confidence: 0.90, factors: {} }, 'Lead score retrieved');
});

export const getStudentChurn = asyncHandler(async (req, res) => {
  const studentId = req.params.id;
  return success(res, 200, { student_id: studentId, churn_probability: 0.12, risk_level: 'LOW', factors: {} }, 'Churn prediction retrieved');
});

export const listPredictions = asyncHandler(async (req, res) => {
  const { type, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [items, countRow] = await Promise.all([
    PredictionLog.list({ type, limit: parseInt(limit), offset }),
    PredictionLog.count({ type })
  ]);

  return success(res, 200, items, 'Predictions retrieved', {
    page: parseInt(page),
    limit: parseInt(limit),
    total: countRow,
    totalPages: Math.ceil(countRow / parseInt(limit))
  });
});
