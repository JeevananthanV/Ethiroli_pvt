import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    fetchProjectsStart: (state) => { state.loading = true; },
    fetchProjectsSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchProjectsFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchProjectsStart, fetchProjectsSuccess, fetchProjectsFailure } = projectsSlice.actions;
export default projectsSlice.reducer;
