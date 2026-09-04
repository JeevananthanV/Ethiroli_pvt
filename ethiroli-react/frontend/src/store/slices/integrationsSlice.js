import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const integrationsSlice = createSlice({
  name: 'integrations',
  initialState,
  reducers: {
    fetchIntegrationsStart: (state) => { state.loading = true; },
    fetchIntegrationsSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchIntegrationsFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchIntegrationsStart, fetchIntegrationsSuccess, fetchIntegrationsFailure } = integrationsSlice.actions;
export default integrationsSlice.reducer;
