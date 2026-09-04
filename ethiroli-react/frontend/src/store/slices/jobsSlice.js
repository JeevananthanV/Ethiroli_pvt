import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    fetchJobsStart: (state) => { state.loading = true; },
    fetchJobsSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchJobsFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchJobsStart, fetchJobsSuccess, fetchJobsFailure } = jobsSlice.actions;
export default jobsSlice.reducer;
