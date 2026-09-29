import axios from '../axios';

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

/**
 * Course modules + lesson tree annotated with the viewer's completion state,
 * their enrollment, earned certificate and a resume pointer.
 */
export const getCourseCurriculum = async (courseId) => {
  const response = await axios.get(`/courses/${courseId}/curriculum`);
  return unwrap(response);
};

/** Progress-only projection of one course (modules without lesson bodies). */
export const getCourseProgress = async (courseId) => {
  const response = await axios.get(`/courses/${courseId}/progress`);
  return unwrap(response);
};

/** Cross-course learning progress for the signed-in learner. */
export const getMyProgress = async () => {
  const response = await axios.get('/progress/me');
  return unwrap(response);
};

export const progressApi = {
  getCourseCurriculum,
  getCourseProgress,
  getMyProgress
};

export default progressApi;
