import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    fetchInvoicesStart: (state) => { state.loading = true; },
    fetchInvoicesSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchInvoicesFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchInvoicesStart, fetchInvoicesSuccess, fetchInvoicesFailure } = invoicesSlice.actions;
export default invoicesSlice.reducer;
