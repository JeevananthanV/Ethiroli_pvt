import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  loading: false,
  error: null
};

const jobsBoardSlice = createSlice({
  name: 'jobsBoard',
  initialState,
  reducers: {
    fetchPostsStart: (state) => { state.loading = true; },
    fetchPostsSuccess: (state, action) => { state.posts = action.payload; state.loading = false; },
    fetchPostsFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchPostsStart, fetchPostsSuccess, fetchPostsFailure } = jobsBoardSlice.actions;
export default jobsBoardSlice.reducer;
