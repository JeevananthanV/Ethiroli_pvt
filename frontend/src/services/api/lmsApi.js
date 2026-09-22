import axiosInstance from './axiosInstance';

export const lmsApi = {
  // 1. Unified LMS Overview
  getLMSOverview: () => axiosInstance.get('/v1/lms/overview'),

  // 2. Academic Batches & Roster
  getBatches: (params) => axiosInstance.get('/v1/lms/batches', { params }),
  createBatch: (payload) => axiosInstance.post('/v1/lms/batches', payload),
  getBatchStudents: (batchId) => axiosInstance.get(`/v1/lms/batches/${batchId}/students`),
  addStudentToBatch: (batchId, payload) => axiosInstance.post(`/v1/lms/batches/${batchId}/students`, payload),

  // 3. Batch Attendance Roll-Call
  getBatchAttendance: (batchId, params) => axiosInstance.get(`/v1/lms/batches/${batchId}/attendance`, { params }),
  markBatchAttendance: (batchId, payload) => axiosInstance.post(`/v1/lms/batches/${batchId}/attendance`, payload),

  // 4. Doubt Management
  getDoubts: (params) => axiosInstance.get('/v1/lms/doubts', { params }),
  submitDoubt: (payload) => axiosInstance.post('/v1/lms/doubts', payload),
  resolveDoubt: (doubtId, payload) => axiosInstance.patch(`/v1/lms/doubts/${doubtId}/resolve`, payload),

  // 5. Student Analytics
  getStudentAnalytics: (params) => axiosInstance.get('/v1/lms/analytics', { params }),
};

export default lmsApi;
