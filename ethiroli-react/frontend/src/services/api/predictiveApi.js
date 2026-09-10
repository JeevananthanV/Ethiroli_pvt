import axios from '../axios'

export const getStudentChurn = async (params) => {
  const response = await axios.get('/predictive/churn', { params });
  return response.data;
};

export const getChurnDashboard = getStudentChurn;
export const getChurnPredictions = getStudentChurn;

export const getLeadScore = async (id) => {
  const response = await axios.get(id ? `/predictive/lead-score/${id}` : '/predictive/lead-scores');
  return response.data;
};

export const getLeadScoreCard = getLeadScore;
export const getLeadScores = getLeadScore;

export const predictiveApi = {
  getAll: async () => {
    const response = await axios.get('/predictive')
    return response.data
  },

  getById: async (id) => {
    const response = await axios.get(`/predictive/${id}`)
    return response.data
  },

  predict: async (data) => {
    const response = await axios.post('/predictive/predict', data)
    return response.data
  },

  retrain: async (id) => {
    const response = await axios.post(`/predictive/${id}/retrain`)
    return response.data
  },

  getStudentChurn,
  getChurnDashboard,
  getChurnPredictions,
  getLeadScore,
  getLeadScoreCard,
  getLeadScores,
}

export default predictiveApi;
