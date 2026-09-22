import axiosInstance from './axiosInstance.js';

export const getStudentDashboard = async () => {
  const [enrollmentsRes, projectsRes] = await Promise.all([
    axiosInstance.get('/v1/enrollments/me'),
    axiosInstance.get('/v1/student-projects/projects')
  ]);
  return {
    enrollments: enrollmentsRes.data,
    projects: projectsRes.data
  };
};

export const listStudentCertificates = async () => {
  const response = await axiosInstance.get('/v1/certificates');
  return response.data;
};

export const listStudentBadges = async () => {
  const response = await axiosInstance.get('/v1/badges');
  return response.data;
};

export const listUpcomingQuizzes = async () => {
  const response = await axiosInstance.get('/v1/quizzes', { params: { is_published: true } });
  return response.data;
};
