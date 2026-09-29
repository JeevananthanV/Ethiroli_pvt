import axiosInstance from './axiosInstance.js';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

// --- Reads ---------------------------------------------------------------

export const getEnrollments = async (params) => {
  const response = await axiosInstance.get('/v1/enrollments', { params });
  return unwrap(response);
};

export const listEnrollments = getEnrollments;

export const getMyEnrollments = async () => {
  const response = await axiosInstance.get('/v1/enrollments/me');
  return unwrap(response);
};

export const getStudentCourses = async (studentId, params) => {
  const response = await axiosInstance.get(`/v1/enrollments/student/${studentId}`, { params });
  return unwrap(response);
};

export const getTutorAssignedCourses = async (params) => {
  const response = await axiosInstance.get('/v1/enrollments/tutor/assigned', { params });
  return unwrap(response);
};

export const getCourseEnrollments = async (courseId, params) => {
  const response = await axiosInstance.get(`/v1/courses/${courseId}/enrollments`, { params });
  return unwrap(response);
};

// --- Writes --------------------------------------------------------------

/** Self-enrollment: POST /v1/courses/:courseId/enroll */
export const enrollInCourse = async (courseId, data = {}) => {
  const response = await axiosInstance.post(`/v1/courses/${courseId}/enroll`, {
    course_id: courseId,
    ...data
  });
  return unwrap(response);
};

/** Tutor/admin bulk assignment: POST /v1/enrollments/assign */
export const assignCourses = async (data) => {
  const response = await axiosInstance.post('/v1/enrollments/assign', data);
  return unwrap(response);
};

/** PATCH /v1/enrollments/:id/progress  { progress } */
export const updateProgress = async (id, progress, extra = {}) => {
  const response = await axiosInstance.patch(`/v1/enrollments/${id}/progress`, {
    progress,
    ...extra
  });
  return unwrap(response);
};

export const unenroll = async (id) => {
  const response = await axiosInstance.patch(`/v1/enrollments/${id}/unenroll`);
  return unwrap(response);
};

// Legacy aliases kept so existing imports keep resolving.
export const enrollStudent = assignCourses;
export const completeEnrollment = unenroll;

export const enrollmentApi = {
  getEnrollments,
  listEnrollments,
  getMyEnrollments,
  getStudentCourses,
  getTutorAssignedCourses,
  getCourseEnrollments,
  enrollInCourse,
  enrollStudent,
  assignCourses,
  updateProgress,
  unenroll
};

export default enrollmentApi;
