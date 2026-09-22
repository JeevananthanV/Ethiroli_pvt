import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    fetchAuditStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAuditSuccess: (state, action) => {
      state.items = action.payload;
      state.loading = false;
    },
    fetchAuditFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchAuditStart, fetchAuditSuccess, fetchAuditFailure } = auditSlice.actions;
export default auditSlice.reducer;
