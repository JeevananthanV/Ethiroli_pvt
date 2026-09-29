import axios from '../axios';

const unwrap = (response) => response?.data?.data ?? response?.data ?? [];

// --- Reads ---------------------------------------------------------------

export const getAssignments = async (params) => {
  const response = await axios.get('/assignments', { params });
  return unwrap(response);
};

export const listAssignments = getAssignments;

/** The signed-in learner's assignment workspace (their own submission attached). */
export const listMyAssignments = async () => {
  const response = await axios.get('/assignments/me');
  return unwrap(response);
};

export const getAssignment = async (id) => {
  const response = await axios.get(`/assignments/${id}`);
  return unwrap(response);
};

/** The caller's own submission for a single assignment. */
export const getMySubmission = async (id) => {
  const response = await axios.get(`/assignments/${id}/mine`);
  return unwrap(response);
};

/** Roster of submissions for one assignment (tutor/admin grading queue). */
export const getSubmissions = async (id) => {
  const response = await axios.get(`/assignments/${id}/submissions`);
  return unwrap(response);
};

// --- Authoring (tutor / admin) -------------------------------------------

export const createAssignment = async (data) => {
  const response = await axios.post('/assignments', data);
  return unwrap(response);
};

export const updateAssignment = async (id, data) => {
  const response = await axios.patch(`/assignments/${id}`, data);
  return unwrap(response);
};

export const deleteAssignment = async (id) => {
  const response = await axios.delete(`/assignments/${id}`);
  return unwrap(response);
};

// --- Submission / grading ------------------------------------------------

const toPayload = (data) => {
  // Accept a plain object or a FormData instance and normalise to JSON,
  // since the API expects an application/json body.
  if (data && typeof FormData !== 'undefined' && data instanceof FormData) {
    const plain = {};
    data.forEach((value, key) => { plain[key] = value; });
    return plain;
  }
  return data || {};
};

export const submitAssignment = async (id, data) => {
  const payload = toPayload(data);
  const response = await axios.post(`/assignments/${id}/submissions`, {
    text_content: payload.text_content ?? payload.textContent ?? null,
    file_url: payload.file_url ?? payload.fileUrl ?? null
  });
  return unwrap(response);
};

export const gradeSubmission = async (submissionId, data) => {
  const response = await axios.patch(`/submissions/${submissionId}/grade`, {
    grade: data.grade,
    feedback: data.feedback ?? null
  });
  return unwrap(response);
};

export const assignmentApi = {
  getAll: getAssignments,
  list: listAssignments,
  listMy: listMyAssignments,
  getById: getAssignment,
  getMySubmission,
  getSubmissions,
  create: createAssignment,
  update: updateAssignment,
  delete: deleteAssignment,
  submit: submitAssignment,
  grade: gradeSubmission,
  gradeSubmission
};

export default assignmentApi;
