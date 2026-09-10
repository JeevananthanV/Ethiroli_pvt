import { createSlice } from '@reduxjs/toolkit';
import { getStudentDashboard, listStudentCertificates, listStudentBadges, listUpcomingQuizzes } from '../../services/api/studentApi.js';

const initialState = {
  dashboard: { enrollments: [], projects: [] },
  certificates: [],
  badges: [],
  quizzes: [],
  loading: false,
  error: null
};

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    fetchDashboardStart: (state) => { state.loading = true; state.error = null; },
    fetchDashboardSuccess: (state, action) => { state.dashboard = action.payload; state.loading = false; },
    fetchDashboardFailure: (state, action) => { state.error = action.payload; state.loading = false; },
    fetchCertificatesStart: (state) => { state.loading = true; state.error = null; },
    fetchCertificatesSuccess: (state, action) => { state.certificates = action.payload; state.loading = false; },
    fetchCertificatesFailure: (state, action) => { state.error = action.payload; state.loading = false; },
    fetchBadgesStart: (state) => { state.loading = true; state.error = null; },
    fetchBadgesSuccess: (state, action) => { state.badges = action.payload; state.loading = false; },
    fetchBadgesFailure: (state, action) => { state.error = action.payload; state.loading = false; },
    fetchQuizzesStart: (state) => { state.loading = true; state.error = null; },
    fetchQuizzesSuccess: (state, action) => { state.quizzes = action.payload; state.loading = false; },
    fetchQuizzesFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchDashboardStart, fetchDashboardSuccess, fetchDashboardFailure, fetchCertificatesStart, fetchCertificatesSuccess, fetchCertificatesFailure, fetchBadgesStart, fetchBadgesSuccess, fetchBadgesFailure, fetchQuizzesStart, fetchQuizzesSuccess, fetchQuizzesFailure } = studentsSlice.actions;

export const fetchDashboard = () => async (dispatch) => {
  dispatch(fetchDashboardStart());
  try {
    const data = await getStudentDashboard();
    dispatch(fetchDashboardSuccess(data));
  } catch (error) {
    dispatch(fetchDashboardFailure(error.message));
  }
};

export const fetchCertificates = () => async (dispatch) => {
  dispatch(fetchCertificatesStart());
  try {
    const data = await listStudentCertificates();
    dispatch(fetchCertificatesSuccess(data));
  } catch (error) {
    dispatch(fetchCertificatesFailure(error.message));
  }
};

export const fetchBadges = () => async (dispatch) => {
  dispatch(fetchBadgesStart());
  try {
    const data = await listStudentBadges();
    dispatch(fetchBadgesSuccess(data));
  } catch (error) {
    dispatch(fetchBadgesFailure(error.message));
  }
};

export const fetchQuizzes = () => async (dispatch) => {
  dispatch(fetchQuizzesStart());
  try {
    const data = await listUpcomingQuizzes();
    dispatch(fetchQuizzesSuccess(data));
  } catch (error) {
    dispatch(fetchQuizzesFailure(error.message));
  }
};

export default studentsSlice.reducer;
