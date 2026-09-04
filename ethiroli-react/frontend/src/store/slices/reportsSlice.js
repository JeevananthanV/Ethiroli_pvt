import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  definitions: [],
  loading: false,
  error: null
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    fetchReportsStart: (state) => { state.loading = true; },
    fetchReportsSuccess: (state, action) => { state.definitions = action.payload; state.loading = false; }
  }
});

export const { fetchReportsStart, fetchReportsSuccess } = reportsSlice.actions;
export default reportsSlice.reducer;
