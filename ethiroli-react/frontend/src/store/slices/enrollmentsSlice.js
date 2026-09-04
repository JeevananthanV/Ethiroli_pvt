import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const enrollmentsSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {
    fetchEnrollmentsStart: (state) => { state.loading = true; },
    fetchEnrollmentsSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchEnrollmentsFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchEnrollmentsStart, fetchEnrollmentsSuccess, fetchEnrollmentsFailure } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
