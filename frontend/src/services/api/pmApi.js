import axiosInstance from './axiosInstance';

const unwrap = (res) => res?.data ?? res;

export const pmApi = {
  // Projects
  getProjects: async (params) => unwrap(await axiosInstance.get('/v1/pm/projects', { params })),
  getProjectDetails: async (id) => unwrap(await axiosInstance.get(`/v1/pm/projects/${id}`)),
  createProject: async (data) => unwrap(await axiosInstance.post('/v1/pm/projects', data)),

  // Milestones
  getMilestones: async (params) => unwrap(await axiosInstance.get('/v1/pm/milestones', { params })),
  createMilestone: async (data) => unwrap(await axiosInstance.post('/v1/pm/milestones', data)),
  signoffMilestone: async (id, data) => unwrap(await axiosInstance.put(`/v1/pm/milestones/${id}/signoff`, data)),

  // Sprints
  getSprints: async (params) => unwrap(await axiosInstance.get('/v1/pm/sprints', { params })),
  createSprint: async (data) => unwrap(await axiosInstance.post('/v1/pm/sprints', data)),
  startSprint: async (id) => unwrap(await axiosInstance.put(`/v1/pm/sprints/${id}/start`)),
  completeSprint: async (id, data) => unwrap(await axiosInstance.put(`/v1/pm/sprints/${id}/complete`, data)),

  // Project Files
  getFiles: async (params) => unwrap(await axiosInstance.get('/v1/pm/files', { params })),
  createFile: async (data) => unwrap(await axiosInstance.post('/v1/pm/files', data)),
  deleteFile: async (id) => unwrap(await axiosInstance.delete(`/v1/pm/files/${id}`)),

  // Expenses
  getExpenses: async (params) => unwrap(await axiosInstance.get('/v1/pm/expenses', { params })),
  createExpense: async (data) => unwrap(await axiosInstance.post('/v1/pm/expenses', data)),
  approveExpense: async (id) => unwrap(await axiosInstance.put(`/v1/pm/expenses/${id}/approve`)),
  rejectExpense: async (id) => unwrap(await axiosInstance.put(`/v1/pm/expenses/${id}/reject`)),

  // Performance
  getPerformanceKPIs: async () => unwrap(await axiosInstance.get('/v1/pm/performance/kpis')),
};

export default pmApi;
