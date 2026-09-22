import axiosInstance from './axiosInstance.js';

export const getInterviews = async () => {
  const response = await axiosInstance.get('/v1/interviews');
  return response.data;
};

export const scheduleInterview = async (data) => {
  const response = await axiosInstance.post('/v1/interviews', data);
  return response.data;
};

export const listInterviews = getInterviews;

export const updateInterview = async (id, data) => {
  const response = await axiosInstance.put(`/v1/interviews/${id}`, data);
  return response.data;
};

export const deleteInterview = async (id) => {
  const response = await axiosInstance.delete(`/v1/interviews/${id}`);
  return response.data;
};

export const updateInterviewStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/v1/interviews/${id}/status`, { status });
  return response.data;
};

export const submitInterviewFeedback = async (id, data) => {
  const response = await axiosInstance.post(`/v1/interviews/${id}/feedback`, data);
  return response.data;
};

export const interviewApi = {
  getAll: getInterviews,
  getInterviews,
  scheduleInterview,
  create: scheduleInterview,
  update: updateInterview,
  delete: deleteInterview,
  updateStatus: updateInterviewStatus,
  submitFeedback: submitInterviewFeedback,
};

export default interviewApi;
