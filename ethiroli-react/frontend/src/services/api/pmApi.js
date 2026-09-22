import axiosInstance from './axiosInstance';

export const pmApi = {
  // Projects
  getProjects: (params) => axiosInstance.get('/v1/pm/projects', { params }),
  getProjectDetails: (id) => axiosInstance.get(`/v1/pm/projects/${id}`),
  createProject: (data) => axiosInstance.post('/v1/pm/projects', data),

  // Milestones
  getMilestones: (params) => axiosInstance.get('/v1/pm/milestones', { params }),
  createMilestone: (data) => axiosInstance.post('/v1/pm/milestones', data),
  signoffMilestone: (id, data) => axiosInstance.put(`/v1/pm/milestones/${id}/signoff`, data),

  // Sprints
  getSprints: (params) => axiosInstance.get('/v1/pm/sprints', { params }),
  createSprint: (data) => axiosInstance.post('/v1/pm/sprints', data),
  startSprint: (id) => axiosInstance.put(`/v1/pm/sprints/${id}/start`),
  completeSprint: (id, data) => axiosInstance.put(`/v1/pm/sprints/${id}/complete`, data),

  // Project Files
  getFiles: (params) => axiosInstance.get('/v1/pm/files', { params }),
  createFile: (data) => axiosInstance.post('/v1/pm/files', data),
  deleteFile: (id) => axiosInstance.delete(`/v1/pm/files/${id}`),

  // Expenses
  getExpenses: (params) => axiosInstance.get('/v1/pm/expenses', { params }),
  createExpense: (data) => axiosInstance.post('/v1/pm/expenses', data),
  approveExpense: (id) => axiosInstance.put(`/v1/pm/expenses/${id}/approve`),
  rejectExpense: (id) => axiosInstance.put(`/v1/pm/expenses/${id}/reject`),

  // Performance
  getPerformanceKPIs: () => axiosInstance.get('/v1/pm/performance/kpis'),
};

export default pmApi;
