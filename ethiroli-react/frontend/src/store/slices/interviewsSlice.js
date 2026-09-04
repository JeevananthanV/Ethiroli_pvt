import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const interviewsSlice = createSlice({
  name: 'interviews',
  initialState,
  reducers: {
    fetchInterviewsStart: (state) => { state.loading = true; },
    fetchInterviewsSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchInterviewsFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchInterviewsStart, fetchInterviewsSuccess, fetchInterviewsFailure } = interviewsSlice.actions;
export default interviewsSlice.reducer;
