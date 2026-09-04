import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  logs: [],
  loading: false,
  error: null
};

const communicationsSlice = createSlice({
  name: 'communications',
  initialState,
  reducers: {
    fetchLogsStart: (state) => { state.loading = true; },
    fetchLogsSuccess: (state, action) => { state.logs = action.payload; state.loading = false; },
    fetchLogsFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchLogsStart, fetchLogsSuccess, fetchLogsFailure } = communicationsSlice.actions;
export default communicationsSlice.reducer;
