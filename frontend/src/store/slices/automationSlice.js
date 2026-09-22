import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  workflows: [],
  loading: false,
  error: null
};

const automationSlice = createSlice({
  name: 'automation',
  initialState,
  reducers: {
    fetchWorkflowsStart: (state) => { state.loading = true; },
    fetchWorkflowsSuccess: (state, action) => { state.workflows = action.payload; state.loading = false; }
  }
});

export const { fetchWorkflowsStart, fetchWorkflowsSuccess } = automationSlice.actions;
export default automationSlice.reducer;
