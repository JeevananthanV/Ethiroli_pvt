import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    fetchPaymentsStart: (state) => { state.loading = true; },
    fetchPaymentsSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchPaymentsFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchPaymentsStart, fetchPaymentsSuccess, fetchPaymentsFailure } = paymentsSlice.actions;
export default paymentsSlice.reducer;
