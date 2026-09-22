import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  logs: [],
  health: null,
  loading: false,
  error: null
};

const monitoringSlice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {
    fetchLogsStart: (state) => { state.loading = true; },
    fetchLogsSuccess: (state, action) => { state.logs = action.payload; state.loading = false; },
    fetchLogsFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchLogsStart, fetchLogsSuccess, fetchLogsFailure } = monitoringSlice.actions;
export default monitoringSlice.reducer;
