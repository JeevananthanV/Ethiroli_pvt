import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pending: [],
  history: [],
  loading: false,
  error: null
};

const approvalsSlice = createSlice({
  name: 'approvals',
  initialState,
  reducers: {
    fetchPendingStart: (state) => { state.loading = true; },
    fetchPendingSuccess: (state, action) => { state.pending = action.payload; state.loading = false; },
    fetchPendingFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchPendingStart, fetchPendingSuccess, fetchPendingFailure } = approvalsSlice.actions;
export default approvalsSlice.reducer;
