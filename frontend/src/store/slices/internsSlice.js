import { createSlice } from '@reduxjs/toolkit';
import { listInterns, getInternDashboard } from '../../services/api/internApi.js';

const initialState = {
  items: [],
  dashboard: null,
  loading: false,
  error: null
};

const internsSlice = createSlice({
  name: 'interns',
  initialState,
  reducers: {
    fetchInternsStart: (state) => { state.loading = true; state.error = null; },
    fetchInternsSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchInternsFailure: (state, action) => { state.error = action.payload; state.loading = false; },
    fetchDashboardSuccess: (state, action) => { state.dashboard = action.payload; state.loading = false; }
  }
});

export const { fetchInternsStart, fetchInternsSuccess, fetchInternsFailure, fetchDashboardSuccess } = internsSlice.actions;

export const fetchInterns = () => async (dispatch) => {
  dispatch(fetchInternsStart());
  try {
    const data = await listInterns();
    dispatch(fetchInternsSuccess(data));
  } catch (error) {
    dispatch(fetchInternsFailure(error.message));
  }
};

export const fetchInternDashboardData = () => async (dispatch) => {
  dispatch(fetchInternsStart());
  try {
    const res = await getInternDashboard();
    const data = res?.data || res;
    dispatch(fetchDashboardSuccess(data));
    return data;
  } catch (error) {
    dispatch(fetchInternsFailure(error.message));
  }
};

export default internsSlice.reducer;
