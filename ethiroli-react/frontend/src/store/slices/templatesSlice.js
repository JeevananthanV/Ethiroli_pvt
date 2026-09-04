import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    fetchTemplatesStart: (state) => { state.loading = true; },
    fetchTemplatesSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchTemplatesFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchTemplatesStart, fetchTemplatesSuccess, fetchTemplatesFailure } = templatesSlice.actions;
export default templatesSlice.reducer;
