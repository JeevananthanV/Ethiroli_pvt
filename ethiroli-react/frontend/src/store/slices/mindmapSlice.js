import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nodes: [],
  loading: false,
  error: null
};

const mindmapSlice = createSlice({
  name: 'mindmap',
  initialState,
  reducers: {
    fetchNodesStart: (state) => { state.loading = true; },
    fetchNodesSuccess: (state, action) => { state.nodes = action.payload; state.loading = false; },
    fetchNodesFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchNodesStart, fetchNodesSuccess, fetchNodesFailure } = mindmapSlice.actions;
export default mindmapSlice.reducer;
