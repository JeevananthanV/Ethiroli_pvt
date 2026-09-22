import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
    fetchReviewsStart: (state) => { state.loading = true; },
    fetchReviewsSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchReviewsFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchReviewsStart, fetchReviewsSuccess, fetchReviewsFailure } = performanceSlice.actions;
export default performanceSlice.reducer;
