import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    fetchPayrollStart: (state) => { state.loading = true; },
    fetchPayrollSuccess: (state, action) => { state.items = action.payload; state.loading = false; },
    fetchPayrollFailure: (state, action) => { state.error = action.payload; state.loading = false; }
  }
});

export const { fetchPayrollStart, fetchPayrollSuccess, fetchPayrollFailure } = payrollSlice.actions;
export default payrollSlice.reducer;
