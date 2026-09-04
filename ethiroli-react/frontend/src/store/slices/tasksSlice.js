import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    fetchTasksStart: (state) => { state.loading = true; },
    fetchTasksSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchTasksFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchTasksStart, fetchTasksSuccess, fetchTasksFailure } = tasksSlice.actions;
export default tasksSlice.reducer;
