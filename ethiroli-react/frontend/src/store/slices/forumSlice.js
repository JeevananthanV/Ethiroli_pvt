import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null
};

const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    fetchPostsStart: (state) => { state.loading = true; },
    fetchPostsSuccess: (state, action) => { state.posts = action.payload; state.loading = false; },
    fetchPostsFailure: (state, action) => { state.error = action.payload; state.loading = false; },
    selectPostSuccess: (state, action) => { state.currentPost = action.payload; }
  }
});

export const { fetchPostsStart, fetchPostsSuccess, fetchPostsFailure, selectPostSuccess } = forumSlice.actions;
export default forumSlice.reducer;
