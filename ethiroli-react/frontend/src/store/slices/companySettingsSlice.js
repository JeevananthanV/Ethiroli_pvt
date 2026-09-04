import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  settings: null,
  loading: false,
  error: null
};

const companySettingsSlice = createSlice({
  name: 'companySettings',
  initialState,
  reducers: {
    fetchSettingsStart: (state) => { state.loading = true; },
    fetchSettingsSuccess: (state, action) => { state.settings = action.payload; state.loading = false; },
    fetchSettingsFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchSettingsStart, fetchSettingsSuccess, fetchSettingsFailure } = companySettingsSlice.actions;
export default companySettingsSlice.reducer;
