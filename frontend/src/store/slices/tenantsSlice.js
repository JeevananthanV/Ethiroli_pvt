import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  activeTenant: null,
  loading: false,
  error: null
};

const tenantsSlice = createSlice({
  name: 'tenants',
  initialState,
  reducers: {
    fetchTenantsStart: (state) => { state.loading = true; },
    fetchTenantsSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchTenantsFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchTenantsStart, fetchTenantsSuccess, fetchTenantsFailure } = tenantsSlice.actions;
export default tenantsSlice.reducer;
