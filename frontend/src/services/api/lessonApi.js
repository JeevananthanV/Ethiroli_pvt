import axios from '../axios';

export const listLessons = async (moduleId) => {
  const url = moduleId ? `/modules/${moduleId}/lessons` : '/lessons';
  const response = await axios.get(url);
  return response.data?.data || response.data || [];
};

export const getAllLessons = listLessons;

export const getLesson = async (id) => {
  const response = await axios.get(`/lessons/${id}`);
  return response.data?.data || response.data;
};

export const createLesson = async (moduleIdOrData, maybeData) => {
  let moduleId;
  let data;
  if (typeof moduleIdOrData === 'string') {
    moduleId = moduleIdOrData;
    data = maybeData || {};
  } else {
    data = moduleIdOrData || {};
    moduleId = data.module_id || data.moduleId;
  }

  const url = moduleId ? `/modules/${moduleId}/lessons` : '/lessons';
  const response = await axios.post(url, { ...data, module_id: moduleId });
  return response.data?.data || response.data;
};

export const updateLesson = async (id, data) => {
  const response = await axios.patch(`/lessons/${id}`, data);
  return response.data?.data || response.data;
};

export const deleteLesson = async (id) => {
  const response = await axios.delete(`/lessons/${id}`);
  return response.data?.data || response.data;
};

export const completeLesson = async (id) => {
  const response = await axios.post(`/lessons/${id}/complete`);
  return response.data?.data || response.data;
};

export const reorderLessons = async (moduleId, lessonIds) => {
  const response = await axios.post(`/modules/${moduleId}/lessons/reorder`, { lessonIds });
  return response.data?.data || response.data;
};

export const getLessonBlocks = async (lessonId) => {
  const response = await axios.get(`/lessons/${lessonId}/blocks`);
  return response.data?.data || response.data || [];
};

export const createLessonBlock = async (lessonId, data) => {
  const response = await axios.post(`/lessons/${lessonId}/blocks`, data);
  return response.data?.data || response.data;
};

export const deleteLessonBlock = async (lessonId, blockId) => {
  const response = await axios.delete(`/lessons/${lessonId}/blocks/${blockId}`);
  return response.data?.data || response.data;
};

export const lessonApi = {
  getAll: getAllLessons,
  list: listLessons,
  getById: getLesson,
  create: createLesson,
  update: updateLesson,
  delete: deleteLesson,
  complete: completeLesson,
  reorder: reorderLessons,
  getBlocks: getLessonBlocks,
  createBlock: createLessonBlock,
  deleteBlock: deleteLessonBlock
};

export default lessonApi;
