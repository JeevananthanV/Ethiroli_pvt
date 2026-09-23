import axios from '../axios';

export const listModules = async (courseId) => {
  const url = courseId ? `/courses/${courseId}/modules` : '/modules';
  const response = await axios.get(url);
  return response.data?.data || response.data || [];
};

export const getAllModules = listModules;

export const getModule = async (id) => {
  const response = await axios.get(`/modules/${id}`);
  return response.data?.data || response.data;
};

export const createModule = async (courseIdOrData, maybeData) => {
  let courseId;
  let data;
  if (typeof courseIdOrData === 'string') {
    courseId = courseIdOrData;
    data = maybeData || {};
  } else {
    data = courseIdOrData || {};
    courseId = data.course_id || data.courseId;
  }

  const url = courseId ? `/courses/${courseId}/modules` : '/modules';
  const response = await axios.post(url, { ...data, course_id: courseId });
  return response.data?.data || response.data;
};

export const updateModule = async (id, data) => {
  const response = await axios.patch(`/modules/${id}`, data);
  return response.data?.data || response.data;
};

export const deleteModule = async (id) => {
  const response = await axios.delete(`/modules/${id}`);
  return response.data?.data || response.data;
};

export const reorderModules = async (courseId, moduleIds) => {
  const response = await axios.post(`/courses/${courseId}/modules/reorder`, { moduleIds });
  return response.data?.data || response.data;
};

export const reorderModule = async (id, order) => {
  return updateModule(id, { module_order: order });
};

export const moduleApi = {
  getAll: getAllModules,
  list: listModules,
  getById: getModule,
  create: createModule,
  update: updateModule,
  delete: deleteModule,
  reorder: reorderModules,
};

export default moduleApi;
